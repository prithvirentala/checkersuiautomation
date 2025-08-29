import { test, expect } from "@playwright/test";
import { CheckersPage } from "../../pages/braingame/checkers.page.js";
import { HomePage } from "../../pages/home.page.js";

const customTest = test.extend({
  home: async ({ page }, use) => {
    const home = new HomePage(page);
    await home.navigateToHome();
    await use(home);
  },
  checkers: async ({ home }, use) => {
    await home.selectGameByTitle("Checkers");
    const checkers = new CheckersPage(home.page);
    await use(checkers);
  },
});

customTest.describe("Checkers Game UI Suite", () => {
  const GAME_TITLE = "Checkers - Games for the Brain";
  const MSG_START = "Select an orange piece to move.";
  const MSG_TAKE_BLUE = "Click on your orange piece, then click where you want to move it.";
  const ORANGE_MOVES = [
    { from: 62, to: 73 },
    { from: 71, to: 62 },
    { from: 60, to: 71 },
    { from: 22, to: 13 },
    { from: 31, to: 22 },
  ];
  const BLUE_MOVE = 75;

  customTest("should display the correct page title and board", async ({ checkers }) => {
    await expect(checkers.page).toHaveTitle(GAME_TITLE);
    await expect(checkers.checkersBoard).toBeVisible();
  });

  customTest("should play a full checkers game flow", async ({ checkers }) => {
    await expect(checkers.gameCheckerName).toBeVisible();
    await checkers.assertMessageVisible(MSG_START);
    await checkers.selectBluePiece(BLUE_MOVE);
    await checkers.assertMessageVisible(MSG_TAKE_BLUE);
    for (const [i, move] of ORANGE_MOVES.entries()) {
      await test.step(`Orange move #${i + 1}`, async () => {
        await checkers.moveOrangePieceAndWaitForBlue(move.from, move.to);
      });
    }
    await checkers.restartButton.click();
    await expect(
      checkers.page.locator(checkers.getMessageSelectorByText(MSG_START))
    ).toBeVisible();
  });
});
