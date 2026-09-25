import fs from "fs";
import path from "path";
import { marked } from "marked";
import { sanitize } from "isomorphic-dompurify";
import { type GatsbyNode, useStaticQuery } from "gatsby";
import { createRemoteFileNode } from "gatsby-source-filesystem";
import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";
import { GraphQLClient } from "graphql-request";

const SUBSTACK_CDN_RE = /(<img\s[^>]*src=")(https:\/\/substackcdn\.com\/image\/fetch\/[^/]+\/)(https%3A[^"]+)("[^>]*>)/g;
function addResponsiveSrcset(html: string): string {
  const CDN = 'https://substackcdn.com/image/fetch/';
  const OPTS = ',c_limit,f_auto,q_auto:good,fl_progressive:steep/';
  return html.replace(SUBSTACK_CDN_RE, (_match, pre, _cdnUrl, encodedSrc, post) => {
    const s300 = `${CDN}w_300${OPTS}${encodedSrc}`;
    const s600 = `${CDN}w_600${OPTS}${encodedSrc}`;
    const s1200 = `${CDN}w_1200${OPTS}${encodedSrc}`;
    const srcset = `${s300} 300w, ${s600} 600w, ${s1200} 1200w`;
    const sizes = '(max-width: 600px) 100vw, 600px';
    return `${pre}${s600}${post.replace('>', ` srcset="${srcset}" sizes="${sizes}" loading="lazy">`)}`;
  });
}


export const onCreateWebpackConfig: GatsbyNode["onCreateWebpackConfig"] = ({
  actions,
}) => {
  actions.setWebpackConfig({
    resolve: {
      plugins: [new TsconfigPathsPlugin()]
    },
  });
};

const getAllStrapiArticles = `
  query GetAllStrapiArticles {
    articles(sort: ["publishedAt:desc"]) {
      documentId
      title
      description
      slug
      cover {
        url
      }
      authors {
        name
      }
      blocks {
        __typename
        ...on ComponentSharedRichText {
          body
        }
        ...on ComponentSharedVisualization {
          vizId
          caption
          height
          align
        }
      }
      publishedAt
    }
  }
`;

const getStrapiSiteSetting = `
  query GetStrapiSiteSetting {
    siteSetting {
      instagramUrl
      meetupUrl
    }
  }
`;

const getAllStrapiWalkAudits = `
  query GetAllStrapiWalkAudits {
    walkAudits(filters: { status: { ne: "draft" } }, sort: ["date:desc"]) {
      title
      slug
      date
      status
      description
      mapUrl
      segments {
        name
      }
      summary
    }
  }
`;

const getAllMeetupEvents = `
  query GetAllMeetupEvents {
    proNetworkByUrlname(urlname: "strong-towns-oceanside") {
      eventsSearch(filter: { status: UPCOMING }, input: { first: 5 }) {
        edges {
          node {
            title
            eventUrl
            description
            howToFindUs
            venue {
              name
              address
              city
              state
              postalCode
            }
            images {
              baseUrl
              source
            }
            dateTime
            duration
          }
        }
      }
    }
  }
`;

type StrapiBlock =
  | { __typename: "ComponentSharedRichText"; body: string }
  | { __typename: "ComponentSharedVisualization"; vizId: string; caption: string | null; height: number | null; align: string | null };

type UploadFile = {
  url: string
};
type Article = {
  documentId: string
  title: string
  description: string
  slug: string
  cover: UploadFile
  authors: { name: string }[]
  blocks: StrapiBlock[]
  publishedAt: Date
};
interface ArticleResponse {
  articles: Article[]
};
type ArticleBlock = {
  kind: "rich-text" | "visualization"
  html?: string
  vizId?: string
  caption?: string | null
  height?: number | null
  align?: string | null
};
type GatsbyArticle = {
  title: string
  description: string
  slug: string
  image: string | undefined
  authorName: string | null
  blocks: ArticleBlock[]
  publishedAt: Date
};
interface GatsbyArticles {
  allGatsbyArticle: {
    nodes: [GatsbyArticle]
  }
}

interface SiteSettingResponse {
  siteSetting: {
    instagramUrl: string | null
    meetupUrl: string | null
  } | null
}

type WalkAuditSegment = { name: string };
type RouteCoord = [number, number]; // [lat, lng]
type RouteSegment = { name: string; lines: RouteCoord[][] };
type StrapiWalkAudit = {
  title: string
  slug: string
  date: string
  status: "active" | "completed"
  description: string | null
  mapUrl: string | null
  segments: WalkAuditSegment[]
  summary: string | null
};

function parseCoordinateBlock(block: string): RouteCoord[] {
  const raw = block.replace(/<\/?coordinates>/g, "").trim();
  return raw.split(/\s+/).map(p => {
    const [lng, lat] = p.split(",").map(Number);
    return [lat, lng] as RouteCoord;
  }).filter(([lat, lng]) => !isNaN(lat) && !isNaN(lng));
}

async function fetchRouteFromKml(mapUrl: string): Promise<RouteSegment[]> {
  const midMatch = mapUrl.match(/mid=([^&]+)/);
  if (!midMatch) return [];
  const kmlUrl = `https://www.google.com/maps/d/kml?mid=${midMatch[1]}&forcekml=1`;
  try {
    const res = await fetch(kmlUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; StosideBot/1.0)" },
    });
    if (!res.ok) return [];
    const kml = await res.text();
    const segments: RouteSegment[] = [];
    const folderRegex = /<Folder>([\s\S]*?)<\/Folder>/g;
    for (const folderMatch of kml.matchAll(folderRegex)) {
      const folder = folderMatch[1];
      const nameMatch = folder.match(/<name>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/name>/);
      const name = nameMatch?.[1]?.trim() || "";
      if (name.toLowerCase().includes("observation")) continue;
      const coordBlocks = folder.match(/<coordinates>[^<]+<\/coordinates>/g) || [];
      const lines: RouteCoord[][] = [];
      for (const block of coordBlocks) {
        const points = parseCoordinateBlock(block);
        if (points.length >= 2) lines.push(points);
      }
      if (lines.length > 0) {
        const existing = segments.find(s => s.name[0] === name[0] && /^\d/.test(name[0]));
        if (existing) {
          existing.lines.push(...lines);
        } else {
          segments.push({ name, lines });
        }
      }
    }
    return segments;
  } catch {
    return [];
  }
}
interface WalkAuditResponse {
  walkAudits: StrapiWalkAudit[]
}

