export function nextFloor(number: number) {
  if (number >= 20) {
    return 30;
  }
  if (number >= 10) {
    return 20;
  }
  return number + 1;
}
