export default function initLineElements(
  lines: string[],
  ref_lineElementToIdx?: Map<HTMLElement, number>,
) {
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < lines.length; i++) {
    const div = document.createElement("div");
    div.classList.add("line");

    div.textContent = lines[i];
    if (div.textContent.length === 0)
      div.appendChild(document.createElement("br"));

    ref_lineElementToIdx?.set(div, i);

    fragment.appendChild(div);
  }

  return fragment;
}
