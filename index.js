import {format, differenceInYears, addYears, differenceInMonths, addMonths, differenceInWeeks, addWeeks, differenceInDays,
    addDays, differenceInHours, addHours, differenceInMinutes, addMinutes, differenceInSeconds, addSeconds} from 'https://deno.land/x/date_fns/index.js'

const today = new Date()

const differences = {
    years: {differenceFunction: differenceInYears, addFunction: addYears},
    months: {differenceFunction: differenceInMonths, addFunction: addMonths},
    weeks: {differenceFunction: differenceInWeeks, addFunction: addWeeks},
    days: {differenceFunction: differenceInDays, addFunction: addDays},
    hours: {differenceFunction: differenceInHours, addFunction: addHours},
    minutes: {differenceFunction: differenceInMinutes, addFunction: addMinutes},
    seconds: {differenceFunction: differenceInSeconds, addFunction: addSeconds},
}

const nextFloor = (number, step = 0) => {
    if (number/10 < 1) {
        return Math.ceil(number)
    } else {
        return nextFloor(number/10, step + 1) * 10
    }
}

const compute = birthDate => ({differenceFunction, addFunction}) => {
    const difference = differenceFunction(today, birthDate);
    const nextFloor1 = nextFloor(difference);
    return {
        yourAgeIn: difference,
        nextLevel: nextFloor1,
        dateForNextLevel: format(addFunction(birthDate, nextFloor1), 'dd MMMM yyyy HH:mm:ss')
    }
}

const computeFor = calculator => Object.entries(differences)
    .map(([name, fns]) => [name, calculator(fns)])
    .reduce((current, [name, things]) => ({...current, [name]: things}), {})

const familly = {
    Ubu: new Date(1990, 10, 7, 15, 0, 0, 0),
    Ayaya: new Date(1994, 10, 13, 0, 0, 0, 0),
    Maikou: new Date(1997, 11, 28, 0, 0, 0, 0),
    Creme: new Date(1986, 11, 23, 0, 0, 0, 0),
    Helolo: new Date(2015, 0, 8, 0, 0, 0, 0),
    Cricrou: new Date(1976, 7, 1, 0, 0, 0, 0),
    Papounet: new Date(1950, 2, 19, 0, 0, 0, 0),
    Mamounette: new Date(1953, 4, 14, 0, 0, 0, 0),
}

Object.entries(familly)
    .forEach(([name, birthDate]) =>{
        console.log(name, format(birthDate, 'dd MMMM yyyy HH:mm:ss'))
        console.table(computeFor(compute(birthDate)))
    })

// 2 (x - naissanceSiff) = x - naissanceMamounette
// 2naissanceSiff - naissanceMamounette = x

console.log(format(addDays(familly.Mamounette, 2 * differenceInDays(familly.Ubu, familly.Mamounette)), 'dd MMMM yyyy HH:mm:ss'))