type MeetupEventJsonLd = {
  "@type": string
  name: string
  url: string
  description?: string
  startDate: string
  endDate?: string
  location?: {
    name?: string
    address?: {
      streetAddress?: string
      addressLocality?: string
      addressRegion?: string
    }
  }
};

type MeetupEvent = MeetupEventJsonLd & { imageUrl?: string };

const MEETUP_GROUP_URL = "https://www.meetup.com/north-county-urbanists/";
const EVENT_TIMEZONE = "America/Los_Angeles";

function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function formatEventDate(iso: string): string {
  const d = new Date(iso);
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: EVENT_TIMEZONE,
    weekday: "long",
    month: "long",
    day: "numeric",
  }).formatToParts(d);
  const weekday = parts.find(p => p.type === "weekday")!.value;
  const month = parts.find(p => p.type === "month")!.value;
  const day = Number(parts.find(p => p.type === "day")!.value);
  const timeStr = new Intl.DateTimeFormat("en-US", {
    timeZone: EVENT_TIMEZONE,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(d);
  return `${weekday}, ${month} ${ordinal(day)} at ${timeStr}`;
}

function buildEventImageMap(nextData: unknown): Record<string, string> {
  const photos: Record<string, string> = {};
  const events: Array<{ url: string; photoId?: string }> = [];

  const walk = (node: unknown): void => {
    if (Array.isArray(node)) { node.forEach(walk); return; }
    if (!node || typeof node !== "object") return;

    const obj = node as Record<string, any>;
    if (obj.__typename === "PhotoInfo" && obj.id && obj.highResUrl) {
      photos[obj.id] = obj.highResUrl;
    }
    if (obj.__typename === "Event" && obj.eventUrl) {
      const photoRef = obj.displayPhoto?.__ref || obj.featuredEventPhoto?.__ref;
      const photoId = typeof photoRef === "string" ? photoRef.replace("PhotoInfo:", "") : undefined;
      events.push({ url: obj.eventUrl, photoId });
    }
    Object.values(obj).forEach(walk);
  };
  walk(nextData);

  const map: Record<string, string> = {};
  for (const e of events) {
    if (e.photoId && photos[e.photoId]) map[e.url] = photos[e.photoId];
  }
  return map;
}

async function fetchUpcomingMeetupEvents(limit = 5): Promise<MeetupEvent[]> {
  const res = await fetch(MEETUP_GROUP_URL, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; StosideBot/1.0)" },
  });
  if (!res.ok) throw new Error(`Meetup page returned ${res.status}`);
  const html = await res.text();

  const events: MeetupEventJsonLd[] = [];
  const scriptRegex = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g;
  for (const match of html.matchAll(scriptRegex)) {
    try {
      const data = JSON.parse(match[1]);
      const items = Array.isArray(data) ? data : [data];
      for (const item of items) {
        if (item?.["@type"] === "Event" && item.startDate) events.push(item);
      }
    } catch {
      // ignore unparsable blocks
    }
  }

  let imageMap: Record<string, string> = {};
  const nextMatch = html.match(/__NEXT_DATA__"\s+type="application\/json">([\s\S]*?)<\/script>/);
  if (nextMatch) {
    try {
      imageMap = buildEventImageMap(JSON.parse(nextMatch[1]));
    } catch {
      // structure may have changed; continue without images
    }
  }

  const now = Date.now();
  return events
    .filter(e => new Date(e.startDate).getTime() > now)
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, limit)
    .map(e => ({ ...e, imageUrl: imageMap[e.url] }));
}

