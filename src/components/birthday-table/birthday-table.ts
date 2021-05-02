import { CustomComponent } from "../component.ts";

interface Dependencies {
  // deno-lint-ignore no-explicit-any
  customWindow: any;
}

export const componentWith = (
  { customWindow }: Dependencies,
): CustomComponent => {
  class BCBirthdayTable extends customWindow.HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
      this.birthdateComponent = this.shadowRoot.querySelector(
        "[data-test=birthdate]",
      );
    }

    static componentName(): string {
      return "bc-birthday-table";
    }

    set birthdate(birthdate: Date) {
      this.birthdateComponent.date = birthdate;
    }
  }

  const template = customWindow.document.createElement("template");
  template.innerHTML = `
    <div><bc-date data-test="today"></bc-date></div>
    <div><bc-date data-test="birthdate"></bc-date></div>
    <div data-test="differences-list"></div>
  `;

  customWindow.customElements.define(
    BCBirthdayTable.componentName(),
    BCBirthdayTable,
  );
  return BCBirthdayTable;
};
