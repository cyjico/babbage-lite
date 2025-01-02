import onInsertLineBreak from "./onInsertLineBreak";

/**
 * Creates an onKeyDown event handler.
 *
 * @param ref_content Function that points to the `content` element.
 */
export default function createOnBeforeInputListener(
  ref_content: () => HTMLElement,
) {
  return function (ev: InputEvent) {
    const sel = window.getSelection();
    if (!(sel && sel.anchorNode) || sel.type === "None") {
      return;
    }

    if (ev.inputType === "insertLineBreak") {
      onInsertLineBreak(sel, sel.getRangeAt(0), ref_content());

      ev.preventDefault();
    } else if (
      ev.inputType === "deleteContentBackward" &&
      ref_content().childElementCount === 1 &&
      ref_content().firstElementChild!.textContent!.length === 0
    ) {
      ev.preventDefault();
    }
  };
}
