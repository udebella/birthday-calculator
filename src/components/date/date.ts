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
    }

    static componentName(): string {
      return "bc-date";
    }

    get date() {
      return dateGenerator();
    }

    connectedCallback() {
      this.innerHTML = format(this.date, "dd MMMM yyyy HH:mm:ss", {});
    }
  }

  customWindow.customElements.define(
    BCDateComponent.componentName(),
    BCDateComponent,
  );
  return BCDateComponent;
};
