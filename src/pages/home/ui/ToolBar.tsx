import { useEditorContext } from "@/widgets/Editor";
import openTextFile from "../infra/openTextFile";
import exportTextFile from "../infra/exportTextFile";
import { InterpreterStatus } from "@/entities/Interpreter";

export default function ToolBar() {
  const { interpreter, editorState, editorDebugger } = useEditorContext();

  let filePicker!: HTMLInputElement;

  return (
    <>
      <div class="grid grid-flow-col grid-cols-4 items-center select-none">
        <details
          class={`${
            interpreter.status() === InterpreterStatus.Halted ? "" : "hidden "
          }text-center relative outline-none hover:bg-rebeccapurple hover:cursor-pointer`}
          on:pointerdown={(ev) => {
            if (interpreter.status() !== InterpreterStatus.Halted)
              ev.preventDefault();
          }}
        >
          <summary>File</summary>
          <div
            class="absolute left-0 right-0 bg-mygrey z-10 whitespace-nowrap flex flex-col shadow-2xl"
            on:pointerleave={(ev) =>
              ev.currentTarget.parentElement!.removeAttribute("open")
            }
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
              on:pointerdown={() => exportTextFile(editorState.lines)}
            >
              Export
            </button>
          </div>
        </details>

        <button
          class={`${
            interpreter.status() === InterpreterStatus.Paused ? "" : "hidden "
          }hover:bg-rebeccapurple`}
          disabled={interpreter.status() !== InterpreterStatus.Paused}
          on:pointerdown={() => interpreter.execute(editorDebugger.breakpts)}
        >
          Execute
        </button>

        <button
          class={`${
            interpreter.status() === InterpreterStatus.Running ? "" : "hidden "
          }hover:bg-rebeccapurple`}
          disabled={interpreter.status() === InterpreterStatus.Paused}
          on:pointerdown={() => interpreter.pause()}
        >
          Pause
        </button>

        <button
          class={`${
            interpreter.status() === InterpreterStatus.Halted ? "" : "hidden "
          }hover:bg-rebeccapurple`}
          disabled={interpreter.status() !== InterpreterStatus.Halted}
          on:pointerdown={() => interpreter.mount()}
        >
          Mount
        </button>

        <button
          class={`${
            interpreter.status() !== InterpreterStatus.Halted ? "" : "hidden "
          }hover:bg-rebeccapurple`}
          disabled={interpreter.status() === InterpreterStatus.Halted}
          on:pointerdown={() => interpreter.halt()}
        >
          Halt
        </button>

        <button
          class={`${
            interpreter.status() === InterpreterStatus.Paused ? "" : "hidden "
          }hover:bg-rebeccapurple`}
          disabled={interpreter.status() !== InterpreterStatus.Paused}
          on:pointerdown={() => interpreter.step(editorDebugger.breakpts())}
        >
          Step
        </button>

        <button
          class={`${
            interpreter.status() === InterpreterStatus.Paused ? "" : "hidden "
          }hover:bg-rebeccapurple`}
          disabled={interpreter.status() !== InterpreterStatus.Paused}
          on:pointerdown={() => interpreter.animate(editorDebugger.breakpts)}
        >
          Animate
        </button>
      </div>
    </>
  );
}
