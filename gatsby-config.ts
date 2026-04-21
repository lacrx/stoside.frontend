import type { GatsbyConfig } from 'gatsby';

const config: GatsbyConfig = {
    jsxRuntime: "automatic",
    plugins: [
      "gatsby-plugin-image",
      "gatsby-plugin-sharp",
      "gatsby-transformer-sharp",
      {
        resolve: "gatsby-source-filesystem",
        options: {
          name: "images",
          path: `${__dirname}/src/assets/images/`,
        },
      },
      {
        resolve: "gatsby-source-filesystem",
        options: {
          name: "data",
          path: `${__dirname}/src/assets/data/`,
        },
      },
      {
        resolve: "gatsby-source-filesystem",
        options: {
          name: "visualizations",
          path: `${__dirname}/src/assets/visualizations/`,
        },
      },
      {
        resolve: "gatsby-plugin-manifest",
        options: {
          icon: `${__dirname}/src/assets/images/favicon.png`,
        }
      },
      {
        // Service worker for return-visit instant loads. Precaches ONLY the
        // small app shell (JS/CSS/HTML/fonts); everything else flows
        // through runtime caches below so the initial install doesn't
        // compete with the foreground page render. Note: the plugin's
        // schema is strict — only urlPattern + handler + networkTimeoutSeconds
        // are allowed per runtime-cache entry, so we rely on Workbox's
        // defaults for cacheName/TTL (browser quota handles eviction).
        resolve: "gatsby-plugin-offline",
        options: {
          workboxConfig: {
            // Ruthless first-load policy: precache ONLY the offline app
            // shell fallback so the "you're offline" page still works.
            // Every other asset (JS chunks, CSS, HTML, images) is
            // runtime-cached on first use — no post-load background
            // fetches burning bandwidth or CPU for pages the user may
            // never visit. Tradeoff: on a return visit, only the pages
            // the user has actually visited are instant-from-cache;
            // unvisited pages still hit the network.
            maximumFileSizeToCacheInBytes: 2 * 1024 * 1024,
            globPatterns: ["**/offline-plugin-app-shell-fallback/*.html"],
            runtimeCaching: [
              // Gatsby's webpack chunks (JS, CSS, HTML etc under the
              // public/ root). Hashed filenames = safe to cache forever.
              {
                urlPattern: /\.(?:js|css|html)$/,
                handler: "CacheFirst",
              },
              // Gatsby's content-hashed static assets: posters, images,
              // copied GeoJSON. Immutable by definition; serve from cache.
              {
                urlPattern: /\/static\/.*/,
                handler: "CacheFirst",
              },
              // Protomaps basemap (PMTiles archive + fonts/sprites).
              {
                urlPattern: /^https:\/\/(demo-bucket\.protomaps\.com|protomaps\.github\.io)\//,
                handler: "CacheFirst",
              },
              // Any other image/font the site loads (favicon, pelican, etc).
              {
                urlPattern: /\.(png|jpg|jpeg|svg|webp|gif|woff2?)$/,
                handler: "CacheFirst",
              },
              // Per-page JSON. Stale-while-revalidate so content updates
              // show up on the next visit without requiring a SW refresh.
              {
                urlPattern: /\/page-data\/.*\.json$/,
                handler: "StaleWhileRevalidate",
              },
            ],
          },
        },
      }
    ],
    siteMetadata: {
      title: "Strong Towns Oceanside",
    }
};

export default config;
