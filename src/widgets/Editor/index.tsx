import getNextSibling from "@/shared/model/getNextSibling";
import getSelf from "@/shared/model/getSelf";
import "./styles.css";
import { For } from "solid-js";

interface Props {
  breakpoints: number[];
}

export default function Editor(props: Props) {
  let ref_editorLines!: HTMLDivElement;

  function onKeyDown(ev: KeyboardEvent) {
    const sel = window.getSelection();
    if (!sel || !sel.anchorNode) {
      return null;
    }
    const selRange = sel.getRangeAt(0);

    const nextSibling = getNextSibling(sel.anchorNode);

    if (ev.key === "Enter") {
      switch (sel.type) {
        case "Caret":
          {
            const divElement = document.createElement("div");
            divElement.classList.add("line");

            const newLine =
              selRange.endContainer.textContent?.slice(selRange.endOffset) ||
              "";
            if (newLine.length === 0) {
              divElement.appendChild(document.createElement("br"));
            } else {
              const curLineElem = getSelf(selRange.endContainer);
              const curLine =
                curLineElem.textContent?.slice(0, selRange.endOffset) || "";

              curLineElem.textContent = curLine;

              if (curLine.length === 0) {
                curLineElem.appendChild(document.createElement("br"));
              }

              divElement.textContent = newLine;
            }

            if (nextSibling) {
              ref_editorLines.insertBefore(divElement, nextSibling);
            } else {
              ref_editorLines.appendChild(divElement);
            }

            selRange.setStart(divElement, 0);
          }

          ev.preventDefault();
          break;
        case "Range":
          {
            // Remove selected text
            const endLineElem = getSelf(selRange.endContainer);
            const endOffset = selRange.endOffset;

            selRange.deleteContents();

            if (selRange.commonAncestorContainer === ref_editorLines) {
              // Selected text is multiline
              if (endLineElem.textContent?.slice(endOffset).length === 0) {
                endLineElem.appendChild(document.createElement("br"));
              }

              selRange.setStart(endLineElem, 0);
            } else {
              // Selected text is a single line
              const divElement = document.createElement("div");
              divElement.classList.add("line");

              const newLine = endLineElem.textContent?.slice(endOffset) || "";
              if (newLine.length === 0) {
                divElement.appendChild(document.createElement("br"));
              } else {
                const curLineElem = endLineElem;
                const curLine =
                  curLineElem.textContent?.slice(0, endOffset) || "";

                curLineElem.textContent = curLine;

                if (curLine.length === 0) {
                  curLineElem.appendChild(document.createElement("br"));
                }

                divElement.textContent = newLine;
              }

              if (nextSibling) {
                ref_editorLines.insertBefore(divElement, nextSibling);
              } else {
                ref_editorLines.appendChild(divElement);
              }

              selRange.setStart(divElement, 0);
            }

            selRange.collapse(true);
          }

          ev.preventDefault();
          break;
        default:
          console.warn("Unhandled selection type.", sel);
          break;
      }
    }
  }

  return (
    <div class="editor">
      <div class="editor__gutters">
        <div class="gutter breakpoints">
          <For each={props.breakpoints}>
            {(lineNumber) => {
              const top = `top-[${lineNumber * 1.5}rem]`;
              return <div class={`breakpoint ${top}`}>💗</div>;
            }}
          </For>
        </div>

        <div class="gutter line-numbers">
          <div class="line-number">1</div>
          <div class="line-number">2</div>
          <div class="line-number">3</div>
          <div class="line-number">4</div>
        </div>
      </div>

      <div
        ref={ref_editorLines}
        onKeyDown={onKeyDown}
        contentEditable="plaintext-only"
        class="editor__lines"
      >
        <div class="line">N000 10</div>
        <div class="line">N</div>
        <div class="line">
          <br />
        </div>
        <div class="line">N001 5</div>
        <div class="line">L000</div>
      </div>
    </div>
  );
}
