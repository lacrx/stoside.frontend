# Strong Towns Oceanside — Frontend App Context

> Reference document for AWS architecture planning.

## Overview

**Strong Towns Oceanside** is a community-focused static website for the Oceanside, CA chapter of the Strong Towns movement. It features articles/blog content, an interactive parcel value-per-acre (VPA) map, event listings (in-progress), and informational pages.

| Attribute | Value |
|-----------|-------|
| **Framework** | Gatsby v5.16.1 (React 18, TypeScript 5.9) |
| **Output** | Static site (SSG) — pre-built HTML/CSS/JS in `/public` |
| **Node requirement** | >=22.0.0 |
| **Build command** | `gatsby build` |
| **Dev command** | `gatsby develop` |

## Pages & Routing

| Route | Type | Description |
|-------|------|-------------|
| `/` | Static | Hero + featured article card + "Learn" promo |
| `/articles` | Static | Grid of all articles sourced from Strapi |
| `/articles/{slug}` | Dynamic (gatsby-node) | Individual article: hero, cover image, sanitized HTML body |
| `/learn` | Static | Description + interactive deck.gl / Google Maps VPA map |
| `/events` | Static | Placeholder — Meetup API integration in-progress |
| `/about` | Static | Placeholder about page |
| `/404` | Static | Not-found page |

## Data Sources

### 1. Strapi CMS (primary)

- **Protocol:** GraphQL (`graphql-request` client)
- **Current endpoint:** `http://localhost:1337/graphql` (hardcoded — needs env var)
- **Build-time only:** Data is fetched in `gatsby-node.ts` `sourceNodes` hook, turned into Gatsby nodes, and baked into static HTML at build time. No runtime CMS calls.
- **Content processed:** Markdown → HTML via `marked`, sanitized with `isomorphic-dompurify`.

**Data model:**

```
Article {
  documentId  UUID
  title       String
  description String
  slug        String (UID)
  cover       Media (single image → fetched as remote file node)
  blocks      DynamicZone [
    SharedRichText { body: String }
  ]
  author      → Author { name: String }
  publishedAt DateTime
}
```

### 2. GeoJSON (static file)

- `src/assets/data/analysis.geojson` — Parcel-level VPA data for Oceanside (source: Regrid 2023).
- Loaded at build time via `gatsby-source-filesystem`.
- Rendered on `/learn` with deck.gl `GeoJsonLayer` (3D extruded polygons, 13-color d3 threshold scale).

### 3. Meetup API (planned, not yet wired)

- GraphQL query for `proNetworkByUrlname("strong-towns-oceanside")` exists in `gatsby-node.ts` but is not yet connected to the Events page.

### 4. Google Maps

- Maps JavaScript API loaded at runtime via `@googlemaps/js-api-loader`.
- API key and Map ID are currently hardcoded in `src/components/Map/map.tsx` (**should move to env vars**).
- Used as the base map under the deck.gl overlay on `/learn`.

## Key Dependencies

| Category | Libraries |
|----------|-----------|
| **Core** | gatsby 5.16, react 18.3, react-dom 18.3, typescript 5.9 |
| **GraphQL** | graphql-request 7.4, @graphql-codegen/* (CLI + client-preset + TS ops) |
| **Mapping / Viz** | @deck.gl/core 9.3, @deck.gl/layers, @deck.gl/google-maps, @googlemaps/js-api-loader 2.0, d3-scale 4.0 |
| **Content** | marked 18.0, isomorphic-dompurify 3.8, gatsby-transformer-remark 6.16 |
| **Images** | gatsby-plugin-image 3.16, gatsby-plugin-sharp, gatsby-transformer-sharp |
| **Styling** | CSS Modules (react-css-modules 4.7, typed-css-modules 0.9) |
| **PWA** | gatsby-plugin-manifest (icons 48–512px) |

## Component Architecture

```
Layout
├── Nav          (responsive hamburger, links to all pages + external Meetup/Instagram)
├── {children}   (page content)
│   ├── Hero     (reusable page header: title, description, optional CTA, optional pelican mascot)
│   ├── Card     (article/promo card: title, description, image, link)
│   ├── Content  (wrapper — renders as <section> or <table>)
│   └── Map      (deck.gl + Google Maps interactive VPA map)
└── Footer
```

## Build-Time Data Flow

```
Strapi CMS ──GraphQL──▶ gatsby-node.ts sourceNodes
                            │
                            ├── create GatsbyArticle nodes
                            ├── createRemoteFileNode for cover images
                            └── DOMPurify + marked → sanitized HTML
                                     │
                           gatsby-node.ts createPages
                                     │
                                     ├── /articles/{slug} for each article
                                     ▼
                              gatsby build → /public (static files)
```

## Configuration — Environment Variables

All previously hardcoded values have been extracted to environment variables:

| Variable | Scope | Used In | Notes |
|----------|-------|---------|-------|
| `STRAPI_URL` | Build-time | `gatsby-node.ts` | Strapi base URL (e.g., `https://cms.stoside.org`). Falls back to `http://localhost:1337`. |
| `GATSBY_STRAPI_URL` | Build+Runtime | `src/graphql/provider.tsx` | `GATSBY_` prefix makes it available in browser JS. Falls back to `http://localhost:1337`. |
| `GATSBY_GOOGLE_MAPS_API_KEY` | Build+Runtime | `src/components/Map/map.tsx` | Google Maps JavaScript API key. |
| `GATSBY_GOOGLE_MAPS_MAP_ID` | Build+Runtime | `src/components/Map/map.tsx` | Google Maps custom Map ID. |

## AWS Architecture Considerations

### Static Frontend Hosting
- **S3 + CloudFront** is the natural fit — serve `/public` as a static website (`stoside.org` / `www.stoside.org`).
- Hash-based cache busting for JS/CSS assets; short TTL for HTML files.
- Route all paths to `index.html` for client-side Gatsby routing (or configure CloudFront custom error responses for 404 → `/404.html`).

### Strapi CMS Backend
- **ECS Fargate** or **App Runner** for containerized Strapi.
- **RDS PostgreSQL** for Strapi's database.
- **S3** for Strapi media uploads (cover images, etc.).
- Expose via **ALB** or **API Gateway** on a subdomain (`cms.stoside.org`).

### Build Pipeline
- **CodePipeline / CodeBuild** or **GitHub Actions** → run `gatsby build` with env vars → sync `/public` to S3 → invalidate CloudFront.
- Strapi webhook on content publish → trigger rebuild.

### DNS & TLS
- **Route 53** for domain management.
- **ACM** for TLS certificates (CloudFront + ALB).

### Future Considerations
- Meetup API integration may require a Lambda proxy or API Gateway if the Meetup API needs server-side auth.
- Google Maps API key should be restricted by HTTP referrer in the Google Cloud Console.
