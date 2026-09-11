import { type PageProps } from "gatsby";
import { Head as _Head } from "@/components/Head/head";
import Layout from "@/components/Layout/layout";
import Hero from "@/components/Hero/hero";
import Content from "@/components/Content/content";
import WalkAuditForm from "@/components/WalkAudit/walk-audit-form";
import { results, statGrid, stat, statNumber, statLabel } from "@/components/WalkAudit/walk-audit.module.css";

type Segment = { name: string };

type WalkAuditContext = {
  title: string;
  slug: string;
  date: string;
  status: "active" | "completed";
  description: string | null;
  mapUrl: string | null;
  segments: Segment[];
  summary: string | null;
  supabaseUrl: string;
  supabaseKey: string;
};

interface WalkAuditPageProps extends PageProps {
  pageContext: WalkAuditContext;
}

function formatDate(iso: string): string {
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function CompletedView({ summary }: { summary: string | null }) {
  return (
    <div className={results}>
      {summary ? (
        <div dangerouslySetInnerHTML={{ __html: summary }} />
      ) : (
        <p>Summary coming soon.</p>
      )}
    </div>
  );
}

export default function WalkAudit({ pageContext }: WalkAuditPageProps) {
  const { title, slug, date, status, description, mapUrl, segments, summary, supabaseUrl, supabaseKey } = pageContext;

  const heroProps = {
    title: `Walk Audit: ${title}`,
    description: `${formatDate(date)}${description ? ` · ${description}` : ""}`,
    style: { paddingBottom: "1.5rem" },
  };

  return (
    <Layout>
      <Hero {...heroProps} />
      <Content type="section">
        {status === "active" ? (
          <WalkAuditForm
            auditSlug={slug}
            segments={segments}
            mapUrl={mapUrl}
            supabaseUrl={supabaseUrl}
            supabaseKey={supabaseKey}
          />
        ) : (
          <CompletedView summary={summary} />
        )}
      </Content>
    </Layout>
  );
}

export const Head = ({ pageContext: { title } }: WalkAuditPageProps) =>
  _Head({ subheading: `Walk Audit: ${title}` });
