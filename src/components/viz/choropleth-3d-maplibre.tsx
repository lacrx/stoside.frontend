import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import { Protocol } from "pmtiles";
import { MapboxOverlay } from "@deck.gl/mapbox";
import { GeoJsonLayer } from "@deck.gl/layers";
import { scaleThreshold } from "d3-scale";
import type { Feature } from "geojson";
import "maplibre-gl/dist/maplibre-gl.css";
import * as styles from "./choropleth-3d-maplibre.module.css";

type Artifact = {
  vizId: string;
  featuresFile: { publicURL: string | null } | null;
  featuresTilesFile: { publicURL: string | null } | null;
  tilesLayer: string | null;
  camera: { center: number[]; zoom: number | null; pitch: number | null; bearing: number | null } | null;
  color: { field: string; domain: number[]; range: string[] } | null;
  elevation: { field: string; divisor: number | null } | null;
  fallback2d: { maxViewportWidth: number | null } | null;
};

type Props = { artifact: Artifact };

// Self-hosted Protomaps PMTiles extract for the Oceanside area. Served
// from the same origin as the frontend (CloudFront), so no CORS handshake
// and the service worker caches it via the /tiles/* CacheFirst rule.
// See frontend/static/tiles/README.md for how to regenerate.
const BASEMAP_PMTILES_URL =
  process.env.GATSBY_BASEMAP_PMTILES_URL || "/tiles/oceanside.pmtiles";

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

function buildStepColorExpression(field: string, domain: number[], range: string[]): unknown {
  const expr: unknown[] = ["step", ["get", field], range[0]];
  for (let i = 1; i < range.length && i - 1 < domain.length; i++) {
    expr.push(domain[i - 1], range[i]);
  }
  return expr;
}

let pmtilesProtocolRegistered = false;
function ensurePmtilesProtocol() {
  if (pmtilesProtocolRegistered) return;
  const protocol = new Protocol();
  maplibregl.addProtocol("pmtiles", protocol.tile);
  pmtilesProtocolRegistered = true;
}

function createCameraControl(step = 20): maplibregl.IControl {
  let container: HTMLDivElement | null = null;
  return {
    onAdd(map: maplibregl.Map) {
      container = document.createElement("div");
      container.className = "maplibregl-ctrl maplibregl-ctrl-group viz-camera-ctrl-h";

      const addButton = (label: string, glyph: string, onClick: () => void) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.title = label;
        btn.setAttribute("aria-label", label);
        btn.style.fontSize = "20px";
        btn.style.fontWeight = "700";
        btn.style.lineHeight = "1";
        btn.textContent = glyph;
        btn.addEventListener("click", onClick);
        container!.appendChild(btn);
      };

      addButton("Rotate counter-clockwise", "↺", () =>
        map.easeTo({ bearing: map.getBearing() - step })
      );
      addButton("Rotate clockwise", "↻", () =>
        map.easeTo({ bearing: map.getBearing() + step })
      );
      addButton("Less tilt (top-down view)", "▲", () =>
        map.easeTo({ pitch: Math.max(0, map.getPitch() - step) })
      );
      addButton("More tilt (side view)", "▼", () =>
        map.easeTo({ pitch: Math.min(85, map.getPitch() + step) })
      );

      return container;
    },
    onRemove() {
      container?.parentNode?.removeChild(container);
      container = null;
    },
  };
}

function useIsNarrowViewport(breakpoint: number | null | undefined): boolean {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    if (!breakpoint) return;
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const apply = () => setNarrow(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [breakpoint]);
  return narrow;
}

