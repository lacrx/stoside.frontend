import { GatsbyImage, getImage, IGatsbyImageData } from "gatsby-plugin-image";
import { type PageProps } from "gatsby";
import { Head as _Head } from "@/components/Head/head";
import Layout from "@/components/Layout/layout";
import Hero from "@/components/Hero/hero";
import Content from "@/components/Content/content";
import ArticleBlocks, { type ArticleBlock } from "@/components/ArticleBlocks/article-blocks";
import { cover } from "@/components/ArticleBlocks/article-blocks.module.css";

type DataPageContext = {
  title: string;
  description: string | null;
  slug: string;
  dashboardType: string;
  image: IGatsbyImageData | null;
  blocks: ArticleBlock[];
  methodologyHtml: string | null;
  dataUpdatedAt: string | null;
};

interface DataPageProps extends PageProps {
  pageContext: DataPageContext;
}

export default function DataPage({ pageContext: { title, description, dashboardType, image, blocks, methodologyHtml, dataUpdatedAt } }: DataPageProps) {
  const img = image ? getImage(image) : null;

  return (
    <Layout>
      <Hero title={title} description={description || undefined} style={{ paddingBottom: 0 }} />
      <Content type="section">
        {img && <GatsbyImage image={img} alt={title} className={cover} />}
        <ArticleBlocks blocks={blocks} />
        <div data-dashboard={dashboardType} style={{ padding: "3rem 0", textAlign: "center", color: "var(--text-muted, #6b7280)" }}>
          Dashboard: {dashboardType} (coming in Phase 2)
        </div>
        {methodologyHtml && (
          <Content type="section" ruled>
            <div dangerouslySetInnerHTML={{ __html: methodologyHtml }} />
          </Content>
        )}
      </Content>
    </Layout>
  );
}

export const Head = ({ pageContext: { title } }: DataPageProps) =>
  _Head({ subheading: title, bodyClass: "article" });
