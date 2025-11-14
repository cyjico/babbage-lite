export default function wrap(n: number, max: number) {
  return ((n % max) + max) % max;
}
