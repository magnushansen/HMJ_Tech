import { test, expect } from '@playwright/test';

test('should debug Player 1 cards', async ({ page }) => {
  const email = '2023.201@student.setur.fo'; // Corrected email
  const password = 'HappyTesting';

  // Navigate to the game page
  await page.goto('http://localhost:3000/game', { waitUntil: 'networkidle' });
  console.log('Navigated to the game page, now handling login.');

  // Log in
  await page.fill('#identifier-field', email);
  await page.click('button:has-text("Continue")');
  await page.waitForSelector('#password-field');
  await page.fill('#password-field', password);
  await page.click('button:has-text("Continue")');
  await page.waitForURL('http://localhost:3000/game');
  console.log('Login successful, navigated to the game page.');

  // Wait for rendering
  console.log('Waiting for 3 seconds to ensure everything is rendered...');
  await page.waitForTimeout(3000);

  // Verify Player 1's container exists
  const isPlayer1ContainerPresent = await page.locator('.CardLayout_player1__hIDGF').count();
  console.log('Player 1 container exists:', isPlayer1ContainerPresent > 0);

  // Debugging: Log all images on the page
  const allImages = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('img')).map(img => ({
      src: img.src,
      alt: img.alt,
      class: img.className,
      parentClasses: img.parentElement?.className || 'No parent',
    }));
  });
  console.log('All images on the page:', allImages);

  // Log the Player 1 container's inner HTML
  const player1ContainerHTML = await page.locator('.CardLayout_player1__hIDGF').innerHTML();
  console.log('Player 1 container HTML:', player1ContainerHTML);


  // Wait dynamically for Player 1's cards
  console.log('Waiting for Player 1’s cards to be available...');
  await page.waitForFunction(() => {
    const cards = document.querySelectorAll('.CardLayout_player1__hIDGF .CardAnimation_card__28gDB img');
    return cards.length > 0;
  }, { timeout: 10000 });
  console.log('Player 1’s cards are now available.');

  // Locate Player 1's cards
  const player1Cards = await page.locator('.CardLayout_player1__hIDGF .CardAnimation_card__28gDB img');
  const cardCount = await player1Cards.count();
  console.log(`Player 1 has ${cardCount} cards.`);

  // Log all card alt attributes
  const cardAltAttributes: (string | null)[] = [];
  for (let i = 0; i < cardCount; i++) {
    const cardAlt = await player1Cards.nth(i).getAttribute('alt');
    cardAltAttributes.push(cardAlt);
  }
  console.log('Player 1 card alt attributes:', cardAltAttributes);

  if (cardCount === 0) {
    throw new Error('No cards found in Player 1’s hand.');
  }

  // Select and click a random card
  const randomIndex = Math.floor(Math.random() * cardCount);
  const randomCard = player1Cards.nth(randomIndex);
  const cardAlt = await randomCard.getAttribute('alt');
  console.log(`Randomly selected card: ${cardAlt}`);
  await randomCard.click();
  console.log(`Clicked on card: ${cardAlt}`);
});
