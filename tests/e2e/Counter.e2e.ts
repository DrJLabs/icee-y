import assert from 'node:assert';
import { faker } from '@faker-js/faker';
import { expect, test } from '@playwright/test';

test.describe('Counter', () => {
  test.describe('UI Interactions', () => {
    test('should display form elements and initial state correctly', async ({
      page,
    }) => {
      await page.goto('/counter');

      // Verify UI elements are present
      await expect(page.getByLabel('Increment by')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Increment' })).toBeVisible();
      await expect(page.getByText('Count:')).toBeVisible();
    });

    test('should increment the counter through UI and validate visual updates', async ({
      page,
    }) => {
      // `x-e2e-random-id` is used for end-to-end testing to make isolated requests
      // The default value is 0 when there is no `x-e2e-random-id` header
      const e2eRandomId = faker.number.int({ max: 1000000 });
      await page.setExtraHTTPHeaders({
        'x-e2e-random-id': e2eRandomId.toString(),
      });
      await page.goto('/counter');

      const count = page.getByText('Count:');
      const countText = await count.textContent();

      assert(countText !== null, 'Count should not be null');

      const countNumber = Number(countText.split(' ')[1]);

      // Test valid increment operations through UI
      await page.getByLabel('Increment by').fill('2');
      await page.getByRole('button', { name: 'Increment' }).click();

      await expect(page.getByText('Count:')).toHaveText(`Count: ${countNumber + 2}`);

      await page.getByLabel('Increment by').fill('3');
      await page.getByRole('button', { name: 'Increment' }).click();

      await expect(page.getByText('Count:')).toHaveText(`Count: ${countNumber + 5}`);
    });

    test('should display error message for invalid input through UI', async ({
      page,
    }) => {
      await page.goto('/counter');

      const count = page.getByText('Count:');
      const countText = await count.textContent();

      assert(countText !== null, 'Count should not be null');

      // Test UI error display for negative number
      await page.getByLabel('Increment by').fill('-1');
      await page.getByRole('button', { name: 'Increment' }).click();

      await expect(page.getByText('Too small: expected number')).toBeVisible();
      await expect(page.getByText('Count:')).toHaveText(countText);

      // Test UI error display for too large number
      await page.getByLabel('Increment by').fill('5');
      await page.getByRole('button', { name: 'Increment' }).click();

      await expect(page.getByText('Too big: expected number')).toBeVisible();
      await expect(page.getByText('Count:')).toHaveText(countText);
    });
  });
});
