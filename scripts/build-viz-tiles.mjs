#!/usr/bin/env node
// Build MVT vector tiles (.pmtiles) for each viz under
// src/assets/visualizations/*/artifact.json whose artifact declares
// a `featuresTiles` field. The frontend renderer detects the presence
// of the .pmtiles file at build time and flips from the deck.gl
// GeoJsonLayer path (bulk-load, main-thread freeze) to a MapLibre-
// native fill-extrusion over vector tiles (streamed, viewport-scoped,
// no freeze).
//
// Pure-JS pipeline, no tippecanoe / docker / wsl required:
//   1. geojson-vt slices the source GeoJSON into x/y/z tiles
//   2. vt-pbf encodes each tile as gzipped MVT protobuf
//   3. better-sqlite3 writes those into a throwaway MBTiles SQLite db
//   4. go-pmtiles (tools/pmtiles.exe) converts MBTiles -> PMTiles
//
// Run with:  npm run build:viz-tiles
// Requires:  tools/pmtiles.exe at repo root (set PMTILES_BIN to override)

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import zlib from "node:zlib";

import geojsonvt from "geojson-vt";
import vtpbf from "vt-pbf";
import Database from "better-sqlite3";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendRoot = path.resolve(__dirname, "..");
const vizRoot = path.join(frontendRoot, "src/assets/visualizations");
// Tile sources live OUTSIDE Gatsby's indexed source directories so the
// raw GeoJSON never ends up in the deploy output (saves ~60 MB for
// Oceanside). The build script reads from here; the tiled PMTiles
// under each viz dir is what gets shipped.
const tileSourceRoot = path.join(frontendRoot, "src/assets/tile-sources");

const DEFAULT_PMTILES_BIN =
  process.env.PMTILES_BIN ||
  path.resolve(frontendRoot, "../../tools/pmtiles.exe");

function lngToTileX(lng, z) {
  return Math.floor(((lng + 180) / 360) * (1 << z));
}

