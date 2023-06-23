import { expect, Locator, Page } from "@playwright/test";

export class HomePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto("/");
    await this.page.getByRole("button", { name: "Accept all cookies" }).click();
  }

  getNavigationMenu(text: string) {
    return this.page
      .getByTestId("main-menu-desktop")
      .getByRole("button", { name: text });
  }

  getNavigationMenuDropdown() {
    return this.page
      .locator('[data-test-id="main-menu-desktop"] ~ div')
      .first();
  }

  getNavigationMenuDropdownLink(text: string) {
    return this.getNavigationMenuDropdown().getByRole("link", { name: text });
  }
}
