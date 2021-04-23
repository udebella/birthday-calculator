import {nextFloor as nextFloorFunction} from "../next-floor/next-floor.ts";

type DifferenceFunction = (today: Date, birthday: Date) => number
type AddFunction = (today: Date, difference: number) => Date

interface DifferenceType {
  differenceFunction: DifferenceFunction,
  addFunction: AddFunction,
}

interface BirthdayCalculator {
    today: Date,
    differenceTypes: DifferenceType[]
}

export const birthdayCalculator = ({today, differenceTypes}: BirthdayCalculator) => {
    return {
        compute: (birthday: Date) => differenceTypes
                .map(({differenceFunction, addFunction}) => {
                  const difference = differenceFunction(today, birthday);
                  const nextFloor = nextFloorFunction(difference);
                  return ({
                    difference,
                    nextFloor,
                    dateForNext: addFunction(birthday, nextFloor)
                  });
                })
    }
}