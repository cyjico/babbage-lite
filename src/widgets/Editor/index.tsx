import "./styles.css";
import { createEffect, createSignal, For } from "solid-js";
import createOnBeforeInput from "./lib/createOnBeforeInput";
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

  /*
  Avoid re-rendering (as well as caret reset) triggered by changes in `lines`.

  Reason:
  1. DOM is directly manipulated by the user with `contentEditable`.
  2. Mutation is observed causing `lines` to be updated.
  3. Reactive re-rendering occurs.
  */
  {
    // eslint-disable-next-line solid/reactivity
    const linesSnapshot = lines();

    createEffect(() => {
      const fragment = document.createDocumentFragment();
      for (let i = 0; i < linesSnapshot.length; i++) {
        const div = document.createElement("div");
        div.classList.add("line");

        div.textContent = linesSnapshot[i];
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

      for (let i = 0; i < mutations.length; i++) {
        const mutation = mutations[i];

        if (mutation.type === "childList") {
          for (let i = 0; i < mutation.addedNodes.length; i++) {
            const node = mutation.addedNodes[i];

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
          // mutation.target.nodeType is always a Node.TEXT_NODE

          const lineElem = mutation.target.parentElement;
          if (lineElem)
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
        onBeforeInput={createOnBeforeInput(() => contentRef)}
        contentEditable="plaintext-only"
        class="content"
      />
    </div>
  );
}
