import getElementOrParentElement from "@/shared/lib/getElementOrParentElement";

/**
 * Finds the `.line` element that the node is attached to.
 *
 * If the node is a `.line` element, it returns itself.
 */
export default function getLineElement(node: Node) {
  let line: HTMLElement | null = getElementOrParentElement(node);
  while (line && !line.classList.contains("line")) {
    line = line.parentElement;
  }

  return line;
}
