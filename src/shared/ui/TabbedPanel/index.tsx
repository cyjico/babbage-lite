import "./styles.css";
import { For, JSX } from "solid-js";

interface Props {
  tabs: Props_Tab[];
}

interface Props_Tab {
  label: JSX.Element;
  content: JSX.Element;
}

export default function TabbedPanel(props: Props) {
  // ## If anyone can give a more efficient way, that'd be great.
  return (
    <form>
      <For each={props.tabs}>
        {(item, index) => {
          return (
            <>
              <label for={index().toString()}> {item.label} </label>
            </>
          );
        }}
      </For>

      <For each={props.tabs}>
        {(item, index) => {
          return (
            <>
              <input
                type="radio"
                name="tab"
                id={index().toString()}
                checked={index() === 0}
              />
              <div class="tab-content">{item.content}</div>
            </>
          );
        }}
      </For>
    </form>
  );
}
