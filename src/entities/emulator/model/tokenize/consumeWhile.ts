export default function consumeWhile(
  expression: string,
  index: number,
  condition: (char: string) => boolean,
) {
  let curIndex = index;

  for (; curIndex < expression.length; curIndex++) {
    if (!condition(expression[curIndex])) break;
  }

  return curIndex;
}
