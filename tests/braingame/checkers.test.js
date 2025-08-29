import { test as base } from "@playwright/test";
import { expect } from "@playwright/test";
import { CheckersPage } from "../../pages/braingame/checkers.page.js";
import { HomePage } from "../../pages/home.page.js";

const test = base.extend({
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await homePage.navigateToHome();
    await use(homePage);
  },
  checkersPage: async ({ homePage }, use) => {
    await homePage.selectGameByTitle("Checkers");
    const checkersPage = new CheckersPage(homePage.page);
    await use(checkersPage);
  },
});

test.describe("Checkers Page Testing", () => {
  const title = "Checkers - Games for the Brain";
  const startGameMessage = "Select an orange piece to move.";
  const takeBluePieceMessage = "Click on your orange piece, then click where you want to move it.";
  const orangeMoves = [
    { initial: 62, final: 73 },
    { initial: 71, final: 62 },
    { initial: 60, final: 71 },
    { initial: 22, final: 13 },
    { initial: 31, final: 22 },
  ];
  const blueMove = 75;

  test("should display the correct Checkers page title and board", async ({ checkersPage }) => {
    await test.step("Check that the page title is correct", async () => {
      await expect(checkersPage.page).toHaveTitle(title);
    });
    await test.step("Check that the checkers board is visible", async () => {
      await expect(checkersPage.checkersBoard).toBeVisible();
    });
  });

  test("should play a full Checkers game flow and restart", async ({ checkersPage }) => {
    await test.step("Check that the Checkers game name is visible", async () => {
      await expect(checkersPage.gameCheckerName).toBeVisible();
    });
    await test.step("Check for new game start message", async () => {
      await checkersPage.assertMessageVisible(startGameMessage);
    });
    await test.step("Check for blue piece move message after taking blue piece", async () => {
      await checkersPage.selectBluePiece(blueMove);
      await checkersPage.assertMessageVisible(takeBluePieceMessage);
    });
    await test.step("Make five valid orange moves and verify each", async () => {
      for (let i = 0; i < orangeMoves.length; i++) {
        await test.step(`Orange move #${i + 1}` , async () => {
          const { initial, final } = orangeMoves[i];
          await checkersPage.moveOrangePieceAndWaitForBlue(initial, final);
        });
      }
    });
    await test.step("Restart the game after five moves", async () => {
      await checkersPage.restartButton.click();
    });
    await test.step("Verify the game has restarted successfully", async () => {
      expect(
        await checkersPage.page
          .locator(checkersPage.getMessageSelectorByText(startGameMessage))
          .isVisible()
      );
    });
  });
});
