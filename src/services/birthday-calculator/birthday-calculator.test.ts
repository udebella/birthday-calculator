import {birthdayCalculator} from "./birthday-calculator.ts"
import {expect, it, mock} from 'https://deno.land/x/expect@v0.2.6/mod.ts'

it('should apply the difference function between given dates', () => {
    const today = new Date(2020, 1, 10)
    const birthday = new Date(2015, 0, 5)
    const differenceFunction = mock.fn(() => 5);
    const calculator = birthdayCalculator({today, differenceFunctions: [differenceFunction]})

    calculator.compute(birthday);

    expect(differenceFunction).toHaveBeenCalledWith(today, birthday)
});

it('should display the result of the difference function between given dates', () => {
    const today = new Date(2020, 1, 10)
    const birthday = new Date(2015, 0, 5)
    const differenceFunction = mock.fn(() => 5);
    const calculator = birthdayCalculator({today, differenceFunctions: [differenceFunction]})

    const result = calculator.compute(birthday)

    expect(result).toEqual([{difference: 5}])
});
