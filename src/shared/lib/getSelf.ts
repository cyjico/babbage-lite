/**
 * Finds the element that the node is attached to. If the node itself is an
 * element, it returns the node.
 *
 * @throws `Error` if the node is not inside an element.
 */
export default function getSelf(node: Node) {
  if (node.nodeType !== Node.ELEMENT_NODE) {
    if (!node.parentElement)
      throw new Error("Node was found to have no parent element");

    return node.parentElement as HTMLElement;
  }

  return node as HTMLElement;
}
