export function nextFloor(number: number): number {
  if (number >= 10) {
    return nextFloor(Math.floor(number / 10)) * 10;
  }
  return number + 1;
}
