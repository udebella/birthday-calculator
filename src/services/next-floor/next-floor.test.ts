import { expect, it } from "https://deno.land/x/expect@v0.2.6/mod.ts";
import { nextFloor } from "./next-floor.ts";

const smallerThan10 = [...Array(10).keys()]
smallerThan10.forEach(n => {
  it(`computes next level for ${n}`, () => {
    const next = nextFloor(n);

    expect(next).toBe(n + 1);
  });
})

it("computes next level for 10", () => {
  const next = nextFloor(10);

  expect(next).toBe(20);
});
