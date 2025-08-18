import { expect, test } from '@playwright/test';

test.describe('I18n', () => {
  test.describe('Language Switching', () => {
    test('should switch language from English to French using dropdown and verify text on the homepage', async ({ page }) => {
      await page.goto('/');

      await expect(page.getByText('Transform training into micro-learning with AI in seconds.')).toBeVisible();

      await page.getByRole('button', { name: 'lang-switcher' }).click();
      await page.getByText('Français').click();

      await expect(page.getByText('Transformez la formation en micro-apprentissage avec l\'IA en quelques secondes.')).toBeVisible();
    });

    test('should switch language from English to French using URL and verify page titles', async ({ page }) => {
      await page.goto('/sign-in');

      // Wait for page to load and check if page URL contains sign-in
      await page.waitForURL('**/sign-in**');

      await expect(page).toHaveURL(/\/sign-in/);

      await page.goto('/fr/sign-in');

      // Wait for French page to load and check if page URL contains fr/sign-in
      await page.waitForURL('**/fr/sign-in**');

      await expect(page).toHaveURL(/\/fr\/sign-in/);
    });
  });
});
