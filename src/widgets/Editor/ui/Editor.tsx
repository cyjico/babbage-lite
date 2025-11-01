import "./Editor.css";
import { For, onCleanup, onMount } from "solid-js";
import { useEditorContext } from "../ContextProvider";
import createBeforeInputListener from "../lib/createBeforeInputListener";
import updateSelection from "../lib/updateSelection";
import captureSelection from "../lib/captureSelection";

export default function Editor(props: { class?: string }) {
  let content!: HTMLDivElement;
  const { editorHistory, editorState, editorDebugger } = useEditorContext();

  const selectionChangeListener = (_: Event) => captureSelection(editorState);
  const beforeInputListener = createBeforeInputListener(
    () => content,
    editorHistory,
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

      <div
        ref={content}
        contentEditable="plaintext-only"
        class="content"
        on:keydown={(ev) => {
          if (ev.ctrlKey || ev.metaKey) {
            if (ev.key === "z") {
              ev.preventDefault();

              editorHistory.undo(editorState);
              updateSelection(content, editorState.sel);
            } else if (ev.key === "y") {
              ev.preventDefault();

              editorHistory.redo(editorState);
              updateSelection(content, editorState.sel);
            }
          }
        }}
      >
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
