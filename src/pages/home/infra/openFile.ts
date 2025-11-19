import { EditorState } from "@/widgets/Editor/model/types";

export default function openFile(
  ev: Event & {
    currentTarget: HTMLInputElement;
    target: HTMLInputElement;
  },
  setLines: EditorState["setLines"],
) {
  const file = ev.target.files?.item(0);
  if (!file) return;

  file.text().then((value) => {
    const lines = value.split(/\r?\n/g);
    setLines(lines);
  });
}
