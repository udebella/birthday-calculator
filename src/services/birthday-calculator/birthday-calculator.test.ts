import { birthdayCalculator } from "./birthday-calculator.ts";
import { expect, it, mock } from "../../deps.ts";

it("should display the result of the difference function between given dates", () => {
  const today = new Date(2021, 3, 23);
  const birthday = new Date(2021, 3, 18);
  const differenceFunction = mock.fn(() => 5);
  const addFunction = mock.fn(() => new Date(2021, 3, 24));
  const calculator = birthdayCalculator({
    today,
    differenceTypes: [{ name: "example", differenceFunction, addFunction }],
  });

  const result = calculator.compute(birthday);

  expect(result).toEqual([{
    name: "example",
    difference: 5,
    nextFloor: 6,
    dateForNext: new Date(2021, 3, 24),
  }]);
});
