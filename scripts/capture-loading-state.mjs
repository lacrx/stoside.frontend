#!/usr/bin/env node
// Debug utility: screenshot the viz block mid-load so you can inspect
// the loading indicator / poster-frame composition. Swallows the
// analysis.geojson fetch so the map stays in its pending state forever;
// the poster and loader continue to render normally. Dev-only — not
// invoked by any CI workflow.
//
// Usage (requires dev server on :8000):
//   node scripts/capture-loading-state.mjs
// Output: ../tmp-loading-state.png (gitignored).

import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const out = path.resolve(__dirname, "../tmp-loading-state.png");

const browser = await puppeteer.launch({ headless: "new" });
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 960, height: 720, deviceScaleFactor: 2 });

  // Intercept the big GeoJSON and never respond, so the map stays in
  // loading state forever (but the poster + spinner render normally).
  await page.setRequestInterception(true);
  page.on("request", (req) => {
    if (req.url().includes("analysis") && req.url().endsWith(".geojson")) {
      // Just never call req.continue/respond — leaves it pending.
      return;
    }
    req.continue();
  });

  await page.goto("http://localhost:8000/articles/our-wealth-is-downtown/", {
    waitUntil: "domcontentloaded",
    timeout: 30_000,
  });

  // Wait for the viz stage to exist.
  await page.waitForSelector("figure figure, figure [class*=vizStage], figure [class*=vizFigure]", { timeout: 10_000 });

  // Give the browser a moment to paint the poster + spinner.
  await new Promise((r) => setTimeout(r, 1500));

  // Screenshot the viz figure element only.
  const handle = await page.$("figure [class*=vizStage]");
  if (!handle) {
    await page.screenshot({ path: out, type: "png" });
  } else {
    await handle.screenshot({ path: out, type: "png" });
  }
  console.log(`wrote ${out}`);
} finally {
  await browser.close();
}
