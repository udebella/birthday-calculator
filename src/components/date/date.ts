import { format } from "../../deps.ts";
import { CustomComponent } from "../component.ts";

interface Dependencies {
  // deno-lint-ignore no-explicit-any
  customWindow: any;
  dateGenerator: () => Date;
}

export const componentWith = (
  { customWindow, dateGenerator }: Dependencies,
): CustomComponent => {
  class BCDateComponent extends customWindow.HTMLElement {
    constructor() {
      super();
      this.date = dateGenerator();
    }

    static componentName(): string {
      return "bc-date";
    }

    set date(date: Date) {
      this.innerHTML = format(date, "dd MMMM yyyy HH:mm:ss", {});
    }
  }

  customWindow.customElements.define(
    BCDateComponent.componentName(),
    BCDateComponent,
  );
  return BCDateComponent;
};
