import { test, expect } from "@playwright/test";

test("homepage has correct content", async ({ page }) => {
  await page.goto("http://localhost:3300/");

  // Check the page title
  await expect(page).toHaveTitle(/AyoKoding/);

  // Check for the main heading
  const heading = page.getByRole("heading", { name: "Hello, AyoKoding!" });
  await expect(heading).toBeVisible();

  // Check for white background and black text
  const body = page.locator("body");
  await expect(body).toHaveCSS("background-color", "rgb(255, 255, 255)");
  await expect(body).toHaveCSS("color", "rgb(0, 0, 0)");
});
