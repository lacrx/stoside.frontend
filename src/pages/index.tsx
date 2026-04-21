import { graphql, useStaticQuery } from "gatsby";
import { IGatsbyImageData } from "gatsby-plugin-image";
import Layout from "@/components/Layout/layout"
import Hero from "@/components/Hero/hero";
import Content from "@/components/Content/content";
import Card from "@/components/Card/card";
import articleCoverFallback from "@/images/oceanside-wealth-poster-desktop.jpg";

type ComponentSharedRichText = {
  body: string
};
type GatsbyArticle = {
  title: string
  description: string
  slug: string
  image: IGatsbyImageData | string
  blocks: [ComponentSharedRichText]
  authorName: string | null
  publishedAt: string | null
};
interface GatsbyArticles {
  allGatsbyArticle: {
    nodes: [GatsbyArticle]
  }
}

const query = graphql`
  query FirstGatsbyArticle {
    allGatsbyArticle(limit: 1) {
      nodes {
        title
        description
        slug
        image {
          childImageSharp {
            gatsbyImageData(
              width: 100
              height: 100
              placeholder: BLURRED
            )
          }
        }
        authorName
        publishedAt
      }
      max(field: {publishedAt: SELECT})
    }
  }
`;

const heroProps = {
  title: "Building resilience. One step at a time.",
  description: "We're a scrappy group of Oceansiders doing the next-smallest thing today to make Oceanside better. Do you want to build an Oceanside future generations will be proud to live in?",
  cta: "Be our neighbor.",
  showBuddy: true
};

const contentProps = {
  type: "section"
};

export default function Home() {
  const { allGatsbyArticle: { nodes } } = useStaticQuery<GatsbyArticles>(query);
  const article = nodes[0];

  const articleProps = article ? {
    link: `/articles/${article.slug}`,
    title: article.title,
    description: article.description,
    image: article.image ?? articleCoverFallback,
    fallbackImage: articleCoverFallback,
    authorName: article.authorName,
    publishedAt: article.publishedAt
  } : null;

  return (
    <Layout>
      <Hero { ...heroProps } />
      <Content { ...contentProps } >
        {articleProps && <Card { ...articleProps } />}
      </Content>
    </Layout>
  )
};

export { Head } from "@/components/Head/head";
