async (page) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("https://b8xmarket.xyz/analysis.html");
  await page.getByText(/4 of 4 endpoints reachable/).waitFor();
  await page.evaluate(() => {
    const subtitle = document.createElement("div");
    subtitle.id = "demo-subtitle";
    subtitle.setAttribute("aria-hidden", "true");
    Object.assign(subtitle.style, {
      position: "fixed",
      bottom: "0",
      left: "0",
      right: "0",
      height: "88px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "16px 70px",
      background: "#101416",
      color: "#fff",
      fontFamily: "Arial, sans-serif",
      fontSize: "23px",
      lineHeight: "1.3",
      textAlign: "center",
      zIndex: "9999",
      borderTop: "3px solid #efc329",
      pointerEvents: "none",
    });
    document.body.append(subtitle);
  });
  const caption = async (text) =>
    page
      .locator("#demo-subtitle")
      .evaluate((el, text) => (el.textContent = text), text);
  const pause = (ms) => page.waitForTimeout(ms);
  const run = async () => {
    await page
      .getByRole("button", { name: "Run analysis", exact: true })
      .click();
    await page
      .locator("#run-status")
      .filter({ hasText: /Completed in/ })
      .waitFor({ timeout: 25000 });
    await page.locator("#workspace").scrollIntoViewIfNeeded();
  };
  await caption(
    "B8X Market. Four categories, editable inputs, and results you can inspect.",
  );
  await page.evaluate(() => window.scrollTo(0, 0));
  await pause(5000);
  await caption(
    "This build runs free, read-only analysis. It does not request wallet permissions.",
  );
  await pause(5000);
  await page.locator('[data-agent="b8xgrid"]').click();
  await caption(
    "Grid trading: start with the sample range, fees, slippage, and gas.",
  );
  await pause(3500);
  await run();
  await caption("The calculation flags a grid whose costs exceed its spread.");
  await pause(5000);
  await page.locator("#levels").fill("5");
  await run();
  await caption(
    "With fewer levels, the wider intervals clear the supplied costs. This is not a promise of fills.",
  );
  await pause(6000);
  await page.locator('[data-agent="b8xrebal"]').click();
  await run();
  await caption(
    "LP rebalancing checks the current range and estimates a candidate range and move cost.",
  );
  await pause(5500);
  await caption(
    "The fee scenario is supplied by the user. No LP position is changed.",
  );
  await pause(4500);
  await page.locator('[data-agent="b8xyield"]').click();
  await run();
  await page.locator("#result-title").scrollIntoViewIfNeeded();
  await caption(
    "Yield comparison ranks net returns and excludes routes with insufficient liquidity or long locks.",
  );
  await pause(6000);
  await page.locator('[data-agent="b8xhealth"]').click();
  await run();
  await caption(
    "Health-factor analysis calculates a price shock and two alternative recovery amounts.",
  );
  await pause(5500);
  await page.locator("#priceDropPercent").fill("40");
  await run();
  await caption(
    "A larger shock crosses the liquidation threshold in this scenario.",
  );
  await pause(5000);
  await page.locator('[data-agent="b8xgrid"]').click();
  await page.locator("#price-source").selectOption("pancakeswap");
  await page.getByRole("button", { name: "Load current pool price" }).click();
  await page
    .locator("#source-note")
    .filter({ hasText: /at BSC mainnet block/ })
    .waitFor({ timeout: 25000 });
  await caption(
    "Optional live data reads a PancakeSwap pool on BSC mainnet, without sending a transaction.",
  );
  await run();
  await page.locator("#result-source").scrollIntoViewIfNeeded();
  await pause(6000);
  await caption(
    "The result records the pool and block. Other values remain supplied inputs.",
  );
  await pause(5000);
  await page
    .getByRole("button", { name: "Download JSON", exact: true })
    .click();
  await caption(
    "Download the full result with inputs, calculations, sources, and assumptions.",
  );
  await pause(5000);
  await page.locator("#history").scrollIntoViewIfNeeded();
  await caption(
    "Completed results remain in this browser. The benchmark includes actual outputs and timings.",
  );
  await pause(5500);
  await page.evaluate(() => window.scrollTo(0, 0));
  await caption(
    "b8xmarket-repo.vercel.app  |  B8X Market  |  Read-only analysis beta",
  );
  await pause(5000);
  return { status: "recorded", url: page.url() };
};
