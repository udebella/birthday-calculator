import { format } from "./src/deps.ts";
import {
  birthdayCalculator,
  differences as differenceTypes,
} from "./src/services/birthday-calculator/birthday-calculator.ts";

const { compute } = birthdayCalculator({
  today: new Date(),
  differenceTypes,
});

const familly = {
  Ubu: new Date(1990, 10, 7, 15, 0, 0, 0),
  Ayaya: new Date(1994, 10, 13, 0, 0, 0, 0),
  Maikou: new Date(1997, 11, 28, 0, 0, 0, 0),
  Creme: new Date(1986, 11, 23, 0, 0, 0, 0),
  Helolo: new Date(2015, 0, 8, 0, 0, 0, 0),
  Cricrou: new Date(1976, 7, 1, 0, 0, 0, 0),
  Papounet: new Date(1950, 2, 19, 0, 0, 0, 0),
  Mamounette: new Date(1953, 4, 14, 0, 0, 0, 0),
};

Object.entries(familly)
  .forEach(([name, birthDate]) => {
    console.log(name, format(birthDate, "dd MMMM yyyy HH:mm:ss", {}));
    console.table(compute(birthDate));
  });

// 2 (x - age1) = x - age2
// 2age1 - age2 = x
// const age1 = differenceInDays(familly.Helolo, today)
// const age2 = differenceInDays(familly.Ubu, today)
// const ratio = 2
// const middle = (ratio * age1 - age2) / (ratio - 1)
// const middleAge = addDays(today, middle)
// console.log(
//   format(middleAge, "dd MMMM yyyy HH:mm:ss"),
//   differenceInDays(middleAge, familly.Ubu),
//   differenceInDays(middleAge, familly.Helolo),
// );
