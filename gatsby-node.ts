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

export const sourceNodes: GatsbyNode["sourceNodes"] = async ({
  actions: { createNode },
  createContentDigest,
  createNodeId,
  getCache
}) => {
  const strapiUrl = process.env.STRAPI_URL || "http://localhost:1337";
  const strapiGraphqlClient = new GraphQLClient(`${strapiUrl}/graphql`);
  const articleResult = await strapiGraphqlClient.request<ArticleResponse>(getAllStrapiArticles);
  const { articles } = articleResult;

  const images = await Promise.all(articles.map( async (article) => {
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

  // TODO - add meetup integration
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
    // TODO - add meetup integration
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
  `);
