import "./styles.css";
import { createEffect, For } from "solid-js";
import { useEditor } from "./Provider";
import getSelf from "@/shared/lib/getSelf";
import createOnBeforeInput from "./lib/createOnBeforeInput";
import createLineElements from "./lib/createLineElements";
import createOnSelectionChange from "./lib/createOnSelectionChange";

/**
 * Implementation uses a mix of SolidJS reactivity and DOM manipulation.
 *
 * To keep it short, the user editing lines will mean a direct manipulation of
 * the DOM. But, to keep track of the changes (and to respond to the changes),
 * we will use SolidJS's `signals`.
 */
export default function Editor(props: { class?: string }) {
  let ref_content!: HTMLDivElement;

  const lineElementToIdx = new Map<HTMLElement, number>();
  const { _setSelection, lines, _setLines } = useEditor();

  createEffect(() => {
    const onSelectionChange = createOnSelectionChange(_setSelection);
    document.addEventListener("selectionchange", onSelectionChange);

    return () =>
      document.removeEventListener("selectionchange", onSelectionChange);
  });

  // Render the lines by directly manipulating the DOM (untrack changes)
  {
    const lineElements = createLineElements(lines(), lineElementToIdx);

    createEffect(() => {
      ref_content.appendChild(lineElements);
    });
  }

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
                newLines[
                  lineElementToIdx.get(mutation.target as HTMLElement)!
                ] = mutation.target.textContent!;
                break;
              case Node.ELEMENT_NODE:
                if ((node as HTMLElement).classList.contains("line")) {
                  // When?
                  // - A newline was inserted
                  const elem = node as HTMLDivElement;

                  let insertIdx = 0;
                  if (elem.previousElementSibling) {
                    insertIdx =
                      lineElementToIdx.get(
                        elem.previousElementSibling as HTMLElement,
                      )! + 1;
                  } else if (elem.nextElementSibling) {
                    insertIdx = lineElementToIdx.get(
                      elem.nextElementSibling as HTMLElement,
                    )!;
                  }

                  newLines.splice(insertIdx, 0, elem.textContent!);

                  // Update indecies
                  let curElem: HTMLElement = elem;
                  let curElemIdx = insertIdx;
                  while (curElem) {
                    lineElementToIdx.set(curElem, curElemIdx);

                    curElem = curElem.nextElementSibling as HTMLElement;
                    curElemIdx = curElemIdx + 1;
                  }
                } else if ((node as HTMLElement).tagName === "BR") {
                  // When?
                  // - A line before newline was made empty
                  // - A line was made empty by the user
                  newLines[
                    lineElementToIdx.get(mutation.target as HTMLElement)!
                  ] = mutation.target.textContent!;
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
                  const idx = lineElementToIdx.get(node as HTMLDivElement)!;
                  newLines.splice(idx, 1);

                  // Update indecies
                  if (mutation.nextSibling) {
                    let curElem = getSelf(mutation.nextSibling) as HTMLElement;
                    let curElemIdx = idx;
                    while (curElem) {
                      lineElementToIdx.set(curElem, curElemIdx);

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
            newLines[lineElementToIdx.get(lineElem)!] = lineElem.textContent!;
        }
      }

      _setLines(newLines);
    });

    observer.observe(ref_content, {
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
    <div class={`editor ${props.class ?? ""}`}>
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
        ref={ref_content}
        onBeforeInput={createOnBeforeInput(() => ref_content)}
        contentEditable="plaintext-only"
        class="content"
      />
    </div>
  );
}

export interface EditorSelection {
  startContainer: Node;
  startOffset: number;
  endContainer: Node;
  endOffset: number;
}
