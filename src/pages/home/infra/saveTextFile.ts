export default function saveTextFile(lines: string[]) {
  const url = URL.createObjectURL(
    new Blob(
      lines.map((line) => line + "\n"),
      { type: "text/plain" },
    ),
  );

  const a = document.createElement("a");
  a.href = url;
  a.download = "babbage.txt";
  a.click();

  URL.revokeObjectURL(url);
}
