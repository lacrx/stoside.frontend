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
    articles(sort: "publishedAt:desc") {
      data {
        id
        attributes {
          title
          description
          slug
          cover {
            data {
              attributes {
                url
              }
            }
          }
          blocks {
            ...on ComponentSharedRichText {
              body
            }
          }
          publishedAt
        }
      }
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
type UploadFileEntity = {
  attributes: UploadFile
};
type UploadFileEntityResponse = {
  data: UploadFileEntity
};
type Article = {
  title: string
  description: string
  slug: string
  cover: UploadFileEntityResponse
  blocks: [ComponentSharedRichText]
  publishedAt: Date
};
type ArticleEntity = {
  id: Number
  attributes: Article
};
type ArticleEntityResponseCollection = {
  data: [ArticleEntity]
};
interface ArticleResponse {
  articles: ArticleEntityResponseCollection
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
  const strapiGraphqlClient = new GraphQLClient("http://localhost:1337/graphql");
  const articleResult = await strapiGraphqlClient.request<ArticleResponse>(getAllStrapiArticles);
  const { articles: { data } } = articleResult;

  const images = await Promise.all(data.map( async ({ attributes }) => {
    return (await createRemoteFileNode({
      url: `http://localhost:1337${attributes?.cover?.data?.attributes?.url}`,
      createNode,
      createNodeId,
      getCache,
    })).id;
  }));
  data.forEach( async ({ attributes: { title, description, slug, blocks, publishedAt }}, i) => {
    const content = sanitize(
      blocks
        .filter(block => Object.hasOwn(block, 'body'))
        .map(({ body }) => marked.parse(body))
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
    }
  `);
