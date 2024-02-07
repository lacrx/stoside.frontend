import { graphql, useStaticQuery } from "gatsby";
import { IGatsbyImageData } from "gatsby-plugin-image";
import Layout from "@/components/Layout/layout";
import Hero from "@/components/Hero/hero";
import Content from "@/components/Content/content";
import Card from "@/components/Card/card";

type ComponentSharedRichText = {
  body: string
};
type GatsbyArticle = {
  title: string
  description: string
  slug: string
  image: IGatsbyImageData
  blocks: ComponentSharedRichText
  publishedAt: Date
};
interface GatsbyArticles {
  allGatsbyArticle: {
    nodes: [GatsbyArticle]
  }
}

const query = graphql`
  query AllGatsbyArticle {
    allGatsbyArticle {
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
      }
      max(field: {publishedAt: SELECT})
    }
  }
`;

const heroProps = {
  title: "We've put pen to paper.",
  showBuddy: true
};

const contentProps = {
  type: "table"
};

export default function Articles() {
  const { allGatsbyArticle: { nodes } } = useStaticQuery<GatsbyArticles>(query);
  return (
    <Layout>
      <Hero { ...heroProps } />
      <Content { ...contentProps } >
        <tbody>
          {nodes.map(({ slug, title, description, image }, i) => {
            const cardProps = {
              link: slug,
              title,
              description,
              image
            };
            return <Card key={i} {...cardProps} />;
          })}
        </tbody>
      </Content>
    </Layout>
  );
};

export { Head } from "@/components/Head/head";
