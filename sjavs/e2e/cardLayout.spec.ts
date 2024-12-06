import { test, expect } from '@playwright/test';

test.describe('All Players Hand Verification with Login', () => {
  test('should log in and verify hands for all players are present', async ({ page }) => {
    console.log("Starting test to log in and verify all players' hands.");

    // Navigate to the login page
    await page.goto('http://localhost:3000/game', { waitUntil: 'networkidle' });
    console.log('Navigated to the game login page.');

    // Log in
    const email = '2023.201@student.setur.fo';
    const password = 'HappyTesting';

    console.log('Filling in login details...');
    await page.fill('#identifier-field', email);
    await page.click('button:has-text("Continue")');

    // Wait for the password field to appear
    await page.waitForSelector('#password-field');
    await page.fill('#password-field', password);
    await page.click('button:has-text("Continue")');

    // Wait for the game page to load
    console.log('Waiting for the game page to load after login...');
    await page.waitForURL('http://localhost:3000/game');
    console.log('Successfully logged in and navigated to the game page.');

    // Wait for 3 seconds to give the game time to render
    console.log('Waiting for 3 seconds to allow the game to render players’ hands...');
    await page.waitForTimeout(3000);

    // Define selectors for all players
    const playerSelectors = [
      '.CardLayout_hand__D3SCd.CardLayout_player1__hlDGF',
      '.CardLayout_hand__D3SCd.CardLayout_player2__5W5Wp',
      '.CardLayout_hand__D3SCd.CardLayout_player3__nchC3',
      '.CardLayout_hand__D3SCd.CardLayout_player4__UFwkt'
    ];
    

    // Iterate over all players and verify their hands
    for (let i = 0; i < playerSelectors.length; i++) {
      await page.waitForTimeout(250);
      const playerHandSelector = playerSelectors[i];
      console.log(`Checking for Player ${i + 1}'s hand using selector: ${playerHandSelector}`);

      // Locate the player's hand
      const playerHand = page.locator(playerHandSelector);
      const handExists = await playerHand.count();

      // Log the result
      if (handExists > 0) {
        console.log(`Player ${i + 1}’s hand is present in the DOM.`);
      } else {
        console.error(`Player ${i + 1}’s hand is NOT present in the DOM.`);
        throw new Error(`Player ${i + 1}’s hand is not found on the page.`);
      }

      // Verify the hand is visible
      await expect(playerHand).toBeVisible();
      console.log(`Player ${i + 1}’s hand is visible on the page.`);
    }
  });
});
