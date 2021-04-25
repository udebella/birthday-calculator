import { componentWith } from "./date.ts";
import {
  beforeEach,
  customWindow,
  describe,
  expect,
  it,
} from "../../deps.test.ts";

describe("Date component", () => {
  let today: Date;

  beforeEach(() => {
    today = new Date(2021, 3, 25, 12, 30, 45);
    const component = componentWith({
      customWindow,
      dateGenerator: () => today,
    });
    const componentInstance = customWindow.document.createElement(
      component.componentName(),
    );
    componentInstance.setAttribute("data-test", "testedComponent");
    customWindow.document.querySelector("body").append(componentInstance);
  });

  it("displays current date when no date attribute given", async () => {
    const element = customWindow.document.querySelector(
      "[data-test=testedComponent]",
    );
    expect(element.textContent).toEqual("25 April 2021 12:30:45");
  });
});
