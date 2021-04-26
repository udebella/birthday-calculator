import { componentWith } from "./birthday-table.ts";
import {
  beforeAll,
  beforeEach,
  customWindow,
  describe,
  expect,
  it,
} from "../../deps.test.ts";

describe("Birthday Table component", () => {
  beforeAll(() => {
    componentWith({
      customWindow,
    });
  });

  beforeEach(() => {
    customWindow.document.querySelector("body").innerHTML =
      `<bc-birthday-table data-test="testedComponent"></bc-birthday-table>`;
  });

  it("displays today's date", () => {
    const element = customWindow.document.querySelector(
      "[data-test=testedComponent]",
    ).shadowRoot;

    const todayDate = element.querySelector("[data-test=today]");
    expect(todayDate.date).toBeUndefined();
  });
});
