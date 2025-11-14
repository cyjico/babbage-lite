import { createSignal, ParentProps } from "solid-js";

export default function ResizableHorizontalPanel(
  props: {
    class?: string;
    classInteractable?: string;
    initialWidth?: number;
  } & ParentProps,
) {
  const initialWidth = props.initialWidth ?? 200;

  const [width, setWidth] = createSignal(initialWidth);
  let isDragging = false;

  return (
    <div class="flex flex-row relative">
      <div
        class={`w-2 h-full absolute left-0 transition-all hover:cursor-e-resize ${props.classInteractable ?? ""}`}
        on:pointerdown={(ev) => {
          isDragging = true;

          ev.currentTarget.setPointerCapture(ev.pointerId);
        }}
        on:pointermove={(ev) => {
          if (!isDragging) return;

          const maxWidth =
            (ev.currentTarget.parentElement?.parentElement?.clientWidth ??
              Number.MAX_SAFE_INTEGER) * 0.8;

          setWidth((prev) =>
            Math.max(16, Math.min(maxWidth, prev - ev.movementX)),
          );
        }}
        on:pointerup={(ev) => {
          isDragging = false;

          ev.currentTarget.releasePointerCapture(ev.pointerId);
        }}
      />
      <div
        style={{
          width: `${width()}px`,
        }}
        class={`flex flex-col overflow-hidden ${props.class ?? ""}`}
      >
        {props.children}
      </div>
    </div>
  );
}
