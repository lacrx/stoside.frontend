import { graphql, useStaticQuery, Link } from "gatsby";
import Layout from "@/components/Layout/layout";
import Hero from "@/components/Hero/hero";
import Content from "@/components/Content/content";
import { auditCard, auditCardHeader, auditCardTitle, auditCardDate, auditCardDesc, activeBadge } from "@/components/WalkAudit/walk-audit.module.css";

type WalkAudit = {
  title: string;
  slug: string;
  date: string;
  status: string;
  description: string | null;
};

interface WalkAuditsQuery {
  allGatsbyWalkAudit: {
    nodes: WalkAudit[];
  };
}

const query = graphql`
  query AllWalkAudits {
    allGatsbyWalkAudit(sort: { date: DESC }) {
      nodes {
        title
        slug
        date(formatString: "MMMM D, YYYY")
        status
        description
      }
    }
  }
`;

export default function WalkAudits() {
  const { allGatsbyWalkAudit: { nodes } } = useStaticQuery<WalkAuditsQuery>(query);

  return (
    <Layout>
      <Hero title="Walk Audits" description="Field notes from the pier to the neighborhoods." style={{ paddingBottom: "1.5rem" }} />
      <Content type="section">
        {nodes.length === 0 ? (
          <p>No walk audits yet.</p>
        ) : (
          nodes.map(({ title, slug, date, status, description }) => (
            <div key={slug} className={auditCard}>
              <div className={auditCardHeader}>
                <div>
                  <Link to={`/walk-audits/${slug}`} className={auditCardTitle}>
                    {title}
                  </Link>
                  {status === "active" && <span className={activeBadge}>Active</span>}
                </div>
                <span className={auditCardDate}>{date}</span>
              </div>
              {description && <p className={auditCardDesc}>{description}</p>}
            </div>
          ))
        )}
      </Content>
    </Layout>
  );
}

export { Head } from "@/components/Head/head";
