import onInsertLineBreak from "./onInsertLineBreak";

/**
 * Creates an onKeyDown event handler.
 *
 * @param contentRef Function that points to the `content` element.
 */
export default function createOnBeforeInput(contentRef: () => HTMLElement) {
  return function (ev: InputEvent) {
    const sel = window.getSelection();
    if (!(sel && sel.anchorNode) || sel.type === "None") {
      return;
    }

    if (ev.inputType === "insertLineBreak") {
      onInsertLineBreak(sel, sel.getRangeAt(0), contentRef());

      ev.preventDefault();
    } else if (
      ev.inputType === "deleteContentBackward" &&
      contentRef().childElementCount === 1 &&
      contentRef().firstElementChild!.textContent!.length === 0
    ) {
      ev.preventDefault();
    }
  };
}
