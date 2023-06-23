import { Locator, expect, test } from "@playwright/test";
import { CareersPage } from "../pages/CareersPage";
import { HomePage } from "../Pages/Homepage";
import { JobListingPage } from "../pages/JobListingPage";

test("should be able to search and apply for job", async ({
  page,
  context,
}) => {
  const homePage = new HomePage(page);
  const careersPage = new CareersPage(page);

  // Navigate to carrers
  await homePage.goto();
  const companyMenu = await homePage.getNavigationMenu("Company");
  expect(companyMenu).toBeVisible();
  await companyMenu.click();

  const careersLink = await homePage.getNavigationMenuDropdownLink("Careers");
  expect(careersLink).toBeVisible();
  await careersLink.click();

  // **** Careers Page Start

  // Close Survery dialog
  await careersPage.closeSurveyDialog();

  // Navigate to job listing page
  const searchOpenPositionLink = await careersPage.getSearchOpenPositionLink();

  const [newPage] = await Promise.all([
    context.waitForEvent("page"),
    await searchOpenPositionLink.click(),
  ]);

  //  ***** Job Listing Page
  const jobListingPage = new JobListingPage(newPage);

  //Search for a Job by Type
  expect(jobListingPage.getPageUrl()).toEqual(
    "https://qualcomm.wd5.myworkdayjobs.com/External"
  );
  await jobListingPage.clickOnFilterType("Job Category");
  await jobListingPage.setJobCategoryFilterChecked(
    /Engineering Services Group/,
    true
  );
  await jobListingPage.clickOnViewJobs();
  await expect(
    jobListingPage.getFilterBadge("Engineering Services Group")
  ).toBeVisible();
  await jobListingPage.setSearchBoxValue("Engineer");
  await jobListingPage.clickOnSearchButton();
  await jobListingPage.waitForJobSearchApi();

  await page.waitForTimeout(5000);
  const filteredJobListing = (
    await jobListingPage.getSearchedJobListings()
  ).filter({
    hasText: /engineer/i,
  });

  expect(await filteredJobListing.count()).toBeGreaterThan(0);

  // Click on last job listing
  const lastJobListing = filteredJobListing.last();
  await jobListingPage.getHeaderFromJobListing(lastJobListing).click();

  // Click on apply
  await jobListingPage.clickOnApplyButton();

  // Verify dialog and heading
  const dialog = jobListingPage.getStartYourApplicationDialog();
  expect(dialog).toBeVisible();

  const dialogHeader =
    jobListingPage.getHeaderForStartYouApplicationDialog(dialog);
  expect(dialogHeader).toBeVisible();
  expect(dialogHeader).toHaveText("Start Your Application");
});
