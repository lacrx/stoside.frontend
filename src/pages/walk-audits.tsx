import { graphql, useStaticQuery, Link } from "gatsby";
import Layout from "@/components/Layout/layout";
import Hero from "@/components/Hero/hero";
import Content from "@/components/Content/content";
import { auditCard, auditCardHeader, auditCardTitle, auditCardDate, auditCardDesc } from "@/components/WalkAudit/walk-audit.module.css";

type WalkAudit = {
  title: string;
  slug: string;
  date: string;
  description: string | null;
  segments: Array<{ name: string }>;
};

interface WalkAuditsQuery {
  allGatsbyWalkAudit: {
    nodes: WalkAudit[];
  };
}

const query = graphql`
  query CompletedWalkAudits {
    allGatsbyWalkAudit(filter: { status: { eq: "completed" } }, sort: { date: DESC }) {
      nodes {
        title
        slug
        date(formatString: "MMMM D, YYYY")
        description
        segments {
          name
        }
      }
    }
  }
`;

export default function WalkAudits() {
  const { allGatsbyWalkAudit: { nodes } } = useStaticQuery<WalkAuditsQuery>(query);

  return (
    <Layout>
      <Hero title="Previous Walk Audits" style={{ paddingBottom: "1.5rem" }} />
      <Content type="section">
        {nodes.length === 0 ? (
          <p>No completed walk audits yet. <Link to="/walk">Join the current audit</Link>.</p>
        ) : (
          nodes.map(({ title, slug, date, description, segments }) => (
            <div key={slug} className={auditCard}>
              <div className={auditCardHeader}>
                <Link to={`/walk-audits/${slug}`} className={auditCardTitle}>
                  {title}
                </Link>
                <span className={auditCardDate}>{date}</span>
              </div>
              {description && <p className={auditCardDesc}>{description}</p>}
              {segments.length > 0 && (
                <p className={auditCardDesc}>{segments.length} segment{segments.length === 1 ? "" : "s"}</p>
              )}
            </div>
          ))
        )}
      </Content>
    </Layout>
  );
}

export { Head } from "@/components/Head/head";
