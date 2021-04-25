import jsdom from "https://dev.jspm.io/jsdom";

export {
  afterEach,
  beforeEach,
  describe,
  it,
} from "https://deno.land/x/test_suite@v0.7.0/mod.ts";
export { expect, mock } from "https://deno.land/x/expect@v0.2.6/mod.ts";
export const { window: customWindow } = new (jsdom as any).JSDOM(
  "",
  { url: "https://localhost" },
);
await new Promise((r) => setTimeout(r));
