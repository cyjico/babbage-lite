/**
 * Finds the element that the node is contained.
 * If the node itself is an element, it returns the node.
 */
export default function getSelf(node: Node) {
  if (node.nodeType !== Node.ELEMENT_NODE) {
    if (!node.parentElement) {
      throw new Error("Node is not contained within an HTMLElement");
    }

    return node.parentElement as Node;
  }

  return node;
}