export const sourceNodes: GatsbyNode["sourceNodes"] = async ({
  actions: { createNode },
  createContentDigest,
  createNodeId,
  getCache,
  getNodesByType,
}) => {
  const strapiUrl = process.env.STRAPI_URL || "http://localhost:1337";
  const strapiGraphqlClient = new GraphQLClient(`${strapiUrl}/graphql`);

  let articles: Article[] = [];
  try {
    const articleResult = await strapiGraphqlClient.request<ArticleResponse>(getAllStrapiArticles);
    articles = articleResult.articles;
  } catch (err) {
    console.warn(`[gatsby-node] Skipping Strapi articles: could not reach ${strapiUrl}. ${(err as Error).message}`);
  }

  try {
    const settingResult = await strapiGraphqlClient.request<SiteSettingResponse>(getStrapiSiteSetting);
    const setting = settingResult.siteSetting;
    const gatsbySiteSetting = {
      instagramUrl: setting?.instagramUrl ?? null,
      meetupUrl: setting?.meetupUrl ?? null,
    };
    createNode({
      ...gatsbySiteSetting,
      id: createNodeId("site-setting"),
      internal: {
        type: "GatsbySiteSetting",
        contentDigest: createContentDigest(gatsbySiteSetting),
      },
    });
  } catch (err) {
    console.warn(`[gatsby-node] Skipping Strapi site settings: ${(err as Error).message}`);
  }

  const COVER_FALLBACKS: Record<string, string> = {
    'our-wealth-is-downtown': 'oceanside-wealth-poster-desktop.jpg',
  };

  const images = articles.length === 0 ? [] : await Promise.all(articles.map( async (article) => {
    if (!article?.cover?.url) {
      const fallbackBase = COVER_FALLBACKS[article.slug];
      if (fallbackBase) {
        const fileNode = getNodesByType('File').find(
          (n: Record<string, unknown>) => n.base === fallbackBase
        );
        return { id: fileNode?.id as string | undefined, fallback: true };
      }
      return { id: undefined, fallback: false };
    }
    const coverUrl = article.cover.url.startsWith('http')
      ? article.cover.url
      : `${strapiUrl}${article.cover.url}`;
    return { id: (await createRemoteFileNode({
      url: coverUrl,
      createNode,
      createNodeId,
      getCache,
    })).id, fallback: false };
  }));
  articles.forEach(({ title, description, slug, blocks, authors, publishedAt }, i) => {
    const structuredBlocks: ArticleBlock[] = blocks.map(block => {
      if (block.__typename === "ComponentSharedRichText") {
        return {
          kind: "rich-text",
          html: addResponsiveSrcset(sanitize(marked.parse(block.body) as string))
        };
      }
      return {
        kind: "visualization",
        vizId: block.vizId,
        caption: block.caption,
        height: block.height,
        align: block.align
      };
    });

    const gatsbyArticle: GatsbyArticle = {
      title,
      description,
      slug,
      image: images[i].id,
      coverIsFallback: images[i].fallback,
      authorName: authors?.length ? authors.map(a => a.name).join(' & ') : null,
      blocks: structuredBlocks,
      publishedAt
    };

    createNode({
      ...gatsbyArticle,
      id: createNodeId(gatsbyArticle.slug),
      internal: {
        type: `GatsbyArticle`,
        contentDigest: createContentDigest(gatsbyArticle)
      }
    });
  });

  try {
    const walkAuditResult = await strapiGraphqlClient.request<WalkAuditResponse>(getAllStrapiWalkAudits);
    for (const audit of walkAuditResult.walkAudits) {
      let routeSegments: RouteSegment[] = [];
      if (audit.mapUrl) {
        routeSegments = await fetchRouteFromKml(audit.mapUrl);
      }
      createNode({
        ...audit,
        routeSegments,
        id: createNodeId(`walk-audit-${audit.slug}`),
        internal: {
          type: "GatsbyWalkAudit",
          contentDigest: createContentDigest({ ...audit, routeSegments }),
        },
      });
    }
  } catch (err) {
    console.warn(`[gatsby-node] Skipping Strapi walk audits: ${(err as Error).message}`);
  }

  const visualizationsDir = path.resolve(__dirname, "src/assets/visualizations");
  if (fs.existsSync(visualizationsDir)) {
    for (const vizDir of fs.readdirSync(visualizationsDir)) {
      const artifactPath = path.join(visualizationsDir, vizDir, "artifact.json");
      if (!fs.existsSync(artifactPath)) continue;
      try {
        const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf-8"));
        createNode({
          ...artifact,
          id: createNodeId(`viz-${artifact.id}`),
          internal: {
            type: "GatsbyVisualization",
            contentDigest: createContentDigest(artifact)
          }
        });
      } catch (err) {
        console.warn(`[gatsby-node] Skipping visualization ${vizDir}: ${(err as Error).message}`);
      }
    }
  }

  try {
    const meetupEvents = await fetchUpcomingMeetupEvents(5);
    for (const event of meetupEvents) {
      const locationParts = [
        event.location?.name,
        event.location?.address?.addressLocality,
      ].filter(Boolean);

      let imageNodeId: string | undefined;
      if (event.imageUrl) {
        try {
          const imageNode = await createRemoteFileNode({
            url: event.imageUrl,
            createNode,
            createNodeId,
            getCache,
          });
          imageNodeId = imageNode.id;
        } catch (err) {
          console.warn(`[gatsby-node] Could not fetch image for "${event.name}": ${(err as Error).message}`);
        }
      }

      const gatsbyEvent = {
        title: event.name,
        description: event.description || "",
        url: event.url,
        location: locationParts.join(", "),
        startDate: event.startDate,
        startDateDisplay: formatEventDate(event.startDate),
        endDate: event.endDate || null,
        image: imageNodeId,
      };

      createNode({
        ...gatsbyEvent,
        id: createNodeId(`meetup-${event.url}`),
        internal: {
          type: `GatsbyEvent`,
          contentDigest: createContentDigest(gatsbyEvent),
        },
      });
    }
  } catch (err) {
    console.warn(`[gatsby-node] Skipping Meetup events: ${(err as Error).message}`);
  }
};

