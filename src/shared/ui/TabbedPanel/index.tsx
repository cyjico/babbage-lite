import { createSignal, For, JSX } from "solid-js";

export default function TabbedPanel(props: {
  class_labelContainer?: string;
  class_labelInactive?: string;
  class_labelActive?: string;
  tabs: {
    label: string;
    class: string;
    content: JSX.Element;
  }[];
}) {
  const [activeTab, setActiveTab] = createSignal(0);

  return (
    <>
      <div class={props.class_labelContainer ?? ""}>
        <For each={props.tabs}>
          {(item, index) => {
            return (
              <div
                on:pointerdown={() => setActiveTab(index())}
                class={
                  index() === activeTab()
                    ? (props.class_labelActive ??
                      props.class_labelInactive ??
                      "")
                    : (props.class_labelInactive ?? "") +
                      " hover:cursor-pointer"
                }
              >
                {item.label}
              </div>
            );
          }}
        </For>
      </div>

      <For each={props.tabs}>
        {(item, index) => {
          return (
            <>
              <div
                class={`${item.class ?? ""} ${activeTab() !== index() ? "hidden" : ""}`}
              >
                {item.content}
              </div>
            </>
          );
        }}
      </For>
    </>
  );
}
