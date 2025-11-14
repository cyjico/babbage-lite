import { useEditorContext } from "@/widgets/Editor";

export default function ToolBar() {
  const { interpreter } = useEditorContext();

  return (
    <>
      <div class="grid grid-flow-col grid-cols-5 place-items-center">
        <details class="relative">
          <summary>File</summary>
          <div class="absolute bg-mygrey z-10 p-2 whitespace-nowrap flex flex-col">
            <button>New File</button>
            <button>Open File</button>
            <button>Save File</button>
          </div>
        </details>

        <button
          class={!interpreter.isMounted() ? "visible" : "invisible"}
          disabled={interpreter.isMounted()}
          on:click={() => interpreter.mount()}
        >
          Mount
        </button>

        <div>
          <button
            class={
              !interpreter.isAnimated() && interpreter.isMounted()
                ? "visible"
                : "hidden"
            }
            disabled={interpreter.isAnimated()}
            on:click={() => interpreter.animate()}
          >
            Animate
          </button>
          <button
            class={
              interpreter.isAnimated() && interpreter.isMounted()
                ? "visible"
                : "hidden"
            }
            disabled={!interpreter.isAnimated()}
            on:click={() => interpreter.pause()}
          >
            Pause
          </button>
        </div>

        <button
          class={
            !interpreter.isAnimated() && interpreter.isMounted()
              ? "visible"
              : "invisible"
          }
          disabled={interpreter.isAnimated() && interpreter.isMounted()}
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
