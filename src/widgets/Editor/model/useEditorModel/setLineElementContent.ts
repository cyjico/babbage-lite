/**
 * Sets the `textContent` of a `.line` element.
 *
 * Take note that setting textContent on a node ***removes all*** of the node's
 * children. It then replaces them with a single text node with the given string
 * value.
 *
 * Therefore, it is guaranteed that the ***element will always have a text
 * node*** and, if empty, a `<br />` element.
 */
export default function setLineElementContent(
  ref_lineElement: HTMLElement,
  textContent = "",
) {
  ref_lineElement.textContent = textContent;

  if (textContent.length === 0)
    ref_lineElement.appendChild(document.createElement("br"));
}
