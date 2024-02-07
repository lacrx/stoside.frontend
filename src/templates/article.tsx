import { GatsbyImage, getImage, IGatsbyImageData } from "gatsby-plugin-image";
import { Head as _Head } from "@/components/Head/head";
import Layout from "@/components/Layout/layout";
import Hero from "@/components/Hero/hero";
import Content from "@/components/Content/content";

type GatsbyArticle = {
  title: string
  description: string
  slug: string
  image: IGatsbyImageData
  content: string
  publishedAt: Date
};
interface ArticlePageProps extends PageProps {
  pageContext: GatsbyArticle
}

const contentProps = {
  type: "section"
}

export default function Article({ pageContext: { title, description, image, content }}: ArticlePageProps) {
  const heroProps = {
    title,
    description,
    style: { paddingBottom: 0 },
    showBuddy: true
  }

  const img = getImage(image);

  return (
    <Layout>
      <Hero { ...heroProps } />
      <Content { ...contentProps } >
        <GatsbyImage image={img} alt={title} />
        <slot dangerouslySetInnerHTML={{ __html: content }} />
      </Content>
    </Layout>
  );
}

export const Head = ({ pageContext: { title } }: ArticlePageProps) => _Head({ subheading: title, location: { pathname: "article" }})
