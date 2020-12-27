import {birthdayCalculator} from "./birthday-calculator.js";

describe('Birthday calculator', () => {
    it('should display number of years since the given date', () => {
        const today = new Date(2020, 1, 10)
        const birthday = new Date(2015, 0, 5)
        const calculator = birthdayCalculator(today)

        const result = calculator.compute(birthday)

        expect(result).to.deep.equal({difference: 5})
    });
});
