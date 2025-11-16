import { useEditorContext } from "@/widgets/Editor";
import openTextFile from "../infra/openTextFile";
import exportTextFile from "../infra/exportTextFile";
import { InterpreterStatus } from "@/entities/Interpreter";

export default function ToolBar() {
  const { interpreter, editorState, editorDebugger } = useEditorContext();

  let filePicker!: HTMLInputElement;

  return (
    <>
      <div class="grid grid-flow-col grid-cols-4 items-center">
        <details
          class={`text-center relative outline-none${interpreter.status() === InterpreterStatus.Halted ? " visible hover:cursor-pointer hover:bg-rebeccapurple" : " hidden"}`}
          on:click={(ev) => {
            if (interpreter.status() === InterpreterStatus.Halted)
              ev.preventDefault();
          }}
        >
          <summary class="list-none">File</summary>
          <div
            class="absolute left-0 right-0 bg-mygrey z-10 whitespace-nowrap flex flex-col shadow-2xl"
            on:pointerleave={(ev) =>
              ev.currentTarget.parentElement!.removeAttribute("open")
            }
          >
            <button
              class="p-1 hover:bg-rebeccapurple"
              on:click={() => editorState.setLines([""])}
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
              on:click={() => filePicker.click()}
            >
              Open
            </button>
            <button
              class="p-1 hover:bg-rebeccapurple"
              on:click={() => exportTextFile(editorState.lines)}
            >
              Export
            </button>
          </div>
        </details>

        <button
          class={
            interpreter.status() === InterpreterStatus.Paused
              ? "visible hover:bg-rebeccapurple"
              : "hidden"
          }
          disabled={interpreter.status() !== InterpreterStatus.Paused}
          on:click={() => interpreter.execute()}
        >
          Execute
        </button>

        <button
          class={
            interpreter.status() === InterpreterStatus.Running
              ? "visible hover:bg-rebeccapurple"
              : "hidden"
          }
          disabled={interpreter.status() === InterpreterStatus.Paused}
          on:click={() => interpreter.pause()}
        >
          Pause
        </button>

        <button
          class={
            interpreter.status() === InterpreterStatus.Halted
              ? "visible hover:bg-rebeccapurple"
              : "hidden"
          }
          disabled={interpreter.status() !== InterpreterStatus.Halted}
          on:click={() => interpreter.mount(editorDebugger.breakpts())}
        >
          Mount
        </button>

        <button
          class={
            interpreter.status() !== InterpreterStatus.Halted
              ? "visible hover:bg-rebeccapurple"
              : "invisible"
          }
          disabled={interpreter.status() === InterpreterStatus.Halted}
          on:click={() => interpreter.halt()}
        >
          Halt
        </button>

        <button
          class={
            interpreter.status() === InterpreterStatus.Paused
              ? "visible hover:bg-rebeccapurple"
              : "invisible"
          }
          disabled={interpreter.status() !== InterpreterStatus.Paused}
          on:click={() => interpreter.step()}
        >
          Step
        </button>

        <button
          class={
            interpreter.status() === InterpreterStatus.Paused
              ? "visible hover:bg-rebeccapurple"
              : "hidden"
          }
          disabled={interpreter.status() !== InterpreterStatus.Paused}
          on:click={() => interpreter.animate()}
        >
          Animate
        </button>
      </div>
    </>
  );
}
