import "./styles.css";
import { createEffect, For } from "solid-js";
import createOnKeyDown from "./lib/createOnKeyDown";

export type LineEventListener = (added: Map<Node, MutationRecord>) => void;

export default function Editor() {
  let ref_content!: HTMLDivElement;
  let ref_gutter_lineNumbers!: HTMLDivElement;
  const onLineAddListeners = new Set<LineEventListener>();
  const onLineRemoveListeners = new Set<LineEventListener>();
  const onLineTextChangeListeners = new Set<LineEventListener>();

  // Monitor changes in ref_content
  createEffect(() => {
    const observer = new MutationObserver((mutations) => {
      // Batch changes to prevent issues where an element is briefly added then removed
      const added = new Map<Node, MutationRecord>();
      const removed = new Map<Node, MutationRecord>();
      const textChanged = new Map<Node, MutationRecord>();

      for (const mutation of mutations) {
        if (mutation.type === "childList") {
          for (const node of mutation.removedNodes) {
            if (
              !(
                node.nodeType === Node.ELEMENT_NODE &&
                (node as HTMLElement).classList.contains("line")
              )
            )
              continue;

            removed.set(node, mutation);
            added.delete(node);
          }

          for (const node of mutation.addedNodes) {
            if (
              !(
                node.nodeType === Node.ELEMENT_NODE &&
                (node as HTMLElement).classList.contains("line")
              )
            )
              continue;

            added.set(node, mutation);
            removed.delete(node);
          }
        } else if (mutation.type === "characterData") {
          textChanged.set(mutation.target, mutation);
        }
      }

      if (removed.size > 0)
        for (const listener of onLineRemoveListeners) listener(removed);

      if (added.size > 0)
        for (const listener of onLineAddListeners) listener(added);

      if (textChanged.size > 0)
        for (const listener of onLineTextChangeListeners) listener(textChanged);
    });

    observer.observe(ref_content, {
      // Include entire subtree for monitoring
      subtree: true,
      // Monitor child nodes being added/removed
      childList: true,
      // Monitor text (character data) changes and include its old value
      characterData: true,
      characterDataOldValue: true,
    });

    return () => observer.disconnect();
  });

  onLineAddListeners.add((lines) => {
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < lines.size; i++) {
      const node = document.createElement("div");
      node.classList.add("line-number");
      node.textContent = (
        ref_gutter_lineNumbers.childElementCount + 1
      ).toString();

      fragment.appendChild(node);
    }

    ref_gutter_lineNumbers.appendChild(fragment);
  });

  onLineRemoveListeners.add((lines) => {
    for (let i = 0; i < lines.size; i++) {
      ref_gutter_lineNumbers.lastChild?.remove();
    }
  });

  return (
    <div class="editor">
      <div class="gutters">
        <div class="gutter breakpoints">
          <For each={[]}>
            {(lineNumber) => {
              const top = `top-[${lineNumber * 1.5}rem]`;
              return <div class={`breakpoint ${top}`}>💗</div>;
            }}
          </For>
        </div>

        <div ref={ref_gutter_lineNumbers} class="gutter line-numbers">
          <div class="line-number">1</div>
          <div class="line-number">2</div>
          <div class="line-number">3</div>
          <div class="line-number">4</div>
        </div>
      </div>

      <div
        ref={ref_content}
        onKeyDown={createOnKeyDown(() => ref_content)}
        contentEditable="plaintext-only"
        class="content"
      >
        <div class="line">N000 10</div>
        <div class="line">
          <br />
        </div>
        <div class="line">N001 5</div>
        <div class="line">L000</div>
      </div>
    </div>
  );
}
