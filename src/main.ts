import { componentWith as bcDate } from "./components/date/date.ts";
import { componentWith as bcBirthdayTable } from "./components/birthday-table/birthday-table.ts";

bcDate({ customWindow: window, dateGenerator: () => new Date() });
bcBirthdayTable({ customWindow: window });
