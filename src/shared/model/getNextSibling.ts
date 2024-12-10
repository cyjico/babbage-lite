/**
 * Finds the next sibling element of the parent element if the given node is inside an element.
 * If the node itself is an element, it finds the next sibling of that element.
 *
 * @returns Next element sibling or `null` if none exists.
 */
export default function getNextSibling(node: Node) {
  if (node.nodeType !== Node.ELEMENT_NODE) {
    if (!node.parentElement) {
      throw new Error("Node is not contained within an HTMLElement");
    }

    return (
      node.parentElement.nextElementSibling &&
      (node.parentElement.nextElementSibling as Node)
    );
  }

  let sibling = node.nextSibling;
  while (sibling && sibling.nodeType !== Node.ELEMENT_NODE) {
    sibling = sibling.nextSibling;
  }

  return sibling && (sibling as Node);
}
