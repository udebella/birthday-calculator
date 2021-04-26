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
    }

    static componentName(): string {
      return "bc-birthday-table";
    }
  }

  const template = customWindow.document.createElement("template");
  template.innerHTML = `
    <bc-date data-test="today"></bc-date>
  `;

  customWindow.customElements.define(
    BCBirthdayTable.componentName(),
    BCBirthdayTable,
  );
  return BCBirthdayTable;
};
