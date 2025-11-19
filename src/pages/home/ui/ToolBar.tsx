import { useEditorContext } from "@/widgets/Editor";
import openTextFile from "../infra/openTextFile";
import exportTextFile from "../infra/exportTextFile";
import {
  InterpreterStatus,
  useInterpreterContext,
} from "@/entities/Interpreter";
import { localStorageSetItem } from "@/shared/infra/localStorageSetItem";
import { createSignal, Show } from "solid-js";
import Logger from "@/features/Logger";

export default function ToolBar() {
  const { interpreter, diagnostics } = useInterpreterContext();
  const { editorState } = useEditorContext();
  let filePicker!: HTMLInputElement;

  const logger = new Logger();
  let [isLoggerOpen, setIsLoggerOpen] = createSignal(false);
  let [willStreamLogs, setWillStreamLogs] = createSignal(false);

  return (
    <>
      <div class="grid grid-cols-5 items-center select-none">
        <Show when={interpreter.status() === InterpreterStatus.Halted}>
          <details
            class="text-center relative outline-none hover:bg-rebeccapurple hover:cursor-pointer"
            on:pointerleave={(ev) => ev.currentTarget!.removeAttribute("open")}
          >
            <summary>File</summary>
            <div
              class="absolute left-0 right-0 bg-mygrey z-10 whitespace-nowrap flex flex-col shadow-2xl"
              on:pointerdown={(ev) =>
                ev.currentTarget.parentElement!.removeAttribute("open")
              }
            >
              <button
                class="p-1 hover:bg-rebeccapurple"
                on:pointerdown={() => editorState.setLines([""])}
              >
                New
              </button>
              <input
                ref={filePicker}
                on:change={(ev) => openTextFile(ev, editorState.setLines)}
                type="file"
                class="hidden"
              />
              <button
                class="p-1 hover:bg-rebeccapurple"
                on:pointerdown={() => filePicker.click()}
              >
                Open
              </button>
              <button
                class="p-1 hover:bg-rebeccapurple"
                on:pointerdown={() =>
                  localStorageSetItem("savedFileContent", editorState.lines)
                }
              >
                Save
              </button>
              <button
                class="p-1 hover:bg-rebeccapurple"
                on:pointerdown={() => exportTextFile(editorState.lines)}
              >
                Export
              </button>
            </div>
          </details>
        </Show>

        <button
          class={`${
            interpreter.status() !== InterpreterStatus.Halted ? "hidden " : ""
          }hover:bg-rebeccapurple`}
          disabled={interpreter.status() !== InterpreterStatus.Halted}
          on:pointerdown={() => interpreter.load()}
        >
          Load
        </button>

        <button
          class={`${
            interpreter.status() !== InterpreterStatus.Paused ? "hidden " : ""
          }hover:bg-rebeccapurple`}
          disabled={interpreter.status() !== InterpreterStatus.Paused}
          on:pointerdown={() => interpreter.execute(diagnostics.breakpts)}
        >
          Execute
        </button>

        <button
          class={`${
            interpreter.status() !== InterpreterStatus.Running ? "hidden " : ""
          }hover:bg-rebeccapurple`}
          disabled={interpreter.status() !== InterpreterStatus.Running}
          on:pointerdown={() => interpreter.pause()}
        >
          Pause
        </button>

        <button
          class={`${
            interpreter.status() === InterpreterStatus.Halted ? "hidden " : ""
          }hover:bg-rebeccapurple`}
          disabled={interpreter.status() === InterpreterStatus.Halted}
          on:pointerdown={() => interpreter.halt()}
        >
          Halt
        </button>

        <button
          class={`${
            interpreter.status() !== InterpreterStatus.Paused
              ? "invisible "
              : ""
          }hover:bg-rebeccapurple`}
          disabled={interpreter.status() !== InterpreterStatus.Paused}
          on:pointerdown={() => interpreter.animate(diagnostics.breakpts)}
        >
          Animate
        </button>

        <button
          class={`${
            interpreter.status() !== InterpreterStatus.Paused
              ? "invisible "
              : ""
          }hover:bg-rebeccapurple`}
          disabled={interpreter.status() !== InterpreterStatus.Paused}
          on:pointerdown={() => interpreter.step(diagnostics.breakpts())}
        >
          Step
        </button>

        <button
          class={`${
            willStreamLogs() === isLoggerOpen()
              ? "hover:bg-rebeccapurple "
              : "hover:cursor-auto opacity-25 "
          }`}
          on:pointerdown={async () => {
            if (!willStreamLogs()) {
              // false -> true
              setWillStreamLogs(true);
              await logger.open();
              setIsLoggerOpen(true);

              interpreter.onStep = async (interp) => {
                await logger.log(interp);
              };

              interpreter.onHalt = async () => {
                interpreter.onStep = undefined;
                interpreter.onHalt = undefined;

                setIsLoggerOpen(false);
                await logger.close();
                setWillStreamLogs(false);
              };
            } else {
              interpreter.onStep = undefined;
              interpreter.onHalt = undefined;

              setIsLoggerOpen(false);
              await logger.close();
              setWillStreamLogs(false);
            }
          }}
        >
          {!willStreamLogs()
            ? "Stream Logs"
            : isLoggerOpen()
              ? "Streaming"
              : "Closing Stream"}
        </button>
      </div>
    </>
  );
}
