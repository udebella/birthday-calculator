import { expect, it } from "https://deno.land/x/expect@v0.2.6/mod.ts";
import { nextFloor } from "./next-floor.ts";

it("computes next level for 0", () => {
  const next = nextFloor(0);

  expect(next).toBe(1);
});

it("computes next level for 1", () => {
  const next = nextFloor(1);

  expect(next).toBe(2);
});

it("computes next level for 10", () => {
  const next = nextFloor(10);

  expect(next).toBe(20);
});
