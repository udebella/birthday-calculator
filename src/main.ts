import { componentWith } from "./components/date/date.ts";

componentWith({ customWindow: window, dateGenerator: () => new Date() });
