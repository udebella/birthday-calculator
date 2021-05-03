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
      this.differencesListComponent = this.shadowRoot.querySelector(
        "[data-test=differences-list]",
      );
    }

    static componentName(): string {
      return "bc-birthday-table";
    }

    set birthdate(birthdate: Date) {
      this.birthdateComponent.date = birthdate;
      this.differencesListComponent.classList.remove("hidden");
      this.differencesListComponent.appendChild(templateLine.content.cloneNode(
        true,
      ));
    }
  }

  const template = customWindow.document.createElement("template");
  template.innerHTML = `
    <div><bc-date data-test="today"></bc-date></div>
    <div><bc-date data-test="birthdate"></bc-date></div>
    <div data-test="differences-list" class="hidden"></div>
  `;

  const templateLine = customWindow.document.createElement("template");
  templateLine.innerHTML = `
    <div data-test="difference-line"><span>name</span></div>
  `;

  customWindow.customElements.define(
    BCBirthdayTable.componentName(),
    BCBirthdayTable,
  );
  return BCBirthdayTable;
};
