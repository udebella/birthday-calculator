import { componentWith as bcDate } from "./components/date/date.ts";
import { componentWith as bcBirthdayTable } from "./components/birthday-table/birthday-table.ts";
import {
  buildBirthdayCalculator,
  differences,
} from "./services/birthday-calculator/birthday-calculator.ts";

const birthdayCalculator = buildBirthdayCalculator({
  today: new Date(),
  differenceTypes: differences,
});
bcDate({ customWindow: window, dateGenerator: () => new Date() });
bcBirthdayTable({ customWindow: window, birthdayCalculator });
