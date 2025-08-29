import { expect, test } from "@playwright/test";
import { HomePage } from "../pages/home.page.js";

test.describe("Home Page", () => {
  let homePage;
  const title = "Games for the Brain";

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.navigateToHome();
  });

  test("should display the correct Home page title", async () => {
    await test.step("Check that the Home page title is correct", async () => {
      await expect(homePage.page).toHaveTitle(title);
    });
  });
});