function latToTileY(lat, z) {
  const rad = (lat * Math.PI) / 180;
  return Math.floor(
    ((1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2) * (1 << z)
  );
}

function buildOne({ vizId, geojsonPath, outPath, bounds, minZoom, maxZoom, layer, fields }) {
  console.log(`  [load] ${path.relative(frontendRoot, geojsonPath)}`);
  const data = JSON.parse(fs.readFileSync(geojsonPath, "utf-8"));

  // Strip unused feature properties to keep tiles small.
  if (fields && fields.length > 0) {
    for (const f of data.features) {
      const kept = {};
      for (const k of fields) if (k in f.properties) kept[k] = f.properties[k];
      f.properties = kept;
    }
  }

  console.log(`  [index] ${data.features.length} features, zoom ${minZoom}-${maxZoom}`);
  const tileIndex = geojsonvt(data, {
    maxZoom,
    // Build the index all the way up to maxZoom so features are never
    // dropped at low zoom; low-zoom tiles stay visually consistent with
    // zoomed-in tiles.
    indexMaxZoom: maxZoom,
    // Keep parcels geometrically faithful -- tolerance 0.5 is gentle
    // simplification that still shears sub-pixel vertices but keeps the
    // shape of every parcel recognisable at zoom 10.
    tolerance: 0.5,
    extent: 4096,
    buffer: 64,
    // 500k points per tile lets us keep all ~60k parcels in the broadest
    // low-zoom tile without geojson-vt dropping features to fit its
    // default 100k-point budget.
    indexMaxPoints: 500_000,
    generateId: true,
  });

  const mbtilesPath = outPath.replace(/\.pmtiles$/, ".mbtiles");
  if (fs.existsSync(mbtilesPath)) fs.unlinkSync(mbtilesPath);
  const db = new Database(mbtilesPath);
  db.pragma("journal_mode = WAL");
  db.pragma("synchronous = OFF");
  db.exec(`
    CREATE TABLE tiles (
      zoom_level INTEGER NOT NULL,
      tile_column INTEGER NOT NULL,
      tile_row INTEGER NOT NULL,
      tile_data BLOB NOT NULL,
      PRIMARY KEY(zoom_level, tile_column, tile_row)
    );
    CREATE TABLE metadata (name TEXT PRIMARY KEY, value TEXT);
  `);

  const metaInsert = db.prepare("INSERT OR REPLACE INTO metadata VALUES (?, ?)");
  metaInsert.run("name", vizId);
  metaInsert.run("format", "pbf");
  metaInsert.run("type", "overlay");
  metaInsert.run("version", "1");
  metaInsert.run("description", `${vizId} vector tiles`);
  metaInsert.run("minzoom", String(minZoom));
  metaInsert.run("maxzoom", String(maxZoom));
  metaInsert.run("bounds", bounds.join(","));
  metaInsert.run(
    "json",
    JSON.stringify({
      vector_layers: [
        {
          id: layer,
          description: "",
          fields: Object.fromEntries((fields ?? []).map((k) => [k, "Number"])),
          minzoom: minZoom,
          maxzoom: maxZoom,
        },
      ],
    })
  );

  const tileInsert = db.prepare("INSERT OR REPLACE INTO tiles VALUES (?, ?, ?, ?)");
  const insertMany = db.transaction((rows) => {
    for (const [z, x, y, blob] of rows) tileInsert.run(z, x, y, blob);
  });

  const [w, s, e, n] = bounds;
  let tileCount = 0;
  let totalBytes = 0;

  for (let z = minZoom; z <= maxZoom; z++) {
    const denom = 1 << z;
    const xMin = Math.max(0, lngToTileX(w, z));
    const xMax = Math.min(denom - 1, lngToTileX(e, z));
    const yMin = Math.max(0, latToTileY(n, z)); // y axis flipped
    const yMax = Math.min(denom - 1, latToTileY(s, z));

    const rows = [];
    for (let x = xMin; x <= xMax; x++) {
      for (let y = yMin; y <= yMax; y++) {
        const tile = tileIndex.getTile(z, x, y);
        if (!tile || tile.features.length === 0) continue;
        const pbf = Buffer.from(vtpbf.fromGeojsonVt({ [layer]: tile }, { version: 2 }));
        const gz = zlib.gzipSync(pbf);
        // MBTiles uses TMS y: flipped from XYZ slippy convention.
        rows.push([z, x, denom - 1 - y, gz]);
        totalBytes += gz.length;
        tileCount++;
      }
    }
    if (rows.length > 0) insertMany(rows);
  }

  db.close();
  console.log(`  [tiles] ${tileCount} tiles, ${(totalBytes / 1024).toFixed(1)} KB total`);

  console.log(`  [convert] pmtiles.exe convert -> ${path.relative(frontendRoot, outPath)}`);
  if (fs.existsSync(outPath)) fs.unlinkSync(outPath);
  const r = spawnSync(DEFAULT_PMTILES_BIN, ["convert", mbtilesPath, outPath], {
    stdio: "inherit",
  });
  if (r.status !== 0) {
    throw new Error(`pmtiles convert exited with status ${r.status}`);
  }
  fs.unlinkSync(mbtilesPath);
  const finalKb = (fs.statSync(outPath).size / 1024).toFixed(1);
  console.log(`  [done] ${path.basename(outPath)} ${finalKb} KB`);
}

function haveBinary() {
  const r = spawnSync(DEFAULT_PMTILES_BIN, ["version"], { stdio: "ignore" });
  return r.status === 0;
}

function main() {
  if (!fs.existsSync(vizRoot)) {
    console.log("No visualizations directory; nothing to do.");
    return;
  }
  if (!haveBinary()) {
    console.warn(
      `pmtiles binary not found at ${DEFAULT_PMTILES_BIN}\n` +
        `Download from https://github.com/protomaps/go-pmtiles/releases or set PMTILES_BIN.`
    );
    process.exit(2);
  }

  for (const vizDir of fs.readdirSync(vizRoot)) {
    const dirPath = path.join(vizRoot, vizDir);
    const artifactPath = path.join(dirPath, "artifact.json");
    if (!fs.existsSync(artifactPath)) continue;

    let artifact;
    try {
      artifact = JSON.parse(fs.readFileSync(artifactPath, "utf-8"));
    } catch (err) {
      console.warn(`  [skip] ${vizDir}: ${err.message}`);
      continue;
    }

    if (!artifact.featuresTiles) {
      console.log(`  [skip] ${artifact.vizId}: no featuresTiles field in artifact`);
      continue;
    }

    console.log(`\n${artifact.vizId}`);
    const geojsonPath = path.join(tileSourceRoot, `${artifact.features}.geojson`);
    if (!fs.existsSync(geojsonPath)) {
      console.warn(`  [skip] missing source: ${geojsonPath}`);
      continue;
    }

    const outPath = path.join(dirPath, `${artifact.featuresTiles}.pmtiles`);
    const fields = Array.from(
      new Set([artifact.color?.field, artifact.elevation?.field].filter(Boolean))
    );
    // bbox for Oceanside — matches the basemap extract. If we add other
    // viz later, move this into the artifact.
    const bounds = [-117.42, 33.15, -117.22, 33.29];

    buildOne({
      vizId: artifact.vizId,
      geojsonPath,
      outPath,
      bounds,
      minZoom: 10,
      maxZoom: 15,
      layer: artifact.tilesLayer ?? "features",
      fields,
    });
  }
}

main();
