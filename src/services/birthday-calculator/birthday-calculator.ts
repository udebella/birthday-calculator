import { nextFloor as nextFloorFunction } from "../next-floor/next-floor.ts";
import {
  addDays,
  addHours,
  addMinutes,
  addMonths,
  addSeconds,
  addWeeks,
  addYears,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInMonths,
  differenceInSeconds,
  differenceInWeeks,
  differenceInYears,
} from "../../deps.ts";

type DifferenceFunction = (today: Date, birthday: Date) => number;
type AddFunction = (today: Date, difference: number) => Date;

interface DifferenceType {
  name: string;
  differenceFunction: DifferenceFunction;
  addFunction: AddFunction;
}

interface Dependencies {
  today: Date;
  differenceTypes: DifferenceType[];
}

export const differences: DifferenceType[] = [
  {
    name: "years",
    differenceFunction: differenceInYears,
    addFunction: addYears,
  },
  {
    name: "months",
    differenceFunction: differenceInMonths,
    addFunction: addMonths,
  },
  {
    name: "weeks",
    differenceFunction: differenceInWeeks,
    addFunction: addWeeks,
  },
  { name: "days", differenceFunction: differenceInDays, addFunction: addDays },
  {
    name: "hours",
    differenceFunction: differenceInHours,
    addFunction: addHours,
  },
  {
    name: "minutes",
    differenceFunction: differenceInMinutes,
    addFunction: addMinutes,
  },
  {
    name: "seconds",
    differenceFunction: differenceInSeconds,
    addFunction: addSeconds,
  },
];

interface BirthdayDifferences {
  name: string;
  difference: number;
  nextFloor: number;
  dateForNext: Date;
}
export type BirthdayCalculator = (birthday: Date) => BirthdayDifferences[];
type BirthdayCalculatorBuilder = (
  dependencies: Dependencies,
) => BirthdayCalculator;

export const buildBirthdayCalculator: BirthdayCalculatorBuilder = (
  { today, differenceTypes }: Dependencies,
) =>
  (birthday: Date) =>
    differenceTypes
      .map(({ name, differenceFunction, addFunction }) => {
        const difference = differenceFunction(today, birthday);
        const nextFloor = nextFloorFunction(difference);
        return ({
          name,
          difference,
          nextFloor,
          dateForNext: addFunction(birthday, nextFloor),
        });
      });
