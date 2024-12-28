import getSelf from "@/shared/lib/getSelf";
import { useEditorContext } from "../../ContextProvider";
import createOnSelectionChangeListener from "./createOnSelectionChangeListener";
import createOnBeforeInputListener from "./createOnBeforeInputListener";
import createLineElements from "./createLineElements";

export default function useEditorModel(ref_content: () => HTMLElement) {
  const { _setSelection, lines, _setLines } = useEditorContext();
  
  const lineElementToIdx = new Map<HTMLElement, number>();
  const lineElements = createLineElements(lines(), lineElementToIdx);

  const observer = new MutationObserver((mutations) => {
    // Batch changes to handle rapid addition & deletion of elements
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
              newLines[lineElementToIdx.get(mutation.target as HTMLElement)!] =
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

  const onBeforeInput = createOnBeforeInputListener(ref_content);
  const onSelectionChange = createOnSelectionChangeListener(_setSelection);

  return {
    imperativeEffect: () => {
      const contentValue = ref_content();

      contentValue.appendChild(lineElements);

      observer.observe(contentValue, {
        // Include entire subtree for monitoring
        subtree: true,
        // Monitor child nodes being added/removed
        childList: true,
        // Monitor text (character data) changes
        characterData: true,
      });

      contentValue.addEventListener("beforeinput", onBeforeInput);
      document.addEventListener("selectionchange", onSelectionChange);
    },
    imperativeCleanup: () => {
      const content = ref_content();

      observer.disconnect();

      content.removeEventListener("beforeinput", onBeforeInput);
      document.removeEventListener("selectionchange", onSelectionChange);
    },
    onBeforeInput: createOnBeforeInputListener(ref_content),
  };
}
