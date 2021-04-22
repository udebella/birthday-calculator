type DifferenceFunction = (today: Date, birthday: Date) => number

interface BirthdayCalculator {
    today: Date,
    differenceFunctions: DifferenceFunction[]
}

export const birthdayCalculator = ({today, differenceFunctions}: BirthdayCalculator) => {
    return {
        compute: (birthday: Date) => differenceFunctions
                .map(fn => fn(today, birthday))
                .map(difference => ({difference}))
    }
}