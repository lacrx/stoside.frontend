import type { GatsbyBrowser } from "gatsby";

// Self-heal for users whose service worker or HTTP cache has stale
// webpack chunks that reference hashed asset URLs the current build
// has deleted (classic post-deploy cache mismatch). When any chunk
// load fails, unregister the SW, purge all Cache Storage entries, and
// reload the page. A sessionStorage flag prevents runaway reloads
// on genuine 404s that aren't cache-related.
export const onClientEntry: GatsbyBrowser["onClientEntry"] = () => {
  if (typeof window === "undefined") return;

  const RECOVERY_KEY = "__stoside_sw_recovery_attempted";

  const recover = async (reason: string) => {
    if (sessionStorage.getItem(RECOVERY_KEY)) return;
    sessionStorage.setItem(RECOVERY_KEY, reason);

    try {
      if ("serviceWorker" in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map((r) => r.unregister()));
      }
      if ("caches" in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      }
    } finally {
      window.location.reload();
    }
  };

  const isChunkLoadError = (msg: string) =>
    msg.includes("Loading chunk") ||
    msg.includes("Loading CSS chunk") ||
    msg.includes("ChunkLoadError");

  window.addEventListener("unhandledrejection", (event) => {
    const msg = String(event.reason?.message ?? event.reason ?? "");
    if (isChunkLoadError(msg)) recover(msg);
  });

  window.addEventListener("error", (event) => {
    if (event.message && isChunkLoadError(event.message)) {
      recover(event.message);
    }
  });
};
