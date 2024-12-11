import "./styles.css";
import { Accessor, For, Setter } from "solid-js";
import createOnKeyDown from "./lib/createOnKeyDown";

interface Props {
  breakpoints: Accessor<number[]>;
  setBreakpoints: Setter<number[]>;
}

export default function Editor(props: Props) {
  let ref_content!: HTMLDivElement;

  return (
    <div class="editor">
      <div class="gutters">
        <div class="gutter breakpoints">
          <For each={props.breakpoints()}>
            {(lineNumber) => {
              const top = `top-[${lineNumber * 1.5}rem]`;
              return <div class={`breakpoint ${top}`}>💗</div>;
            }}
          </For>
        </div>

        <div class="gutter line-numbers">
          <div class="line-number">1</div>
          <div class="line-number">2</div>
          <div class="line-number">3</div>
          <div class="line-number">4</div>
        </div>
      </div>

      <div
        ref={ref_content}
        onKeyDown={createOnKeyDown(() => ref_content)}
        contentEditable="plaintext-only"
        class="content"
      >
        <div class="line">N000 10</div>
        <div class="line">
          <br />
        </div>
        <div class="line">N001 5</div>
        <div class="line">L000</div>
      </div>
    </div>
  );
}
