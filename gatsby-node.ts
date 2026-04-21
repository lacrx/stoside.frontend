import fs from "fs";
import path from "path";
import { marked } from "marked";
import { sanitize } from "isomorphic-dompurify";
import { type GatsbyNode, useStaticQuery } from "gatsby";
import { createRemoteFileNode } from "gatsby-source-filesystem";
import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";
import { GraphQLClient } from "graphql-request";


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
      author {
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
  author: { name: string } | null
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

function formatEventDate(iso: string): string {
  const d = new Date(iso);
  const dateStr = new Intl.DateTimeFormat("en-US", {
    timeZone: EVENT_TIMEZONE,
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(d);
  const timeStr = new Intl.DateTimeFormat("en-US", {
    timeZone: EVENT_TIMEZONE,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(d);
  return `${dateStr} at ${timeStr}`;
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
  getCache
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

  const images = articles.length === 0 ? [] : await Promise.all(articles.map( async (article) => {
    if (!article?.cover?.url) return undefined;
    const coverUrl = article.cover.url.startsWith('http')
      ? article.cover.url
      : `${strapiUrl}${article.cover.url}`;
    return (await createRemoteFileNode({
      url: coverUrl,
      createNode,
      createNodeId,
      getCache,
    })).id;
  }));
  articles.forEach(({ title, description, slug, blocks, author, publishedAt }, i) => {
    const structuredBlocks: ArticleBlock[] = blocks.map(block => {
      if (block.__typename === "ComponentSharedRichText") {
        return {
          kind: "rich-text",
          html: sanitize(marked.parse(block.body) as string)
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
      image: images[i],
      authorName: author?.name ?? null,
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
export const createPages: GatsbyNode["createPages"] = async ({ actions: { createPage }, graphql }) => {
  const allGatsbyArticle = await graphql<GatsbyArticles>(`
    query AllGatsbyArticle {
      allGatsbyArticle {
        nodes {
          title
          description
          slug
          image {
            childImageSharp {
              gatsbyImageData(
                width: 700
                placeholder: BLURRED
                formats: [AUTO, WEBP, AVIF]
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
  `);
