import { graphql, useStaticQuery } from "gatsby";
import { IGatsbyImageData } from "gatsby-plugin-image";
import Layout from "@/components/Layout/layout"
import Hero from "@/components/Hero/hero";
import Content from "@/components/Content/content";
import Card from "@/components/Card/card";
import EventList from "@/components/EventList/eventList";
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
type GatsbyEvent = {
  id: string
  title: string
  description: string
  url: string
  location: string
  startDate: string
  image: { childImageSharp: { gatsbyImageData: IGatsbyImageData } } | null
};
interface HomePageData {
  allGatsbyArticle: {
    nodes: [GatsbyArticle]
  }
  allGatsbyEvent: {
    nodes: GatsbyEvent[]
  }
}

const query = graphql`
  query HomePageData {
    allGatsbyArticle(limit: 1) {
      nodes {
        title
        description
        slug
        image {
          childImageSharp {
            gatsbyImageData(
              width: 150
              height: 150
              placeholder: BLURRED
              formats: [AUTO, WEBP, AVIF]
              transformOptions: { fit: COVER, cropFocus: ATTENTION }
            )
          }
        }
        authorName
        publishedAt
      }
      max(field: {publishedAt: SELECT})
    }
    allGatsbyEvent(sort: { startDate: ASC }, limit: 1) {
      nodes {
        id
        title
        description
        url
        location
        startDate: startDateDisplay
        image {
          childImageSharp {
            gatsbyImageData(
              width: 150
              height: 150
              placeholder: BLURRED
              formats: [AUTO, WEBP, AVIF]
              transformOptions: { fit: COVER }
            )
          }
        }
      }
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
  const { allGatsbyArticle, allGatsbyEvent } = useStaticQuery<HomePageData>(query);
  const article = allGatsbyArticle.nodes[0];
  const events = allGatsbyEvent.nodes;

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
      {events.length > 0 && (
        <Content { ...contentProps }>
          <h3>Next Event</h3>
          <EventList events={events} />
        </Content>
      )}
    </Layout>
  )
};

export { Head } from "@/components/Head/head";
