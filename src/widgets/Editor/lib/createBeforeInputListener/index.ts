import { Direction } from "@/shared/model/types";
import { EditorContextProviderValue_State } from "../../ContextProvider";
import onDeleteContent from "./onDeleteContent";
import updateSelection from "./updateSelection";
import { produce } from "solid-js/store";
import onInsertFrom from "./onInsertFrom";
import { captureSelection } from "../createSelectionChangeListener";

export interface EditorSelection {
  lineIdxStart: number;
  offsetStart: number;
  lineIdxEnd: number;
  offsetEnd: number;
  direction: Direction;
  toString: () => string;
}

export default function createBeforeInputListener(
  content: () => HTMLDivElement,
  editorState: EditorContextProviderValue_State,
) {
  return function (ev: InputEvent) {
    ev.preventDefault();

    switch (ev.inputType) {
      case "insertText":
        editorState._setLines(
          produce((lines) => {
            // Set end line content
            lines[editorState.sel.lineIdxEnd] = lines[
              editorState.sel.lineIdxStart
            ]
              .slice(0, editorState.sel.offsetStart)
              .concat(
                ev.data!,
                lines[editorState.sel.lineIdxEnd].slice(
                  editorState.sel.offsetEnd,
                ),
              );

            // Delete lines
            lines.splice(
              editorState.sel.lineIdxStart,
              editorState.sel.lineIdxEnd - editorState.sel.lineIdxStart,
            );
          }),
        );

        editorState._setSel(
          produce((sel) => {
            sel.lineIdxEnd = sel.lineIdxStart;
            sel.offsetStart += 1;
            sel.offsetEnd = sel.offsetStart;

            updateSelection(content(), sel);
          }),
        );
        break;
      case "insertLineBreak":
        editorState._setLines(
          produce((lines) => {
            // Insert new line and delete lines
            lines.splice(
              editorState.sel.lineIdxStart + 1,
              editorState.sel.lineIdxEnd - editorState.sel.lineIdxStart,
              lines[editorState.sel.lineIdxEnd].slice(
                editorState.sel.offsetEnd,
              ),
            );

            // Delete start line content
            lines[editorState.sel.lineIdxStart] = lines[
              editorState.sel.lineIdxStart
            ].slice(0, editorState.sel.offsetStart);
          }),
        );

        editorState._setSel(
          produce((sel) => {
            sel.lineIdxStart += 1;
            sel.lineIdxEnd = sel.lineIdxStart;
            sel.offsetStart = sel.offsetEnd = 0;

            updateSelection(content(), sel);
          }),
        );
        break;
      case "insertFromYank":
      // @ts-expect-error fallthrough intended
      case "insertFromDrop":
        captureSelection(editorState);
      case "insertFromPaste":
      case "insertFromPasteAsQuotation":
        if (typeof ev.data !== "string") break;

        onInsertFrom(ev.data, content, editorState);
        break;
      case "deleteByDrag":
      case "deleteByCut":
      case "deleteContent":
      case "deleteContentBackward":
      case "deleteContentForward":
        onDeleteContent(ev.inputType, content, editorState);
        break;
      default:
        console.log("Unhandled Event: ", ev.inputType);
        break;
    }
  };
}