const articleTemplate = path.resolve("./src/templates/article.tsx");
const walkAuditTemplate = path.resolve("./src/templates/walk-audit.tsx");

export const createPages: GatsbyNode["createPages"] = async ({ actions: { createPage }, graphql }) => {
  const allGatsbyArticle = await graphql<GatsbyArticles>(`
    query AllGatsbyArticle {
      allGatsbyArticle {
        nodes {
          title
          description
          slug
          coverIsFallback
          image {
            childImageSharp {
              gatsbyImageData(
                width: 1050
                height: 600
                layout: CONSTRAINED
                placeholder: BLURRED
                formats: [AUTO, WEBP, AVIF]
                transformOptions: { fit: COVER, cropFocus: CENTER }
              )
            }
          }
          blocks {
            kind
            html
            vizId
            caption
            height
            align
          }
          authorName
          publishedAt
        }
      }
    }
  `);

  allGatsbyArticle?.data?.allGatsbyArticle?.nodes?.forEach(article => {
    createPage({
      path: `/articles/${article?.slug}`,
      component: articleTemplate,
      context: article
    });
  });

  const allGatsbyWalkAudit = await graphql<{ allGatsbyWalkAudit: { nodes: StrapiWalkAudit[] } }>(`
    query AllGatsbyWalkAudit {
      allGatsbyWalkAudit {
        nodes {
          title
          slug
          date
          status
          description
          mapUrl
          segments {
            name
          }
          summary
        }
      }
    }
  `);

  allGatsbyWalkAudit?.data?.allGatsbyWalkAudit?.nodes
    ?.filter(audit => audit.status === "completed")
    .forEach(audit => {
      createPage({
        path: `/articles/${audit.slug}`,
        component: walkAuditTemplate,
        context: audit,
      });
    });
};

