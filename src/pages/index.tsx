import { graphql, useStaticQuery } from "gatsby";
import type { GatsbyArticle, GatsbyEvent } from "@/types";
import Layout from "@/components/Layout/layout";
import Hero from "@/components/Hero/hero";
import Content from "@/components/Content/content";
import Card from "@/components/Card/card";
import { EventCard } from "@/components/EventList/eventList";

interface HomePageData {
  allGatsbyArticle: { nodes: GatsbyArticle[] };
  allGatsbyEvent: { nodes: GatsbyEvent[] };
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
        startDate
        startDateDisplay
        image {
          childImageSharp {
            gatsbyImageData(
              width: 150
              height: 150
              placeholder: BLURRED
              formats: [AUTO, WEBP, AVIF]
              transformOptions: { fit: COVER, cropFocus: CENTER }
            )
          }
        }
      }
    }
  }
`;

export default function Home() {
  const { allGatsbyArticle, allGatsbyEvent } = useStaticQuery<HomePageData>(query);
  const article = allGatsbyArticle.nodes[0];
  const event = allGatsbyEvent.nodes[0];

  return (
    <Layout>
      <Hero
        title="Building resilience, one step at a time"
        description="We're a scrappy group of Oceansiders doing the next-smallest thing today to make Oceanside better."
        cta="Be our neighbor"
        showBuddy={true}
      />
      <Content type="section">
        <h2>Newest Article</h2>
        {article && (
          <Card
            link={`/articles/${article.slug}`}
            title={article.title}
            description={article.description}
            image={article.image}
            authorName={article.authorName}
            publishedAt={article.publishedAt}
          />
        )}
        {event && (
          <>
            <h2>Next Event</h2>
            <EventCard e={event} />
          </>
        )}
      </Content>
    </Layout>
  );
}

export { Head } from "@/components/Head/head";
