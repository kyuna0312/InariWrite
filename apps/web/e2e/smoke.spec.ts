import { expect, test } from "@playwright/test";

test.describe("smoke", () => {
  test("loads shell, skip link, main landmark, editor, and preview", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/InariWrite/i);

    const skip = page.locator("a.skip-link");
    await expect(skip).toHaveAttribute("href", "#main-content");

    await expect(page.locator("#main-content")).toBeVisible();

    await expect(page.locator(".cm-editor")).toBeVisible({ timeout: 25_000 });

    await expect(page.locator(".preview.markdown-body")).toBeVisible({
      timeout: 25_000,
    });
  });
});
