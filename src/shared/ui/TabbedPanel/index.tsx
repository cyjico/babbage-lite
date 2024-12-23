import styles from "./styles.module.css";
import { For, JSX } from "solid-js";

interface Props {
  class?: string;
  tabs: Props_Tab[];
}

interface Props_Tab {
  label: JSX.Element;
  content: JSX.Element;
}

export default function TabbedPanel(props: Props) {
  // ## If anyone can give a more efficient way, that'd be great.
  return (
    <form class={props.class}>
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
                class={styles["input"]}
                checked={index() === 0}
              />
              <div class={styles["tab-content"]}>{item.content}</div>
            </>
          );
        }}
      </For>
    </form>
  );
}
