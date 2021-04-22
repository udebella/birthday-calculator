export const birthdayCalculator = ({today, differenceFunction}) => {
    return {
        compute: birthday => ({difference: differenceFunction(today, birthday)})
    }
}