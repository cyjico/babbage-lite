import { EditorState } from "../../model";
import EditorHistory from "../../model/EditorHistory";
import createDeleteContentHandler from "./createDeleteContentHandler";
import createInsertFromHandler from "./createInsertFromHandler";
import createInsertLineBreakHandler from "./createInsertLineBreakHandler";
import createInsertTextHandler from "./createInsertTextHandler";

const enum InputEventKind {
  None,
  Atomic, // Cannot be merged! Stands alone! Too tuff!
  NonWhitespace,
  Whitespace,
  Delete,
}

export default function createBeforeInputHandler(
  editorState: EditorState,
  editorHistory: EditorHistory,
) {
  const deleteContent = createDeleteContentHandler(editorState);
  const insertFrom = createInsertFromHandler(editorState);
  const insertLineBreak = createInsertLineBreakHandler(editorState);
  const insertText = createInsertTextHandler(editorState);

  let prevKind = InputEventKind.None;
  return {
    handle: (ev: InputEvent) => {
      ev.preventDefault();

      const kind = getInputEventKindFromInputEvent(ev);
      if (kind === InputEventKind.Atomic || prevKind !== kind)
        editorHistory._commit();
      prevKind = kind;

      switch (ev.inputType) {
        case "insertText":
          insertText(ev.data!);
          break;
        case "insertLineBreak":
          insertLineBreak();
          break;
        case "insertFromYank":
        case "insertFromDrop":
        case "insertFromPaste":
        case "insertFromPasteAsQuotation":
          insertFrom(ev.data!);
          break;
        case "deleteByDrag":
        case "deleteByCut":
        case "deleteContent":
        case "deleteContentBackward":
        case "deleteContentForward":
          deleteContent(ev.inputType);
          break;
        default:
          console.warn("Unhandled Event (please report): ", ev.inputType);
          break;
      }
    },
    reset: () => {
      prevKind = InputEventKind.None;
    },
  };
}

function getInputEventKindFromInputEvent(ev: InputEvent) {
  switch (ev.inputType) {
    case "insertText":
      if (ev.data![0] === " ") return InputEventKind.Whitespace;
      else return InputEventKind.NonWhitespace;
      break;
    case "insertLineBreak":
      return InputEventKind.Atomic;
    case "insertFromYank":
    case "insertFromDrop":
    case "insertFromPaste":
    case "insertFromPasteAsQuotation":
      return InputEventKind.Atomic;
    case "deleteByDrag":
    case "deleteByCut":
    case "deleteContent":
    case "deleteContentBackward":
    case "deleteContentForward":
      return InputEventKind.Delete;
  }

  return InputEventKind.None;
}
