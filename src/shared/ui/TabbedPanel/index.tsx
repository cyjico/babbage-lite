import { createSignal, For, JSX } from "solid-js";

export default function TabbedPanel(props: {
  class?: string;
  classLabelContainer?: string;
  classLabel?: string;
  classContentContainer?: string;
  classContent?: string;
  tabs: {
    label: JSX.Element;
    content: JSX.Element;
  }[];
}) {
  const [chosenTab, setChosenTab] = createSignal(0);

  return (
    <>
      <div class={props.classLabelContainer ?? ""}>
        <For each={props.tabs}>
          {(item, index) => {
            return (
              <div
                on:pointerdown={() => setChosenTab(index())}
                classList={{ "hover:cursor-pointer": index() !== chosenTab() }}
                class={props.classLabel ?? ""}
              >
                {item.label}
              </div>
            );
          }}
        </For>
      </div>

      <div class={props.classContentContainer ?? ""}>
        <For each={props.tabs}>
          {(item, index) => {
            return (
              <>
                <div
                  class={`${props.classContent ?? ""} ${chosenTab() !== index() ? "hidden" : ""}`}
                >
                  {item.content}
                </div>
              </>
            );
          }}
        </For>
      </div>
    </>
  );
}
