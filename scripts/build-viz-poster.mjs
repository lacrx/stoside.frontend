#!/usr/bin/env node
// Captures a poster frame for a visualization artifact. Two modes:
//
//   1) From a saved image (default if --image is passed):
//        node scripts/build-viz-poster.mjs \
//          --image src/assets/images/oceanside-wealth-placeholder.png \
//          --out src/assets/images/oceanside-wealth-poster.png \
//          --width 480 \
//          --maskRight
//
//      Crops the button area in the top-right, resizes to the target width,
//      writes a PNG. Good for one-off captures you already have in hand.
//
//   2) Headless capture from the running dev server:
//        npm run dev           # in another terminal, Gatsby on :8000
//        node scripts/build-viz-poster.mjs --capture oceanside-vpa-3d
//
//      Launches Chromium via puppeteer, opens /viz-preview/, hides controls,
//      waits for the `.ready` class on the map, screenshots the map region,
//      writes the poster. Reproducible — regenerate any time the viz changes.
//
// Flags:
//   --image PATH        source image to process (mode 1)
//   --out PATH          destination PNG (default: derived from --image)
//   --width N           output pixel width (default 480; aspect preserved)
//   --maskRight         paint a white rectangle over the top-right button area
//   --capture VIZ_ID    capture viz <VIZ_ID> via puppeteer (mode 2)
//   --host URL          dev server URL (default http://localhost:8000)
//   --selector CSS      element to screenshot (default figure containing the viz)

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendRoot = path.resolve(__dirname, "..");

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith("--")) {
        args[key] = next;
        i++;
      } else {
        args[key] = true;
      }
    }
  }
  return args;
}

async function modeFromImage({ image, out, width, maskRight }) {
  const sharp = (await import("sharp")).default;
  const src = path.resolve(frontendRoot, image);
  const dst = out
    ? path.resolve(frontendRoot, out)
    : src.replace(/(-raw|-placeholder)?\.png$/i, "-poster.png");

  const meta = await sharp(src).metadata();
  const w = meta.width ?? 0;
  const h = meta.height ?? 0;
  console.log(`[poster] source ${path.basename(src)} ${w}x${h}`);

  let pipeline = sharp(src);

  if (maskRight) {
    // cover camera strip + zoom column in the top-right corner of the viz.
    const maskWidth = Math.round(w * 0.45);
    const maskHeight = Math.round(h * 0.32);
    const maskLeft = w - maskWidth;
    const white = Buffer.from(
      `<svg width="${maskWidth}" height="${maskHeight}"><rect width="100%" height="100%" fill="white"/></svg>`
    );
    pipeline = pipeline.composite([{ input: white, top: 0, left: maskLeft }]);
    console.log(`[poster] masked top-right ${maskWidth}x${maskHeight} at x=${maskLeft}`);
  }

  const outWidth = Number(width) || 480;
  pipeline = pipeline.resize({ width: outWidth });

  await pipeline.png({ compressionLevel: 9 }).toFile(dst);
  console.log(`[poster] wrote ${path.relative(frontendRoot, dst)} @ ${outWidth}px wide`);
}

async function modeCapture({ vizId, host, selector, out, width }) {
  let puppeteer;
  try {
    puppeteer = (await import("puppeteer")).default;
  } catch {
    console.error(
      "[poster] puppeteer not installed. Run: npm i -D puppeteer\n" +
      "       (installs ~300MB of Chromium)."
    );
    process.exit(2);
  }

  const url = `${host.replace(/\/$/, "")}/viz-preview/`;
  const dstBase = vizId + "-poster.png";
  const dst = out
    ? path.resolve(frontendRoot, out)
    : path.resolve(frontendRoot, "src/assets/images", dstBase);

  console.log(`[poster] capturing ${vizId} via ${url}`);
  const browser = await puppeteer.launch({ headless: "new" });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: Number(width) || 1280, height: 900, deviceScaleFactor: 2 });
    await page.goto(url, { waitUntil: "networkidle2", timeout: 60_000 });

    // Hide every map control group so the capture is clean.
    await page.addStyleTag({ content: ".maplibregl-ctrl { display: none !important; }" });

    // Wait until the renderer has flipped to its ready state.
    await page.waitForSelector(`[aria-label="${vizId}"]`, { timeout: 30_000 });
    await page.waitForFunction(
      (id) => {
        const el = document.querySelector(`[aria-label="${id}"]`);
        return !!el && el.className.includes("ready");
      },
      { timeout: 30_000 },
      vizId
    );

    // One extra frame to guarantee paint.
    await new Promise((r) => setTimeout(r, 400));

    const handle = await page.$(selector || `[aria-label="${vizId}"]`);
    if (!handle) throw new Error(`No element matched selector`);
    await handle.screenshot({ path: dst, type: "png", omitBackground: true });
    console.log(`[poster] wrote ${path.relative(frontendRoot, dst)}`);
  } finally {
    await browser.close();
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.capture) {
    await modeCapture({
      vizId: String(args.capture),
      host: String(args.host || "http://localhost:8000"),
      selector: args.selector ? String(args.selector) : undefined,
      out: args.out ? String(args.out) : undefined,
      width: args.width,
    });
    return;
  }

  if (args.image) {
    await modeFromImage({
      image: String(args.image),
      out: args.out ? String(args.out) : undefined,
      width: args.width,
      maskRight: Boolean(args.maskRight),
    });
    return;
  }

  console.error(
    "Usage:\n" +
    "  node scripts/build-viz-poster.mjs --image <path> [--out <path>] [--width N] [--maskRight]\n" +
    "  node scripts/build-viz-poster.mjs --capture <vizId> [--host URL] [--out <path>] [--width N]"
  );
  process.exit(1);
}

main().catch((err) => {
  console.error(err.stack || err.message || err);
  process.exit(1);
});
