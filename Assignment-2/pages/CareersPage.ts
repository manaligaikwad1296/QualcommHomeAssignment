import { Page } from "playwright-core";

export class CareersPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  getSurveyDialog() {
    return this.page.getByRole("dialog", {
      name: "Your opinions let us serve you better!",
    });
  }

  getSearchOpenPositionLink() {
    return this.page
      .getByRole("link", {
        name: "Search open positions",
      })
      .first();
  }

  async closeSurveyDialog() {
    const dialog = await this.getSurveyDialog();
    if (await dialog.isVisible()) {
      await dialog.getByRole("button", { name: "No thanks" }).click();
    }
  }
}
