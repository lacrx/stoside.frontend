import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from "react";
import * as s from "./walk-audit.module.css";

type PinMapProps = {
  lat: number | null;
  lng: number | null;
  onPin: (lat: number, lng: number, label: string | null) => void;
};

export type PinMapHandle = {
  setPin: (lat: number, lng: number) => void;
};

const OCEANSIDE: [number, number] = [33.1959, -117.3795];
const LEAFLET_CSS = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
const LEAFLET_JS = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";

function loadScript(src: string): Promise<void> {
  if (document.querySelector(`script[src="${src}"]`)) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const el = document.createElement("script");
    el.src = src;
    el.onload = () => resolve();
    el.onerror = reject;
    document.head.appendChild(el);
  });
}

function loadCSS(href: string) {
  if (document.querySelector(`link[href="${href}"]`)) return;
  const el = document.createElement("link");
  el.rel = "stylesheet";
  el.href = href;
  document.head.appendChild(el);
}

export async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=18`,
      { headers: { "Accept-Language": "en" } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const a = data.address;
    if (a?.road) {
      return a.house_number ? `${a.house_number} ${a.road}` : a.road;
    }
    return data.display_name?.split(",").slice(0, 2).join(",").trim() || null;
  } catch {
    return null;
  }
}

export async function forwardGeocode(query: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&viewbox=-117.45,33.25,-117.30,33.15&bounded=1`,
      { headers: { "Accept-Language": "en" } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.length) {
      const unbounded = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query + ", Oceanside, CA")}&format=json&limit=1`,
        { headers: { "Accept-Language": "en" } }
      );
      if (!unbounded.ok) return null;
      const data2 = await unbounded.json();
      if (!data2.length) return null;
      return { lat: parseFloat(data2[0].lat), lng: parseFloat(data2[0].lon) };
    }
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  } catch {
    return null;
  }
}

const PinMap = forwardRef<PinMapHandle, PinMapProps>(function PinMap({ lat, lng, onPin }, ref) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [ready, setReady] = useState(false);
  const [locating, setLocating] = useState(false);

  useImperativeHandle(ref, () => ({
    setPin(newLat: number, newLng: number) {
      const L = (window as any).L;
      const map = mapRef.current;
      if (!map || !L) return;
      map.setView([newLat, newLng], 17);
      if (markerRef.current) {
        markerRef.current.setLatLng([newLat, newLng]);
      } else {
        markerRef.current = L.marker([newLat, newLng]).addTo(map);
      }
    },
  }));

  useEffect(() => {
    if (typeof window === "undefined") return;
    loadCSS(LEAFLET_CSS);
    loadScript(LEAFLET_JS).then(() => setReady(true));
  }, []);

  useEffect(() => {
    if (!ready || !containerRef.current || mapRef.current) return;
    const L = (window as any).L;
    const center: [number, number] = lat != null && lng != null ? [lat, lng] : OCEANSIDE;
    const map = L.map(containerRef.current, {
      center,
      zoom: 17,
      zoomControl: true,
      attributionControl: false,
    });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(map);
    mapRef.current = map;

    if (lat != null && lng != null) {
      markerRef.current = L.marker([lat, lng]).addTo(map);
    }

    map.on("click", async (e: any) => {
      const { lat: clickLat, lng: clickLng } = e.latlng;
      if (markerRef.current) {
        markerRef.current.setLatLng([clickLat, clickLng]);
      } else {
        markerRef.current = L.marker([clickLat, clickLng]).addTo(map);
      }
      const label = await reverseGeocode(clickLat, clickLng);
      onPin(clickLat, clickLng, label);
    });

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, [ready]);

  const handleGPS = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const L = (window as any).L;
        const map = mapRef.current;
        if (map) {
          map.setView([latitude, longitude], 17);
          if (markerRef.current) {
            markerRef.current.setLatLng([latitude, longitude]);
          } else {
            markerRef.current = L.marker([latitude, longitude]).addTo(map);
          }
        }
        const label = await reverseGeocode(latitude, longitude);
        onPin(latitude, longitude, label);
        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 15000 }
    );
  };

  return (
    <div className={s.pinMapWrap}>
      <div ref={containerRef} className={s.pinMap} />
      <button type="button" className={s.btnGps} onClick={handleGPS} disabled={locating}>
        {locating ? "Locating…" : "📍 Use my location"}
      </button>
    </div>
  );
});

export default PinMap;
