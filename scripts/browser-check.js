async (page) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("http://127.0.0.1:4173/analysis.html");
  await page.getByText(/4 of 4 endpoints reachable/).waitFor();
  const checks = [];
  for (const slug of ["b8xrebal", "b8xgrid", "b8xyield", "b8xhealth"]) {
    await page.locator(`[data-agent="${slug}"]`).click();
    await page
      .getByRole("button", { name: "Run analysis", exact: true })
      .click();
    await page
      .locator("#run-status")
      .filter({ hasText: /Completed in/ })
      .waitFor();
    checks.push({
      slug,
      decision: await page.locator("#decision").innerText(),
      rows: await page.locator("#result-table tbody tr").count(),
    });
  }
  await page.locator("#debtValue").fill("0");
  await page.getByRole("button", { name: "Run analysis", exact: true }).click();
  await page.locator("#decision").filter({ hasText: "NO DEBT" }).waitFor();
  const downloadEvent = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Download JSON", exact: true })
    .click();
  const download = await downloadEvent;
  await download.saveAs("output/playwright/result-download.json");
  await page.screenshot({
    path: "output/playwright/desktop.png",
    fullPage: true,
  });
  await page.reload();
  if ((await page.locator("[data-result]").count()) !== 5)
    throw new Error("History did not persist");
  await page.locator("[data-result]").first().click();
  await page.locator("#decision").filter({ hasText: "NO DEBT" }).waitFor();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('[data-agent="b8xyield"]').click();
  await page.getByRole("button", { name: "Run analysis", exact: true }).click();
  await page
    .locator("#run-status")
    .filter({ hasText: /Completed in/ })
    .waitFor();
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  if (overflow) throw new Error("Mobile horizontal overflow");
  await page.screenshot({
    path: "output/playwright/mobile.png",
    fullPage: true,
  });
  await page.locator('[data-agent="b8xgrid"]').click();
  await page.locator("#lower").fill("700");
  await page.getByRole("button", { name: "Run analysis", exact: true }).click();
  await page
    .locator("#run-status")
    .filter({ hasText: "upper must be greater than lower" })
    .waitFor();
  await page.getByRole("button", { name: "Reset sample", exact: true }).click();
  await page.locator("#price-source").selectOption("pancakeswap");
  await page.getByRole("button", { name: "Load current pool price" }).click();
  await page
    .locator("#source-note")
    .filter({ hasText: /at BSC mainnet block/ })
    .waitFor({ timeout: 25000 });
  await page.getByRole("button", { name: "Run analysis", exact: true }).click();
  await page
    .locator("#result-source")
    .filter({ hasText: /PancakeSwap V2/ })
    .waitFor({ timeout: 25000 });
  if (errors.length) throw new Error(errors.join("\n"));
  console.log(
    JSON.stringify({
      checks,
      errors,
      mobileOverflow: overflow,
      download: download.suggestedFilename(),
      liveSource: await page.locator("#result-source").innerText(),
    }),
  );
};
