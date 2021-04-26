import { componentWith } from "./date.ts";
import {
  beforeAll,
  beforeEach,
  customWindow,
  describe,
  expect,
  it,
} from "../../deps.test.ts";

describe("Date component", () => {
  let today: Date;

  beforeAll(() => {
    componentWith({
      customWindow,
      dateGenerator: () => today,
    });
  });

  beforeEach(() => {
    today = new Date(2021, 3, 25, 12, 30, 45);
    customWindow.document.querySelector("body").innerHTML =
      `<bc-date data-test="testedComponent"></bc-date>`;
  });

  it("displays current date when no date attribute given", () => {
    const element = customWindow.document.querySelector(
      "[data-test=testedComponent]",
    );
    expect(element.textContent).toEqual("25 April 2021 12:30:45");
  });

  it("displays the new date when it changes", () => {
    const element = customWindow.document.querySelector(
      "[data-test=testedComponent]",
    );

    element.date = new Date(2021, 3, 26, 0, 0, 0);

    expect(element.textContent).toEqual("26 April 2021 00:00:00");
  });
});
