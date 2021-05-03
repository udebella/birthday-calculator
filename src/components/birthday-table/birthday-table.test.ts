import { componentWith } from "./birthday-table.ts";
import {
  beforeAll,
  beforeEach,
  customWindow,
  describe,
  expect,
  it,
  mock,
} from "../../deps.test.ts";
import { BirthdayCalculator } from "../../services/birthday-calculator/birthday-calculator.ts";

describe("Birthday Table component", () => {
  beforeAll(() => {
    const birthdayCalculator: BirthdayCalculator = mock.fn();
    componentWith({
      customWindow,
      birthdayCalculator,
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

  it("displays birthday date", () => {
    const element = customWindow.document.querySelector(
      "[data-test=testedComponent]",
    );

    element.birthdate = new Date(1990, 10, 7);

    const todayDate = element.shadowRoot.querySelector("[data-test=birthdate]");
    expect(todayDate.date).toEqual(new Date(1990, 10, 7));
  });

  it("displays differences lines when we give a birthdate date", () => {
    const element = customWindow.document.querySelector(
      "[data-test=testedComponent]",
    );

    element.birthdate = new Date(1990, 10, 7);

    const differencesList = element.shadowRoot.querySelector(
      "[data-test=differences-list]",
    );
    expect(differencesList.classList.contains("hidden")).toBe(false);
  });

  it("does not displays differences lines by default", () => {
    const element = customWindow.document.querySelector(
      "[data-test=testedComponent]",
    );

    const differencesList = element.shadowRoot.querySelector(
      "[data-test=differences-list]",
    );
    expect(differencesList.classList.contains("hidden")).toBe(true);
  });

  it("adds differences lines when setting the birthdate", () => {
    const element = customWindow.document.querySelector(
      "[data-test=testedComponent]",
    );

    element.birthdate = new Date(1990, 10, 7);

    const differencesList = element.shadowRoot.querySelector(
      "[data-test=difference-line]",
    );
    expect(differencesList.textContent).toBe("name");
  });

  it("does not pile up differences line when birthdate changes", () => {
    const element = customWindow.document.querySelector(
      "[data-test=testedComponent]",
    );

    element.birthdate = new Date(1990, 10, 7);
    element.birthdate = new Date(1990, 10, 7);

    const differencesList = element.shadowRoot.querySelectorAll(
      "[data-test=difference-line]",
    );
    expect(differencesList.length).toBe(1);
  });
});
