import "./Editor.css";
import { For, onCleanup, onMount } from "solid-js";
import { useEditorContext } from "../ContextProvider";
import captureSelectionDOM from "../infra/captureSelectionDOM";
import createInputHandler from "../lib/createInputHandler";
import updateSelectionDOM from "../infra/updateSelectionDOM";
import { InterpreterStatus } from "@/entities/Interpreter";

export default function Editor(props: { class?: string }) {
  let content!: HTMLDivElement;
  const { interpreter, editorState, editorDebugger, editorHistory } =
    useEditorContext();
  const inputHandler = createInputHandler(editorState, editorHistory);

  const selectionChangeListener = (_: Event) =>
    captureSelectionDOM(editorState.setSel);
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
            ev.preventDefault();

            editorDebugger.toggleBreakpt(calculateLineFromPointer(ev, 1.5));
          }}
        >
          <For each={Array.from(editorDebugger.breakpts().values())}>
            {(line) => {
              return (
                <div
                  class="breakpoint hover:opacity-50"
                  style={{
                    transform: `translateY(${calculateRemFromLine(line, 1.5)}rem)`,
                  }}
                >
                  🔴
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
        on:pointerdown={() => inputHandler.endGroup()}
        on:beforeinput={(ev) => {
          ev.preventDefault();

          switch (ev.inputType) {
            case "insertFromYank":
            case "insertFromDrop":
              // To know where the user tried to yank/drop the text
              captureSelectionDOM(editorState.setSel);
              break;
          }

          if (interpreter.status() !== InterpreterStatus.Halted) return;

          inputHandler.handleBeforeInput(ev);

          scheduleUpdateSelectionDOM();
        }}
        on:keydown={(ev) => {
          if (inputHandler.handleKeyDown(ev)) {
            scheduleUpdateSelectionDOM();
            return;
          }

          // metaKey is for Apple
          if (ev.ctrlKey || ev.metaKey) {
            if (ev.key === "z") {
              ev.preventDefault();

              queueMicrotask(() => {
                editorHistory.undo();
                inputHandler.endGroup();
              });
              scheduleUpdateSelectionDOM();
              return;
            } else if (ev.key === "y") {
              ev.preventDefault();

              queueMicrotask(() => {
                editorHistory.redo();
                inputHandler.endGroup();
              });
              scheduleUpdateSelectionDOM();
              return;
            }
          }

          if (
            ev.key.startsWith("Arrow") ||
            ev.key === "Home" ||
            ev.key === "End" ||
            ev.key.startsWith("Page")
          ) {
            inputHandler.endGroup();
            return;
          }
        }}
      >
        <For each={editorState.lines}>
          {(value, idx) => {
            return (
              <div
                class={`line${
                  interpreter.status() !== InterpreterStatus.Halted &&
                  interpreter.currentCard.ln === idx()
                    ? " --active"
                    : ""
                }`}
                data-id={`${idx()}`}
              >
                {value.length === 0 ? <br /> : value}
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
      lineHeight,
  );
}

function calculateRemFromLine(line: number, lineHeight: number) {
  return line * lineHeight;
}
