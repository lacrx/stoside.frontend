import { useEffect, useMemo, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import { Protocol } from "pmtiles";
import { MapboxOverlay } from "@deck.gl/mapbox";
import { GeoJsonLayer } from "@deck.gl/layers";
import { scaleThreshold } from "d3-scale";
import type { Feature } from "geojson";
import layersForTheme from "protomaps-themes-base";
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
  fallback2d: { pitch: number | null; extruded: boolean | null; maxViewportWidth: number | null } | null;
};

type Props = { artifact: Artifact };

const DEFAULT_PMTILES_URL =
  process.env.GATSBY_PMTILES_URL || "https://demo-bucket.protomaps.com/v4.pmtiles";

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

  const fallbackBp = artifact.fallback2d?.maxViewportWidth ?? 640;
  const isNarrow = useIsNarrowViewport(artifact.fallback2d ? fallbackBp : null);
  const useFallback = Boolean(artifact.fallback2d && isNarrow);
  const extruded = useFallback ? (artifact.fallback2d?.extruded ?? false) : true;

  const effectivePitch = useMemo(() => {
    if (useFallback) return artifact.fallback2d?.pitch ?? 0;
    return artifact.camera?.pitch ?? 45;
  }, [useFallback, artifact.camera, artifact.fallback2d]);

  useEffect(() => {
    if (!containerRef.current) return;
    if (!artifact.camera || !artifact.color || !artifact.elevation) return;
    const hasTiles = Boolean(artifact.featuresTilesFile?.publicURL);
    const hasGeojson = Boolean(artifact.featuresFile?.publicURL);
    if (!hasTiles && !hasGeojson) return;

    ensurePmtilesProtocol();

    const { camera, color, elevation } = artifact;
    const [lng, lat] = camera.center;

    const themeLayers = layersForTheme("protomaps", "light", "en").map(layer =>
      layer.type === "background"
        ? { ...layer, paint: { ...(layer.paint ?? {}), "background-color": "#ffffff" } }
        : layer
    );

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: {
        version: 8,
        glyphs: "https://protomaps.github.io/basemaps-assets/fonts/{fontstack}/{range}.pbf",
        sprite: "https://protomaps.github.io/basemaps-assets/sprites/v4/light",
        sources: {
          protomaps: {
            type: "vector",
            url: `pmtiles://${DEFAULT_PMTILES_URL}`,
            attribution:
              '<a href="https://protomaps.com">Protomaps</a> &copy; <a href="https://openstreetmap.org">OpenStreetMap</a>',
          },
        },
        layers: themeLayers,
      },
      center: [lng, lat],
      zoom: camera.zoom ?? 11,
      pitch: effectivePitch,
      bearing: camera.bearing ?? 0,
      maxPitch: 85,
      antialias: true,
      attributionControl: { compact: true },
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
      requestAnimationFrame(() =>
        requestAnimationFrame(() => setReady(true))
      );
    };

    // Safety net: if data never loads (network error, bad URL, etc.) we
    // still want the map visible eventually instead of an eternal poster.
    const safetyTimer = window.setTimeout(markReady, 6000);
    const clearSafety = () => window.clearTimeout(safetyTimer);

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
            "fill-extrusion-height": extruded
              ? (["/", ["get", elevation.field], elevation.divisor ?? 1] as any)
              : 0,
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

        const overlay = new MapboxOverlay({
          interleaved: true,
          layers: [
            new GeoJsonLayer({
              id: artifact.vizId,
              data: artifact.featuresFile!.publicURL!,
              stroked: false,
              filled: true,
              extruded,
              opacity: 0.75,
              pickable: true,
              getFillColor: (f: Feature) =>
                [...colorScale(f.properties?.[color.field] ?? 0), 220] as [number, number, number, number],
              getElevation: (f: Feature) =>
                (f.properties?.[elevation.field] ?? 0) / divisor,
              onDataLoad: () => {
                clearSafety();
                markReady();
              },
            }),
          ],
        });
        overlayRef.current = overlay;
        map.addControl(overlay as unknown as maplibregl.IControl);
      }
    });

    return () => {
      clearSafety();
      overlayRef.current = null;
      setReady(false);
      map.remove();
      mapRef.current = null;
    };
  }, [artifact, extruded, effectivePitch]);

  return (
    <div
      ref={containerRef}
      className={`${styles.mapRoot}${ready ? ` ${styles.ready}` : ""}`}
      aria-label={artifact.vizId}
    />
  );
}
