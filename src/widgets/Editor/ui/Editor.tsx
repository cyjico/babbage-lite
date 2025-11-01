import "./Editor.css";
import { For, onCleanup, onMount } from "solid-js";
import { useEditorContext } from "../ContextProvider";
import createBeforeInputListener from "../lib/createBeforeInputListener";
import createSelectionChangeListener from "../lib/createSelectionChangeListener";

export default function Editor(props: { class?: string }) {
  let content!: HTMLDivElement;
  const { editorState, editorDebugger } = useEditorContext();

  const selectionChangeListener = createSelectionChangeListener(editorState);
  const beforeInputListener = createBeforeInputListener(
    () => content,
    editorState,
  );
  onMount(() => {
    document.addEventListener("selectionchange", selectionChangeListener);
    content.addEventListener("beforeinput", beforeInputListener);
  });

  onCleanup(() => {
    document.removeEventListener("selectionchange", selectionChangeListener);
    content.removeEventListener("beforeinput", beforeInputListener);
  });

  return (
    <div class={`editor ${props.class ?? ""}`}>
      <div class="gutters">
        <div
          class="gutter breakpoints"
          on:pointerdown={(ev) => {
            // uses line-height: 1.5
            const line = Math.floor(
              (ev.clientY - ev.currentTarget.getBoundingClientRect().top) /
                parseFloat(
                  getComputedStyle(document.documentElement).fontSize,
                ) /
                1.5 +
                1,
            );

            editorDebugger._setBreakpts((prev) => {
              const next = new Set(prev);
              if (next.has(line)) next.delete(line);
              else next.add(line);

              return next;
            });
          }}
        >
          <For each={Array.from(editorDebugger.breakpts().values())}>
            {(lineNumber) => {
              // uses line-height: 1.5
              return (
                <div
                  class="breakpoint"
                  style={{
                    transform: `translateY(${(lineNumber - 1) * 1.5}rem)`,
                  }}
                >
                  💗
                </div>
              );
            }}
          </For>
        </div>

        <div class="gutter line-numbers">
          <For each={editorState.lines}>
            {(_, index) => <div class="line-number">{index() + 1}</div>}
          </For>
        </div>
      </div>

      <div ref={content} contentEditable="plaintext-only" class="content">
        <For each={editorState.lines}>
          {(v, i) => {
            return (
              <div class="line" id={`${i()}`}>
                {v.length === 0 ? <br /> : v}
              </div>
            );
          }}
        </For>
      </div>
    </div>
  );
}
