import getLineElement from "../getLineElement";
import setLineElementContent from "../setLineElementContent";

export default function onInsertFrom(
  selRange: Range,
  ref_content: HTMLElement,
  evData: string,
) {
  const splitEvData = evData.split(/(?:\r\n|\r|\n)/g);

  const startLine = getLineElement(selRange.startContainer)!;
  const prefix = startLine.textContent!.slice(0, selRange.startOffset);

  let endLine = getLineElement(selRange.endContainer)!;
  const postfix = endLine.textContent!.slice(selRange.endOffset);

  selRange.deleteContents();

  if (splitEvData.length <= 1) {
    // Set startLine to PREFIX + FIRST_DATA + POSTFIX
    setLineElementContent(startLine, prefix + splitEvData[0] + postfix);

    if (startLine !== endLine) {
      // if:(selected multiple lines)
      endLine.remove();
    }

    // Set caret position after prefix + FIRST_DATA
    selRange.setStart(
      startLine.firstChild!,
      prefix.length + splitEvData[0].length,
    );
  } else {
    if (startLine === endLine) {
      // if:(selected one line)
      const div = document.createElement("div");
      div.classList.add("line");
      startLine.insertAdjacentElement("afterend", div);

      endLine = div;
    }

    // Set startLine to PREFIX + FIRST_DATA
    setLineElementContent(startLine, prefix + splitEvData[0]);

    // Handle middle lines
    const fragment = document.createDocumentFragment();
    for (let i = 1; i < splitEvData.length - 1; i++) {
      const div = document.createElement("div");
      div.classList.add("line");
      setLineElementContent(div, splitEvData[i]);

      fragment.appendChild(div);
    }
    ref_content.insertBefore(fragment, endLine);

    // Set endLine to LAST_DATA + POSTFIX
    setLineElementContent(
      endLine,
      splitEvData[splitEvData.length - 1] + postfix,
    );

    // Set caret position after LAST_DATA + POSTFIX
    selRange.setStart(
      endLine.firstChild!,
      splitEvData[splitEvData.length - 1].length,
    );
  }

  selRange.collapse(true);
}
