#!/usr/bin/env node
// Converts each viz's source GeoJSON into a co-located .pmtiles file using
// tippecanoe. Safe to run even if tippecanoe is missing; in that case the
// renderer silently falls back to raw-GeoJSON mode.
//
// Install tippecanoe:
//   macOS:    brew install tippecanoe
//   Linux:    apt install tippecanoe  (or build from felt/tippecanoe)
//   Windows:  use WSL, or `docker run --rm -v %cd%:/data felt/tippecanoe ...`

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendRoot = path.resolve(__dirname, "..");
const vizRoot = path.join(frontendRoot, "src/assets/visualizations");
const dataRoot = path.join(frontendRoot, "src/assets/data");

function haveTippecanoe() {
  const r = spawnSync("tippecanoe", ["--version"], { stdio: "ignore" });
  return r.status === 0;
}

function resolveFeaturesPath(features) {
  const candidates = [
    path.join(dataRoot, `${features}.geojson`),
    path.join(dataRoot, `${features}.json`),
  ];
  return candidates.find(p => fs.existsSync(p)) ?? null;
}

function buildOne(vizDir, artifact) {
  if (!artifact.featuresTiles) {
    console.log(`  [skip] ${artifact.vizId}: no featuresTiles field`);
    return;
  }
  const src = resolveFeaturesPath(artifact.features);
  if (!src) {
    console.warn(`  [skip] ${artifact.vizId}: could not locate source GeoJSON "${artifact.features}"`);
    return;
  }
  const out = path.join(vizDir, `${artifact.featuresTiles}.pmtiles`);
  const layer = artifact.tilesLayer ?? "features";
  console.log(`  [build] ${artifact.vizId}: ${path.basename(src)} -> ${path.basename(out)} (layer=${layer})`);
  const r = spawnSync(
    "tippecanoe",
    [
      "-f",
      "-z", "16",
      "-Z", "10",
      "--layer", layer,
      "--drop-densest-as-needed",
      "--coalesce-smallest-as-needed",
      "--extend-zooms-if-still-dropping",
      "-o", out,
      src,
    ],
    { stdio: "inherit" }
  );
  if (r.status !== 0) {
    console.error(`  [fail] ${artifact.vizId}: tippecanoe exited with status ${r.status}`);
  }
}

function main() {
  if (!fs.existsSync(vizRoot)) {
    console.log("No visualizations directory; nothing to do.");
    return;
  }
  if (!haveTippecanoe()) {
    console.warn("tippecanoe not found on PATH, skipping tile build.");
    console.warn("Renderer will use raw GeoJSON until tippecanoe is installed. See script header for install hints.");
    return;
  }
  for (const entry of fs.readdirSync(vizRoot)) {
    const vizDir = path.join(vizRoot, entry);
    const artifactPath = path.join(vizDir, "artifact.json");
    if (!fs.existsSync(artifactPath)) continue;
    try {
      const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf-8"));
      buildOne(vizDir, artifact);
    } catch (err) {
      console.warn(`  [skip] ${entry}: ${err.message}`);
    }
  }
}

main();
