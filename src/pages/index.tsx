import { graphql, useStaticQuery } from "gatsby";
import { IGatsbyImageData } from "gatsby-plugin-image";
import Layout from "@/components/Layout/layout"
import Hero from "@/components/Hero/hero";
import Content from "@/components/Content/content";
import Card from "@/components/Card/card";
import learn from "@/images/learn.png";

type ComponentSharedRichText = {
  body: string
};
type GatsbyArticle = {
  title: string
  description: string
  slug: string
  image: IGatsbyImageData | string
  blocks: [ComponentSharedRichText]
  publishedAt: Date
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
  type: "table"
};

export default function Home() {
  const { allGatsbyArticle: { nodes } } = useStaticQuery<GatsbyArticles>(query);
  const { title, description, slug, image } = nodes[0];

  const articleProps = {
    link: `/articles/${slug}`,
    title: title,
    description: description,
    image: image
  };

  const learnProps = {
    link: "/learn",
    title: "We're dedicated to data.",
    description: "Dowtown is subsidizing our suburbs. We've made a Google Map to show exactly how.",
    image: learn
  }

  return (
    <Layout>
      <Hero { ...heroProps } />
      <Content { ...contentProps } >
        <tbody>
          <Card { ...articleProps } />
          <Card { ...learnProps } />
        </tbody>
      </Content>
    </Layout>
  )
};

export { Head } from "@/components/Head/head";
