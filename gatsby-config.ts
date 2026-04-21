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
        // schema is strict (only urlPattern + handler + networkTimeoutSeconds),
        // are allowed per runtime-cache entry, so we rely on Workbox's
        // defaults for cacheName/TTL (browser quota handles eviction).
        resolve: "gatsby-plugin-offline",
        options: {
          // Flush runtime caches on every SW update. Keeps the user from
          // being served cached JS chunks that reference deleted asset
          // URLs after a deploy that renames / drops files (classic case:
          // poster.png -> poster.jpg). Precache cache is untouched.
          appendScript: `${__dirname}/src/sw-cleanup.js`,
          workboxConfig: {
            // Ruthless first-load policy: precache ONLY the offline app
            // shell fallback so the "you're offline" page still works.
            // Every other asset (JS chunks, CSS, HTML, images) is
            // runtime-cached on first use, so no post-load background
            // fetches burn bandwidth or CPU for pages the user may never
            // visit. Tradeoff: on a return visit, only the pages
            // the user has actually visited are instant-from-cache;
            // unvisited pages still hit the network.
            maximumFileSizeToCacheInBytes: 2 * 1024 * 1024,
            globPatterns: ["**/offline-plugin-app-shell-fallback/*.html"],
            // On update, new SW takes over immediately without waiting for
            // all tabs to close; old cache entries that no longer match
            // the current build are not served on the first visit.
            skipWaiting: true,
            clientsClaim: true,
            runtimeCaching: [
              // Hashed Gatsby JS / CSS bundles. Filenames include content
              // hashes so CacheFirst is safe; new deploys land under new
              // names and replace the old ones automatically.
              {
                urlPattern: /\.(?:js|css)$/,
                handler: "CacheFirst",
              },
              // Gatsby's content-hashed static assets (posters, images,
              // copied GeoJSON). Immutable by definition.
              {
                urlPattern: /\/static\/.*/,
                handler: "CacheFirst",
              },
              // Self-hosted basemap PMTiles under /tiles/. Served at long
              // TTL from CloudFront; the file is replaced in place on
              // deploy so CacheFirst + a hard refresh when the extract
              // changes is the right tradeoff.
              {
                urlPattern: /\/tiles\/.*\.pmtiles$/,
                handler: "CacheFirst",
              },
              // Protomaps basemap (PMTiles archive + fonts/sprites).
              {
                urlPattern: /^https:\/\/(demo-bucket\.protomaps\.com|protomaps\.github\.io)\//,
                handler: "CacheFirst",
              },
              // Other image / font assets (favicon, pelican, etc).
              {
                urlPattern: /\.(png|jpg|jpeg|svg|webp|avif|gif|woff2?)$/,
                handler: "CacheFirst",
              },
              // HTML routing targets. Content changes in place across
              // deploys (same URL, new static-query hashes baked in), so
              // NetworkFirst is the only safe handler — falling back to
              // cache only if the user is genuinely offline. Fixes the
              // "result of this StaticQuery could not be fetched" error
              // that happens when new JS meets old cached HTML.
              {
                urlPattern: /\.html$/,
                handler: "NetworkFirst",
              },
              // Per-page JSON. Same reasoning as HTML: URL is fixed but
              // the payload changes per build, and new JS expects new
              // data shapes.
              {
                urlPattern: /\/page-data\/.*\.json$/,
                handler: "NetworkFirst",
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
