import { nextFloor } from "./next-floor.ts";
import {expect, it} from "../../deps.test.ts";

const smallerThan10 = [...Array(10).keys()];
smallerThan10.forEach((n) => {
  it(`computes next level for ${n}`, () => {
    const next = nextFloor(n);

    expect(next).toBe(n + 1);
  });
});

it("computes next level for 10", () => {
  const next = nextFloor(10);

  expect(next).toBe(20);
});

it("computes next level for 11", () => {
  const next = nextFloor(11);

  expect(next).toBe(20);
});

it("computes next level for 20", () => {
  const next = nextFloor(20);

  expect(next).toBe(30);
});
