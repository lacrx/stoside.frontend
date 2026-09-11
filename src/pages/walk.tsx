import { graphql, useStaticQuery } from "gatsby";
import Layout from "@/components/Layout/layout";
import Hero from "@/components/Hero/hero";
import Content from "@/components/Content/content";
import WalkAuditForm from "@/components/WalkAudit/walk-audit-form";

type WalkAudit = {
  title: string;
  slug: string;
  date: string;
  status: string;
  description: string | null;
  mapUrl: string | null;
  segments: Array<{ name: string }>;
};

interface WalkAuditQuery {
  allGatsbyWalkAudit: {
    nodes: WalkAudit[];
  };
}

const query = graphql`
  query ActiveWalkAudit {
    allGatsbyWalkAudit(filter: { status: { eq: "active" } }, sort: { date: DESC }) {
      nodes {
        title
        slug
        date(formatString: "MMMM D, YYYY")
        status
        description
        mapUrl
        segments {
          name
        }
      }
    }
  }
`;

export default function Walk() {
  const { allGatsbyWalkAudit: { nodes } } = useStaticQuery<WalkAuditQuery>(query);
  const audit = nodes[0];

  if (!audit) {
    return (
      <Layout>
        <Hero title="Walk Audit" />
        <Content type="section">
          <p>No active walk audit right now. Check back soon.</p>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout>
      <Hero title="Walk Audit" />
      <Content type="section">
        <WalkAuditForm
          auditSlug={audit.slug}
          title={audit.title}
          date={audit.date}
          description={audit.description}
          segments={audit.segments}
          mapUrl={audit.mapUrl}
        />
      </Content>
    </Layout>
  );
}

export { Head } from "@/components/Head/head";
