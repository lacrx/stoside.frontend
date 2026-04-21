import { graphql, useStaticQuery } from "gatsby";
import { IGatsbyImageData } from "gatsby-plugin-image";
import Layout from "@/components/Layout/layout";
import Hero from "@/components/Hero/hero";
import Content from "@/components/Content/content";
import Card from "@/components/Card/card";
import articleCoverFallback from "@/images/oceanside-wealth-poster-desktop.jpg";

type GatsbyArticle = {
  title: string
  description: string
  slug: string
  image: IGatsbyImageData | null
  authorName: string | null
  publishedAt: string | null
};
interface GatsbyArticles {
  allGatsbyArticle: {
    nodes: GatsbyArticle[]
  }
}

const query = graphql`
  query AllGatsbyArticle {
    allGatsbyArticle(sort: { publishedAt: DESC }) {
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
    }
  }
`;

const heroProps = {
  title: "We've put pen to paper.",
};

const contentProps = {
  type: "section"
};

export default function Articles() {
  const { allGatsbyArticle: { nodes } } = useStaticQuery<GatsbyArticles>(query);
  return (
    <Layout>
      <Hero { ...heroProps } />
      <Content { ...contentProps } >
        {nodes.map(({ slug, title, description, image, authorName, publishedAt }, i) => (
          <Card
            key={i}
            link={`/articles/${slug}`}
            title={title}
            description={description}
            image={image ?? articleCoverFallback}
            fallbackImage={articleCoverFallback}
            authorName={authorName}
            publishedAt={publishedAt}
          />
        ))}
      </Content>
    </Layout>
  );
};

export { Head } from "@/components/Head/head";
