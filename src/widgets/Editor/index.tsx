import "./styles.css";
import { createEffect, createSignal, For } from "solid-js";
import createOnKeyDown from "./lib/createOnKeyDown";
import getSelf from "@/shared/lib/getSelf";

/**
 * Editor with a hybrid of SolidJS reactivity and direct DOM manipulation for
 * performance.
 *
 * Those under direct user manipulation will ***not*** be handled by SolidJS.
 * Although, we will keep an internal state of the manipulated lines.
 */
export default function Editor() {
  let contentRef!: HTMLDivElement;

  const lineToIdx = new Map<HTMLElement, number>();
  const [lines, setLines] = createSignal<string[]>([
    "N000 10",
    "N001 5",
    "",
    "L000",
  ]);

  createEffect(() => {
    console.log(lines());
  });

  // Render lines through direct DOM manipulation to avoid re-rendering
  {
    const _lines = lines();
    createEffect(() => {
      const fragment = document.createDocumentFragment();
      for (let i = 0; i < _lines.length; i++) {
        const div = document.createElement("div");
        div.classList.add("line");

        div.textContent = _lines[i];
        if (div.textContent.length === 0)
          div.appendChild(document.createElement("br"));

        lineToIdx.set(div, i);
        fragment.appendChild(div);
      }

      contentRef.appendChild(fragment);
    });
  }

  // Update internal state of the manipulated lines
  createEffect(() => {
    const observer = new MutationObserver((mutations) => {
      // Batch changes to prevent issues where an element is briefly added then
      // removed
      const newLines = lines().slice();

      console.log("");
      for (let i = 0; i < mutations.length; i++) {
        const mutation = mutations[i];
        console.log(`mutation ${i}`);

        if (mutation.type === "childList") {
          for (let i = 0; i < mutation.addedNodes.length; i++) {
            const node = mutation.addedNodes[i];

            console.log("added: ", node, " --> ", mutation.target);

            switch (node.nodeType) {
              case Node.TEXT_NODE:
                // When?
                // - A line's textContent was set
                newLines[lineToIdx.get(mutation.target as HTMLElement)!] =
                  mutation.target.textContent!;
                break;
              case Node.ELEMENT_NODE:
                if ((node as HTMLElement).classList.contains("line")) {
                  // When?
                  // - A newline was inserted
                  const elem = node as HTMLDivElement;

                  let insertIdx = 0;
                  if (elem.previousElementSibling) {
                    insertIdx =
                      lineToIdx.get(
                        elem.previousElementSibling as HTMLElement,
                      )! + 1;
                  } else if (elem.nextElementSibling) {
                    insertIdx = lineToIdx.get(
                      elem.nextElementSibling as HTMLElement,
                    )!;
                  }

                  newLines.splice(insertIdx, 0, elem.textContent!);

                  // Update indecies
                  let curElem: HTMLElement = elem;
                  let curElemIdx = insertIdx;
                  while (curElem) {
                    lineToIdx.set(curElem, curElemIdx);

                    curElem = curElem.nextElementSibling as HTMLElement;
                    curElemIdx = curElemIdx + 1;
                  }
                } else if ((node as HTMLElement).tagName === "BR") {
                  // When?
                  // - A line before newline was made empty
                  // - A line was made empty by the user
                  newLines[lineToIdx.get(mutation.target as HTMLElement)!] =
                    mutation.target.textContent!;
                }
                break;
            }
          }

          for (let i = 0; i < mutation.removedNodes.length; i++) {
            const node = mutation.removedNodes[i];

            console.log("removed: ", node, " --> ", mutation.target);

            switch (node.nodeType) {
              case Node.ELEMENT_NODE:
                if ((node as HTMLElement).classList.contains("line")) {
                  // When?
                  // - A line was removed
                  const idx = lineToIdx.get(node as HTMLDivElement)!;
                  newLines.splice(idx, 1);

                  // Update indecies
                  if (mutation.nextSibling) {
                    let curElem = getSelf(mutation.nextSibling) as HTMLElement;
                    let curElemIdx = idx;
                    while (curElem) {
                      lineToIdx.set(curElem, curElemIdx);

                      curElem = curElem.nextElementSibling as HTMLElement;
                      curElemIdx = curElemIdx + 1;
                    }
                  }
                }
                break;
            }
          }
        } else if (mutation.type === "characterData") {
          // lineElem is guaranteed to be a <div class="line" /> because
          // mutation.target.nodeType is always a Node.TEXT_NODE
          const lineElem = mutation.target.parentElement!;
          newLines[lineToIdx.get(lineElem)!] = lineElem.textContent!;
        }
      }

      setLines(() => newLines);
    });

    observer.observe(contentRef, {
      // Include entire subtree for monitoring
      subtree: true,
      // Monitor child nodes being added/removed
      childList: true,
      // Monitor text (character data) changes
      characterData: true,
    });

    return () => observer.disconnect();
  });

  return (
    <div class="editor">
      <div class="gutters">
        <div class="gutter breakpoints">
          <For each={[]}>
            {(lineNumber) => {
              const top = `top-[${lineNumber * 1.5}rem]`;
              return <div class={`breakpoint ${top}`}>💗</div>;
            }}
          </For>
        </div>

        <div class="gutter line-numbers">
          <For each={lines()}>
            {(_, index) => <div class="line-number">{index() + 1}</div>}
          </For>
        </div>
      </div>

      <div
        ref={contentRef}
        onKeyDown={createOnKeyDown(() => contentRef)}
        contentEditable="plaintext-only"
        class="content"
      />
    </div>
  );
}
