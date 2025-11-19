export default function exportFile(lines: string[]) {
  const url = URL.createObjectURL(
    new Blob(
      lines.map((line) => line + "\n"),
      { type: "text/plain" },
    ),
  );

  const a = document.createElement("a");
  a.href = url;
  a.download = "babbage.ae";
  a.click();

  URL.revokeObjectURL(url);
}
