import "./Editor.css";
import useEditorModel from "../model/useEditorModel";
import { For, onCleanup, onMount } from "solid-js";
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

  const model = useEditorModel(() => content);
  onMount(model.onMount);
  onCleanup(model.onCleanup);

  model.setLinesRemovedListener((newLength) => {
    viewState._setBreakpts((prev) => {
      const next = new Set(prev);
      for (const breakpt of prev) if (breakpt > newLength) next.delete(breakpt);

      return next;
    });
  });

  const { viewState } = useEditorContext();

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

            viewState._setBreakpts((prev) => {
              const next = new Set(prev);
              if (next.has(line)) next.delete(line);
              else next.add(line);

              return next;
            });
          }}
        >
          <For each={Array.from(viewState.breakpts().values())}>
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
          <For each={viewState.lines()}>
            {(_, index) => <div class="line-number">{index() + 1}</div>}
          </For>
        </div>
      </div>

      <div ref={content} contentEditable="plaintext-only" class="content" />
    </div>
  );
}
