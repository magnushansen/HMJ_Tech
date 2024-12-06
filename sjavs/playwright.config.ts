import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e', // Ensure this path is correct and relative to the config file
  use: {
    browserName: 'chromium', // Use 'chromium' globally
    headless: true,          // Run tests in headless mode
    baseURL: 'http://localhost:3000', // Add a base URL for easier test navigation if applicable
    screenshot: 'only-on-failure', // Capture screenshots for failed tests
    video: 'retain-on-failure',    // Capture videos for failed tests
    trace: 'on-first-retry',       // Enable tracing for retries
  },
  reporter: [
    ['list'],                    // Default console reporter
    ['html', { open: 'never' }], // Generate an HTML report
  ],
  retries: 2, // Retry failed tests up to 2 times
  timeout: 30000, // Set a default timeout of 30 seconds for tests
});
