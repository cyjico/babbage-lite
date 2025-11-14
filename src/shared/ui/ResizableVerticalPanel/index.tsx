import { createSignal, ParentProps } from "solid-js";

export default function ResizableVerticalPanel(
  props: {
    class?: string;
    class_interactable?: string;
    initialHeight?: number;
  } & ParentProps,
) {
  const initialHeight = props.initialHeight ?? 200;

  const [height, setHeight] = createSignal(initialHeight);
  let isDragging = false;

  return (
    <div class="relative">
      <div
        class={`h-2 w-full top-0 absolute transition-all hover:cursor-n-resize ${props.class_interactable ?? ""}`}
        on:pointerdown={(ev) => {
          isDragging = true;

          ev.currentTarget.setPointerCapture(ev.pointerId);
        }}
        on:pointermove={(ev) => {
          if (!isDragging) return;

          const maxHeight =
            (ev.currentTarget.parentElement?.parentElement?.clientHeight ??
              Number.MAX_SAFE_INTEGER) * 0.8;

          setHeight((prev) =>
            Math.max(16, Math.min(maxHeight, prev - ev.movementY)),
          );
        }}
        on:pointerup={(ev) => {
          isDragging = false;

          ev.currentTarget.releasePointerCapture(ev.pointerId);
        }}
      />
      <div
        style={{
          height: `${height()}px`,
        }}
        class={`flex flex-col overflow-hidden ${props.class ?? ""}`}
      >
        {props.children}
      </div>
    </div>
  );
}
