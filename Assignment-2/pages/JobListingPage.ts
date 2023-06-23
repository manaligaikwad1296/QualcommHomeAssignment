import { expect } from "@playwright/test";
import { Page, Locator } from "playwright-core";

export class JobListingPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  getPageUrl() {
    return this.page.url();
  }

  getFilterBadge(text: string) {
    return this.page.getByRole("button", { name: text });
  }

  getSearchResultSection() {
    return this.page.getByRole("region", { name: "Search Results" });
  }

  getSearchedJobListings() {
    return this.getSearchResultSection().getByRole("list").locator("li");
  }

  getHeaderFromJobListing(listing: Locator) {
    return listing.getByRole("heading");
  }

  getStartYourApplicationDialog() {
    return this.page.getByRole("dialog", {
      name: "Start Your Application",
    });
  }

  getHeaderForStartYouApplicationDialog(dialog: Locator) {
    return dialog.getByRole("heading", { level: 2 });
  }

  getJobCateogryCheckboxGroup() {
    return this.page
      .locator('[data-automation-id="jobFamilyGroupCheckboxGroup"]')
      .first();
  }

  setSearchBoxValue(text: string) {
    const searchBox = this.page.getByRole("textbox");
    expect(searchBox).toBeVisible();
    searchBox.type(text);
  }

  setJobCategoryFilterChecked(name: string | RegExp, isChecked: boolean) {
    const checkboxGroup = this.getJobCateogryCheckboxGroup().getByRole(
      "checkbox",
      { name }
    );
    expect(checkboxGroup).toBeVisible();
    return checkboxGroup.setChecked(isChecked);
  }

  clickOnViewJobs() {
    const viewJobsButton = this.page.getByRole("button", { name: "View Jobs" });
    expect(viewJobsButton).toBeVisible();
    return viewJobsButton.click();
  }

  clickOnFilterType(text: string) {
    const filterType = this.page.getByRole("button", { name: text });
    expect(filterType).toBeVisible();
    return filterType.click();
  }

  async clickOnSearchButton() {
    const searchButton = await this.page.getByRole("button", {
      name: "Search",
      exact: true,
    });
    expect(searchButton).toBeVisible();
    return searchButton.click();
  }

  waitForJobSearchApi() {
    return this.page.waitForResponse(
      "https://qualcomm.wd5.myworkdayjobs.com/wday/cxs/qualcomm/External/jobs"
    );
  }

  async clickOnApplyButton() {
    const applyButton = this.page.getByRole("button", { name: "Apply" });
    expect(applyButton).toBeVisible();
    return applyButton.click();
  }
}
