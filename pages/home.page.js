import { expect } from "@playwright/test";

export class HomePage {
  constructor(page) {
    this.page = page;
    this.homeNavigation = page.locator(".homeNavigation");
  }

  getGameLinkByTitle(title) {
    return this.homeNavigation.locator(`//a[normalize-space()="${title}"]`);
  }

  async navigateToHome() {
    await this.page.goto(process.env.BASE_URL);
    await expect(this.homeNavigation).toBeVisible();
  }

  async selectGameByTitle(title) {
    await this.getGameLinkByTitle(title).click();
    await this.page.waitForLoadState("domcontentloaded");
  }
}
