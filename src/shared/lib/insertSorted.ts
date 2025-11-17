/**
 * Assumes `arr` is already sorted.
 *
 * @param comparator Should return `<0` if `a < b` and `>0` if `a > b`
 * @returns Index at which `item` was inserted.
 */
export default function insertSorted<T>(
  arr: T[],
  item: T,
  comparator: (a: T, b: T) => number,
): number {
  if (arr.length === 0) {
    arr.push(item);
    return 0;
  }

  // Append at end
  if (comparator(arr[arr.length - 1], item) <= 0) {
    arr.push(item);
    return arr.length;
  }

  // Insert at front
  if (comparator(item, arr[0]) <= 0) {
    arr.unshift(item);
    return 0;
  }

  // Binary search for insertion point
  let left = 0;
  let right = arr.length;
  while (left < right) {
    const mid = (left + right) >>> 1;
    if (comparator(arr[mid], item) < 0) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }

  // Grow array by 1 and shift elements to the right of insertion point.
  arr.push(arr[arr.length - 1]);
  for (let i = arr.length - 1; i > left; --i) {
    arr[i] = arr[i - 1];
  }

  arr[left] = item;
  return left;
}
