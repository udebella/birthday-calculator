import {birthdayCalculator} from "./birthday-calculator.js"
import dateFns from '/node_modules/date-fns/esm'

describe('Birthday calculator', () => {
    describe('Years', () => {
        it('should display the result of the difference function computation since the given date', () => {
            const today = new Date(2020, 1, 10)
            const birthday = new Date(2015, 0, 5)
            const calculator = birthdayCalculator({today, differenceFunction})

            const result = calculator.compute(birthday)

            expect(result).to.deep.equal({difference: 5})
        });
    });
});
