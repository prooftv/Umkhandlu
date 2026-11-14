import { expect, test } from '@playwright/test';

test('spatial controls preserve attribution and toggle the requested layer', async ({
  page,
}) => {
  await page.goto('/');
  await page.locator('summary').click();

  await expect(page.getByText('Schools')).toBeVisible();
  await expect(
    page.getByText('OpenStreetMap contributors — ODbL.')
  ).toBeVisible();
  await expect(page.getByRole('status')).toContainText('Layer active');

  await page.getByRole('checkbox').uncheck();
  await expect(page.getByRole('status')).toContainText('Layer inactive');

  const controls = page.locator('details');
  const box = await controls.boundingBox();
  const viewport = page.viewportSize();
  if (!box || !viewport)
    throw new Error('Map controls or viewport unavailable');
  expect(box.x + box.width).toBeLessThanOrEqual(viewport.width);
});

test('spatial controls expose service failure and retry action', async ({
  page,
}) => {
  await page.goto('/');
  await page.locator('summary').click();
  await page
    .getByRole('button', { name: /Spatial layers unavailable/ })
    .click();
  await expect(page.getByRole('status')).toContainText('retries 1');
});