export default function Choropleth3DMaplibre({ artifact }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const overlayRef = useRef<MapboxOverlay | null>(null);
  const [ready, setReady] = useState(false);

  const fallbackBp = artifact.fallback2d?.maxViewportWidth ?? 360;
  const isNarrow = useIsNarrowViewport(artifact.fallback2d ? fallbackBp : null);
  // Fallback mode = don't mount the interactive map. The poster underneath
  // (rendered by VisualizationBlock) remains visible. Binary choice, no
  // flat-polygon middle state.
  const usePosterOnly = Boolean(artifact.fallback2d && isNarrow);

  const effectivePitch = artifact.camera?.pitch ?? 45;

  useEffect(() => {
    if (!containerRef.current) return;
    if (usePosterOnly) return;
    if (!artifact.camera || !artifact.color || !artifact.elevation) return;
    const hasTiles = Boolean(artifact.featuresTilesFile?.publicURL);
    const hasGeojson = Boolean(artifact.featuresFile?.publicURL);
    if (!hasTiles && !hasGeojson) return;

    ensurePmtilesProtocol();

    const { camera, color, elevation } = artifact;
    const [lng, lat] = camera.center;

    // Viewport-aware zoom: on narrower viewports the baked-in zoom crops
    // the choropleth out of frame. Shaving zoom lets the full dataset fit.
    const viewportWidth = window.innerWidth;
    const zoomOffset =
      viewportWidth < 480 ? -0.8 :
      viewportWidth < 768 ? -0.6 :
      viewportWidth < 1024 ? -0.3 :
      0;
    const initialZoom = (camera.zoom ?? 11) + zoomOffset;

    // MapLibre resolves the basemap against our self-hosted PMTiles via
    // the pmtiles:// protocol. The tiles use the OpenMapTiles schema
    // (source-layers like water, transportation, building) produced by
    // planetiler. If the file is missing (e.g. first boot before the
    // extract has been uploaded), MapLibre logs 404s and the extrusions
    // still render on the white background layer below.
    const absoluteBasemapUrl =
      typeof window !== "undefined" && BASEMAP_PMTILES_URL.startsWith("/")
        ? `${window.location.origin}${BASEMAP_PMTILES_URL}`
        : BASEMAP_PMTILES_URL;

    const map = new maplibregl.Map({
      container: containerRef.current,
      // Minimal 538-adjacent style: white background, muted water, a pair
      // of road weights, subtle buildings. No text labels (no glyphs URL
      // dependency, no fonts to ship). Labels can be layered in later if
      // they become editorially useful.
      style: {
        version: 8,
        sources: {
          omt: {
            type: "vector",
            url: `pmtiles://${absoluteBasemapUrl}`,
            attribution:
              '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
          },
        },
        layers: [
          {
            id: "background",
            type: "background",
            paint: { "background-color": "#ffffff" },
          },
          {
            id: "landcover-park",
            type: "fill",
            source: "omt",
            "source-layer": "park",
            paint: { "fill-color": "#e8efe0", "fill-opacity": 0.55 },
          },
          {
            id: "water",
            type: "fill",
            source: "omt",
            "source-layer": "water",
            paint: { "fill-color": "#d3e2ec" },
          },
          {
            id: "road-minor",
            type: "line",
            source: "omt",
            "source-layer": "transportation",
            filter: ["!", ["in", ["get", "class"], ["literal", ["motorway", "trunk", "primary", "secondary"]]]],
            minzoom: 12,
            paint: {
              "line-color": "#e8e8e8",
              "line-width": ["interpolate", ["linear"], ["zoom"], 12, 0.5, 16, 2],
            },
          },
          {
            id: "road-major",
            type: "line",
            source: "omt",
            "source-layer": "transportation",
            filter: ["in", ["get", "class"], ["literal", ["motorway", "trunk", "primary", "secondary"]]],
            paint: {
              "line-color": "#d6d6d6",
              "line-width": ["interpolate", ["linear"], ["zoom"], 10, 0.8, 14, 2.5, 16, 4],
            },
          },
          {
            id: "building",
            type: "fill",
            source: "omt",
            "source-layer": "building",
            minzoom: 14,
            paint: { "fill-color": "#efefef", "fill-opacity": 0.6 },
          },
        ],
      },
      center: [lng, lat],
      zoom: initialZoom,
      pitch: effectivePitch,
      bearing: camera.bearing ?? 0,
      maxPitch: 85,
      canvasContextAttributes: { antialias: true },
      // MapLibre's built-in attribution control sits on the canvas with
      // a "i" toggle. We render our own muted line below the map instead
      // (see JSX return), which keeps the ODbL / OMT attribution
      // visible but much less visually loud.
      attributionControl: false,
      cooperativeGestures: true,
      scrollZoom: false,
      doubleClickZoom: false,
      boxZoom: false,
      touchZoomRotate: false,
    });
    mapRef.current = map;
    map.addControl(createCameraControl(), "top-right");
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

    if (process.env.NODE_ENV === "development") {
      map.on("moveend", () => {
        const c = map.getCenter();
        const cam = {
          center: [Number(c.lng.toFixed(5)), Number(c.lat.toFixed(5))],
          zoom: Number(map.getZoom().toFixed(2)),
          pitch: Number(map.getPitch().toFixed(1)),
          bearing: Number(map.getBearing().toFixed(1)),
        };
        console.log(`[viz:${artifact.vizId}] camera`, JSON.stringify(cam));
      });
    }

    const markReady = () => {
      // Deferred gesture wiring: enable pinch-zoom + two-finger rotate only
      // after the map is visually ready. Other zoom interactions (scroll,
      // double-click, box-zoom) stay off. Zoom via the +/- buttons or
      // pinch only, matching the Google-Maps mobile interaction model.
      if (mapRef.current) {
        mapRef.current.touchZoomRotate.enable();
      }
      requestAnimationFrame(() =>
        requestAnimationFrame(() => setReady(true))
      );
    };

    // Safety net: if data never loads (network error, bad URL, etc.) we
    // still want the map visible eventually instead of an eternal poster.
    const safetyTimer = window.setTimeout(markReady, 30000);
    const clearSafety = () => window.clearTimeout(safetyTimer);

    // When the user navigates away before the 60 MB GeoJSON finishes
    // loading, abort the in-flight fetch. Keeps the user from waiting on
    // main-thread work for a page they no longer care about, and avoids
    // wasted cellular data.
    const abortController = new AbortController();

    // Handle for the requestIdleCallback that defers heavy deck.gl work;
    // cancelled on unmount so navigating away never triggers buffer build.
    let idleHandle: number | undefined;

    map.on("load", () => {
      if (hasTiles) {
        const tilesUrl = artifact.featuresTilesFile!.publicURL!;
        const sourceLayer = artifact.tilesLayer ?? "features";
        map.addSource("viz-features", {
          type: "vector",
          url: `pmtiles://${tilesUrl}`,
        });
        map.addLayer({
          id: "viz-features-extrusion",
          type: "fill-extrusion",
          source: "viz-features",
          "source-layer": sourceLayer,
          paint: {
            "fill-extrusion-color": buildStepColorExpression(color.field, color.domain, color.range) as any,
            "fill-extrusion-height": ["/", ["get", elevation.field], elevation.divisor ?? 1] as any,
            "fill-extrusion-opacity": 0.75,
          },
        });

        const onSourceData = (e: maplibregl.MapSourceDataEvent) => {
          if (e.sourceId === "viz-features" && e.isSourceLoaded) {
            map.off("sourcedata", onSourceData);
            clearSafety();
            markReady();
          }
        };
        map.on("sourcedata", onSourceData);
      } else {
        const colorScale = scaleThreshold<number, [number, number, number]>()
          .domain(color.domain)
          .range(color.range.map(hexToRgb));
        const divisor = elevation.divisor ?? 1;

        // deck.gl's GeoJsonLayer runs accessor functions on the main
        // thread when it builds WebGL attribute buffers from the parsed
        // GeoJSON. For 40k+ parcels that's ~1-2 seconds of synchronous
        // work during which mousemove / click events queue. Defer the
        // overlay creation until requestIdleCallback fires so the user
        // has a clear interaction window (hover feedback, nav clicks)
        // before the heavy buffer build kicks in. Cleanup cancels the
        // pending callback if the user navigates away first.
        const buildOverlay = () => {
          const overlay = new MapboxOverlay({
          interleaved: true,
          layers: [
            new GeoJsonLayer({
              id: artifact.vizId,
              data: artifact.featuresFile!.publicURL!,
              stroked: false,
              filled: true,
              extruded: true,
              opacity: 0.75,
              pickable: true,
              getFillColor: (f: Feature) =>
                [...colorScale(f.properties?.[color.field] ?? 0), 220] as [number, number, number, number],
              getElevation: (f: Feature) =>
                (f.properties?.[elevation.field] ?? 0) / divisor,
              // Fetch + parse off the main thread so nav clicks during
              // load aren't blocked by JSON.parse on the 60 MB GeoJSON.
              // The AbortSignal lets us cancel on unmount so navigating
              // away kills the in-flight request.
              loadOptions: {
                fetch: { signal: abortController.signal },
                worker: true,
              },
              onDataLoad: () => {
                clearSafety();
                markReady();
              },
            }),
          ],
          });
          overlayRef.current = overlay;
          if (mapRef.current) {
            mapRef.current.addControl(overlay as unknown as maplibregl.IControl);
          }
        };

        if (typeof requestIdleCallback === "function") {
          idleHandle = requestIdleCallback(buildOverlay, { timeout: 2000 });
        } else {
          idleHandle = window.setTimeout(buildOverlay, 300);
        }
      }
    });

    return () => {
      abortController.abort();
      if (idleHandle !== undefined) {
        if (typeof cancelIdleCallback === "function") {
          cancelIdleCallback(idleHandle);
        } else {
          window.clearTimeout(idleHandle);
        }
      }
      clearSafety();
      overlayRef.current = null;
      setReady(false);
      map.remove();
      mapRef.current = null;
    };
  }, [artifact, effectivePitch, usePosterOnly]);

  return (
    <div
      ref={containerRef}
      className={`${styles.mapRoot}${ready ? ` ${styles.ready}` : ""}`}
      aria-label={artifact.vizId}
      data-viz-ready={ready ? "true" : undefined}
    >
      <small className={styles.attribution}>
        <a href="https://openmaptiles.org/" target="_blank" rel="noreferrer">
          OpenMapTiles
        </a>
        {" / "}
        <a
          href="https://www.openstreetmap.org/copyright"
          target="_blank"
          rel="noreferrer"
        >
          OpenStreetMap
        </a>
      </small>
    </div>
  );
}
