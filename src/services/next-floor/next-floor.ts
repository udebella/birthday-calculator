export function nextFloor(number: number): number {
  if (number >= 10) {
    return nextFloor(number / 10) * 10;
  }
  return Math.floor(number) + 1;
}
