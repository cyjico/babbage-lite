import "./Editor.css";
import useEditorModel from "../model/useEditorModel";
import { createEffect, For, onCleanup } from "solid-js";
import { useEditorContext } from "../ContextProvider";

/**
 * Implementation uses a mix of SolidJS reactivity and DOM manipulation.
 *
 * To keep it short, the user editing lines will mean a direct manipulation of
 * the DOM. But, to keep track of the changes (and to respond to the changes),
 * we will use SolidJS's `signals`.
 */
export default function Editor(props: { class?: string }) {
  let content!: HTMLDivElement;

  const { imperativeEffect, imperativeCleanup } = useEditorModel(() => content);

  createEffect(imperativeEffect);
  onCleanup(imperativeCleanup);

  const { viewState } = useEditorContext();

  return (
    <div class={`editor ${props.class ?? ""}`}>
      <div class="gutters">
        <div class="gutter breakpoints">
          <For each={[]}>
            {(lineNumber) => {
              const top = `top-[${lineNumber * 1.5}rem]`;
              return <div class={`breakpoint ${top}`}>💗</div>;
            }}
          </For>
        </div>

        <div class="gutter line-numbers">
          <For each={viewState.lines()}>
            {(_, index) => <div class="line-number">{index() + 1}</div>}
          </For>
        </div>
      </div>

      <div ref={content} contentEditable="plaintext-only" class="content" />
    </div>
  );
}
