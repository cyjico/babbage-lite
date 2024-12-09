import "./styles.css";
import { For } from "solid-js";

interface Props {
  breakpoints: number[];
}

export default function Editor(props: Props) {
  return (
    <div class="editor m-4">
      <div class="editor__gutters">
        <div class="gutter breakpoints">
          <For each={props.breakpoints}>
            {(lineNumber) => {
              const top = `top-[${lineNumber * 16}px]`;
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

      <div class="editor__lines" contentEditable="plaintext-only">
        <div class="line line--active">N000 10</div>
        <div class="line" />
        <div class="line">N001 5</div>
        <div class="line">L000</div>
      </div>
    </div>
  );
}
