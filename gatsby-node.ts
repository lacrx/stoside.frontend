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
      blocks {
        ...on ComponentSharedRichText {
          body
        }
      }
      publishedAt
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

type ComponentSharedRichText = {
  body: string
};
type UploadFile = {
  url: string
};
type Article = {
  documentId: string
  title: string
  description: string
  slug: string
  cover: UploadFile
  blocks: [ComponentSharedRichText]
  publishedAt: Date
};
interface ArticleResponse {
  articles: Article[]
};
type GatsbyArticle = {
  title: string
  description: string
  slug: string
  image: string
  content: string
  publishedAt: Date
};
interface GatsbyArticles {
  allGatsbyArticle: {
    nodes: [GatsbyArticle]
  }
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

  const images = articles.length === 0 ? [] : await Promise.all(articles.map( async (article) => {
    const coverUrl = article?.cover?.url?.startsWith('http')
      ? article.cover.url
      : `${strapiUrl}${article?.cover?.url}`;
    return (await createRemoteFileNode({
      url: coverUrl,
      createNode,
      createNodeId,
      getCache,
    })).id;
  }));
  articles.forEach( async ({ title, description, slug, blocks, publishedAt }, i) => {
    const content = sanitize(
      blocks
        .filter(block => Object.hasOwn(block, 'body'))
        .map(({ body }) => marked.parse(body) as string)
        .join()
    );

    const gatsbyArticle: GatsbyArticle = {
      title,
      description,
      slug,
      image: images[i],
      content,
      publishedAt
    };

    sanitize("<div>test</div>")

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
              )
            }
          }
          content
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
    type GatsbyArticle implements Node {
      image: File @link(by: "id")
      title: String!
      description: String
      slug: String
      content: String
      publishedAt: Date @dateformat
    }
    type GatsbyEvent implements Node {
      image: File @link(by: "id")
      title: String!
      description: String
      url: String!
      location: String
      startDate: Date! @dateformat
      endDate: Date @dateformat
    }
  `);
