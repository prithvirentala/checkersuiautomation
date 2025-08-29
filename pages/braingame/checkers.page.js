import { expect } from "@playwright/test";

export class CheckersPage {
  constructor(page) {
    this.page = page;
    this.gameCheckerName = page.locator('h1:has-text("Checkers")');
    this.checkersBoard = page.locator("#board");
    this.bluePieceMoving = page.locator('img[src="https://www.gamesforthebrain.com/game/checkers/me2.gif"]');
    this.restartButton = page.locator("text=Restart");
  }

  getPieceSelectorByPosition(position) {
    return `img[name="space${position}"]`;
  }

  getMessageSelectorByText(message) {
    return `#message:has-text("${message}")`;
  }

  async assertMessageVisible(expectedMessage) {
    return await expect(
      this.page.locator(this.getMessageSelectorByText(expectedMessage))
    ).toBeVisible();
  }

  async selectBluePiece(position) {
    await expect(
      this.page.locator(this.getPieceSelectorByPosition(position))
    ).toHaveAttribute("src", "me1.gif");
    await this.page
      .locator(this.getPieceSelectorByPosition(position))
      .click({ delay: 1000 });
  }

  async moveOrangePieceAndWaitForBlue(startPosition, endPosition) {
    const messageMakeAMove = this.getMessageSelectorByText("Make a move.");
    await expect(
      this.page.locator(this.getPieceSelectorByPosition(startPosition))
    ).toHaveAttribute("src", "you1.gif");
    await this.page
      .locator(this.getPieceSelectorByPosition(startPosition))
      .click({ delay: 1000 });
    await expect(
      this.page.locator(this.getPieceSelectorByPosition(startPosition))
    ).toHaveAttribute("src", "you2.gif");
    await this.page
      .locator(this.getPieceSelectorByPosition(endPosition))
      .click({ delay: 1000 });
    await expect(
      this.page.locator(this.getPieceSelectorByPosition(endPosition))
    ).toHaveAttribute("src", "you1.gif");
    await expect(
      this.page.locator(messageMakeAMove)
    ).toBeVisible();
  }
}
