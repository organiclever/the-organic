import { test, expect } from "@playwright/test";

test("homepage has title and links to intro page", async ({ page }) => {
  await page.goto("http://localhost:3000/");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/AyoKoding/);

  // Create a locator for the "Get started" link.
  const getStarted = page.getByRole("link", { name: "Read our docs" });

  // Expect an attribute "to be strictly equal" to the value.
  await expect(getStarted).toHaveAttribute(
    "href",
    "https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
  );

  // Click the get started link.
  await getStarted.click();

  // Expects the URL to contain intro.
  await expect(page).toHaveURL(/.*nextjs.org\/docs/);
});
