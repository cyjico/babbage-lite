import styles from "./styles.module.css";
import { For, JSX } from "solid-js";

export default function TabbedPanel(props: {
  labelClass?: string;
  contentClass?: string;
  tabs: {
    label: JSX.Element;
    content: JSX.Element;
  }[];
}) {
  return (
    <>
      <div class={props.labelClass}>
        <For each={props.tabs}>
          {(item, index) => {
            return (
              <>
                <label for={`${styles["input"]} ${index()}`}>
                  {item.label}
                </label>
              </>
            );
          }}
        </For>
      </div>

      <form class={props.contentClass}>
        <For each={props.tabs}>
          {(item, index) => {
            return (
              <>
                <input
                  type="radio"
                  name="tab"
                  id={`${styles["input"]} ${index()}`}
                  class={styles["input"]}
                  checked={index() === 0}
                />
                <div class={styles["tab-content"]}>{item.content}</div>
              </>
            );
          }}
        </For>
      </form>
    </>
  );
}
