import { useEditorContext } from "@/widgets/Editor";
import openTextFile from "../infra/openTextFile";
import exportTextFile from "../infra/exportTextFile";

export default function ToolBar() {
  const { interpreter, editorState, editorDebugger } = useEditorContext();

  let filePicker!: HTMLInputElement;

  return (
    <>
      <div class="grid grid-flow-col grid-cols-5 place-items-center">
        <div>
          <details
            class={`relative outline-none${!interpreter.isMounted() ? " visible" : " hidden"}`}
            on:click={(ev) => {
              if (interpreter.isMounted()) ev.preventDefault();
            }}
          >
            <summary class="list-none">File</summary>
            <div
              class="absolute bg-mygrey z-10 p-2 whitespace-nowrap flex flex-col"
              on:pointerleave={(ev) =>
                ev.currentTarget.parentElement!.removeAttribute("open")
              }
            >
              <button on:click={() => editorState.setLines([""])}>New</button>
              <input
                ref={filePicker}
                on:change={(ev) => openTextFile(ev, editorState.setLines)}
                type="file"
                style="display:none"
              />
              <button on:click={() => filePicker.click()}>Open</button>
              <button on:click={() => exportTextFile(editorState.lines)}>
                Export
              </button>
            </div>
          </details>
          <button
            class={
              !interpreter.isRunning() && interpreter.isMounted()
                ? "visible"
                : "hidden"
            }
            disabled={interpreter.isRunning() && !interpreter.isMounted()}
            on:click={() => interpreter.execute()}
          >
            Execute
          </button>
        </div>

        <button
          class={!interpreter.isMounted() ? "visible" : "invisible"}
          disabled={interpreter.isMounted()}
          on:click={() => interpreter.mount(editorDebugger.breakpts())}
        >
          Mount
        </button>

        <div>
          <button
            class={
              !interpreter.isRunning() && interpreter.isMounted()
                ? "visible"
                : "hidden"
            }
            disabled={interpreter.isRunning()}
            on:click={() => interpreter.animate()}
          >
            Animate
          </button>
          <button
            class={
              interpreter.isRunning() && interpreter.isMounted()
                ? "visible"
                : "hidden"
            }
            disabled={!interpreter.isRunning()}
            on:click={() => interpreter.pause()}
          >
            Pause
          </button>
        </div>

        <button
          class={
            !interpreter.isRunning() && interpreter.isMounted()
              ? "visible"
              : "invisible"
          }
          disabled={interpreter.isRunning() && interpreter.isMounted()}
          on:click={() => interpreter.step()}
        >
          Step
        </button>

        <button
          class={interpreter.isMounted() ? "visible" : "invisible"}
          disabled={!interpreter.isMounted()}
          on:click={() => interpreter.halt()}
        >
          Halt
        </button>
      </div>
    </>
  );
}
