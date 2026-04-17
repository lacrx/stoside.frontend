import { graphql, useStaticQuery } from "gatsby";
import Layout from '@/components/Layout/layout';
import Hero from '@/components/Hero/hero';
import Content from "@/components/Content/content";
import EventList from "@/components/EventList/eventList";

type GatsbyEvent = {
  id: string
  title: string
  description: string
  url: string
  location: string
  startDate: string
};
interface GatsbyEvents {
  allGatsbyEvent: {
    nodes: GatsbyEvent[]
  }
}

const query = graphql`
  query UpcomingEvents {
    allGatsbyEvent(sort: { startDate: ASC }, limit: 5) {
      nodes {
        id
        title
        description
        url
        location
        startDate(formatString: "dddd, MMMM D [at] h:mm A")
        image {
          childImageSharp {
            gatsbyImageData(
              width: 150
              height: 150
              placeholder: BLURRED
              transformOptions: { fit: COVER }
            )
          }
        }
      }
    }
  }
`;

const heroProps = {
  title: "Upcoming events.",
  description: "Meet your neighbors. Build the city we want to see.",
};

const contentProps = {
  type: "section",
};

export default function Events() {
  const { allGatsbyEvent: { nodes } } = useStaticQuery<GatsbyEvents>(query);

  return (
    <Layout>
      <Hero { ...heroProps } />
      <Content { ...contentProps } >
        <EventList events={ nodes } />
      </Content>
    </Layout>
  );
};

export { Head } from "@/components/Head/head";
