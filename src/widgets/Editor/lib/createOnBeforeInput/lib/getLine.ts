import getSelf from "@/shared/lib/getSelf";

/**
 * Finds the `.line` element that the node is attached to.
 *
 * If the node is a `.line` element, it returns itself.
 */
export default function getLine(node: Node) {
  let line: HTMLElement | null = getSelf(node);
  while (line && !line.classList.contains("line")) {
    line = line.parentElement;
  }

  return line;
}