export const createSchemaCustomization: GatsbyNode[`createSchemaCustomization`] = ({ actions: { createTypes } }) =>
  createTypes(`
    type GatsbyArticleBlock {
      kind: String!
      html: String
      vizId: String
      caption: String
      height: Int
      align: String
    }
    type GatsbyArticle implements Node {
      image: File @link(by: "id")
      coverIsFallback: Boolean
      title: String!
      description: String
      slug: String
      blocks: [GatsbyArticleBlock!]!
      authorName: String
      publishedAt: Date @dateformat
    }
    type GatsbyVisualization implements Node {
      vizId: String!
      type: String!
      title: String
      source: String
      featuresFile: File @link(by: "name", from: "features")
      featuresTilesFile: File @link(by: "name", from: "featuresTiles")
      posterFile: File @link(by: "name", from: "posterFrame")
      posterFileMobile: File @link(by: "name", from: "posterFrameMobile")
      basemap: String
      tilesLayer: String
      camera: GatsbyVizCamera
      color: GatsbyVizColor
      elevation: GatsbyVizElevation
      fallback2d: GatsbyVizFallback2d
    }
    type GatsbyVizCamera {
      center: [Float!]!
      zoom: Float
      pitch: Float
      bearing: Float
    }
    type GatsbyVizColor {
      field: String!
      domain: [Float!]!
      range: [String!]!
    }
    type GatsbyVizElevation {
      field: String!
      divisor: Float
    }
    type GatsbyVizFallback2d {
      maxViewportWidth: Int
    }
    type GatsbyEvent implements Node {
      image: File @link(by: "id")
      title: String!
      description: String
      url: String!
      location: String
      startDate: Date! @dateformat
      startDateDisplay: String!
      endDate: Date @dateformat
    }
    type GatsbySiteSetting implements Node {
      instagramUrl: String
      meetupUrl: String
    }
    type GatsbyWalkAuditSegment {
      name: String!
    }
    type GatsbyWalkAudit implements Node {
      title: String!
      slug: String!
      date: Date! @dateformat
      status: String!
      description: String
      mapUrl: String
      segments: [GatsbyWalkAuditSegment!]!
      routeSegments: JSON
      summary: String
    }
  `);
