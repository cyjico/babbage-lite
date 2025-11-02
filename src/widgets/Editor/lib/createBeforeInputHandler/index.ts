import { EditorState } from "../../model";
import EditorHistory from "../../model/EditorHistory";
import createDeleteContentHandler from "./createDeleteContentHandler";
import createInsertFromHandler from "./createInsertFromHandler";
import createInsertLineBreakHandler from "./createInsertLineBreakHandler";
import createInsertTextHandler from "./createInsertTextHandler";

export default function createBeforeInputHandler(
  editorState: EditorState,
  editorHistory: EditorHistory,
) {
  const deleteContent = createDeleteContentHandler(editorState);
  const insertFrom = createInsertFromHandler(editorState);
  const insertLineBreak = createInsertLineBreakHandler(editorState);
  const insertText = createInsertTextHandler(editorState);

  return (ev: InputEvent) => {
    ev.preventDefault();

    editorHistory.commit();

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
  };
}
