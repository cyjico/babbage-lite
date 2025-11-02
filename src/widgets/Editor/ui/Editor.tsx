import "./Editor.css";
import { For, onCleanup, onMount } from "solid-js";
import { useEditorContext } from "../ContextProvider";
import captureSelectionDOM from "../infra/captureSelectionDOM";
import createBeforeInputHandler from "../lib/createBeforeInputHandler";
import updateSelectionDOM from "../infra/updateSelectionDOM";

export default function Editor(props: { class?: string }) {
  let content!: HTMLDivElement;
  const { editorState, editorDebugger, editorHistory } = useEditorContext();
  const beforeInputHandler = createBeforeInputHandler(
    editorState,
    editorHistory,
  );

  const selectionChangeListener = (_: Event) =>
    captureSelectionDOM(editorState._setSel);
  onMount(() => {
    document.addEventListener("selectionchange", selectionChangeListener);
  });
  onCleanup(() => {
    document.removeEventListener("selectionchange", selectionChangeListener);
  });

  // To avoid queueing the same function multiple times
  let scheduledUpdateSelectionDOM = false;
  function scheduleUpdateSelectionDOM() {
    if (scheduledUpdateSelectionDOM) return;

    scheduledUpdateSelectionDOM = true;
    queueMicrotask(() => {
      updateSelectionDOM(content, editorState.sel);
      scheduledUpdateSelectionDOM = false;
    });
  }

  return (
    <div class={`editor ${props.class ?? ""}`}>
      <div class="gutters">
        <div
          class="gutter breakpoints"
          on:pointerdown={(ev) => {
            editorDebugger.toggleBreakpt(calculateLineFromPointer(ev, 1.5));
          }}
        >
          <For each={Array.from(editorDebugger.breakpts().values())}>
            {(line) => {
              return (
                <div
                  class="breakpoint"
                  style={{
                    transform: `translateY(${calculateRemFromLine(line, 1.5)}rem)`,
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
        onMouseDown={() => beforeInputHandler.endGroup()}
        onBeforeInput={(ev) => {
          ev.preventDefault();

          switch (ev.inputType) {
            case "insertFromYank":
            case "insertFromDrop":
              // To know where the user tried to yank/drop the text
              captureSelectionDOM(editorState._setSel);
              break;
          }

          beforeInputHandler.handle(ev);

          scheduleUpdateSelectionDOM();
        }}
        onKeyDown={(ev) => {
          // metaKey is for Apple
          if (ev.ctrlKey || ev.metaKey) {
            if (ev.key === "z") {
              ev.preventDefault();

              queueMicrotask(() => {
                editorHistory.undo();
                beforeInputHandler.endGroup();
              });
              scheduleUpdateSelectionDOM();
            } else if (ev.key === "y") {
              ev.preventDefault();

              queueMicrotask(() => {
                editorHistory.redo();
                beforeInputHandler.endGroup();
              });
              scheduleUpdateSelectionDOM();
            }
          }

          if (
            ev.key.startsWith("Arrow") ||
            ev.key === "Home" ||
            ev.key === "End" ||
            ev.key.startsWith("Page")
          )
            beforeInputHandler.endGroup();
        }}
      >
        <For each={editorState.lines}>
          {(v, i) => {
            return (
              <div class="line" data-id={`${i()}`}>
                {v.length === 0 ? <br /> : v}
              </div>
            );
          }}
        </For>
      </div>
    </div>
  );
}

function calculateLineFromPointer(
  ev: PointerEvent & {
    currentTarget: HTMLDivElement;
    target: Element;
  },
  lineHeight: number,
) {
  return Math.floor(
    (ev.clientY - ev.currentTarget.getBoundingClientRect().top) /
      parseFloat(getComputedStyle(document.documentElement).fontSize) /
      lineHeight +
      1,
  );
}

function calculateRemFromLine(line: number, lineHeight: number) {
  return (line - 1) * lineHeight;
}
