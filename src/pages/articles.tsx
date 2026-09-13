import { graphql, useStaticQuery } from "gatsby";
import type { GatsbyArticle, GatsbyWalkAudit } from "@/types";
import Layout from "@/components/Layout/layout";
import Hero from "@/components/Hero/hero";
import Content from "@/components/Content/content";
import Card from "@/components/Card/card";

type ListItem = {
  slug: string;
  title: string;
  description: string;
  image: GatsbyArticle["image"];
  authorName: string | null;
  publishedAt: string | null;
};

interface ArticlesQuery {
  allGatsbyArticle: { nodes: GatsbyArticle[] };
  allGatsbyWalkAudit: { nodes: GatsbyWalkAudit[] };
}

const query = graphql`
  query AllGatsbyArticle {
    allGatsbyArticle(sort: { publishedAt: DESC }) {
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
    }
    allGatsbyWalkAudit(
      filter: { status: { eq: "completed" } }
      sort: { date: DESC }
    ) {
      nodes {
        title
        slug
        date
        description
      }
    }
  }
`;

export default function Articles() {
  const { allGatsbyArticle, allGatsbyWalkAudit } = useStaticQuery<ArticlesQuery>(query);

  const items: ListItem[] = [
    ...allGatsbyArticle.nodes.map(a => ({
      slug: a.slug,
      title: a.title,
      description: a.description,
      image: a.image,
      authorName: a.authorName,
      publishedAt: a.publishedAt,
    })),
    ...allGatsbyWalkAudit.nodes.map(w => ({
      slug: w.slug,
      title: `Walk Audit: ${w.title}`,
      description: w.description || "Community walk audit results",
      image: null,
      authorName: null,
      publishedAt: w.date,
    })),
  ].sort((a, b) => {
    const da = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    const db = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    return db - da;
  });

  return (
    <Layout>
      <Hero title="We've put pen to paper" />
      <Content type="section" ruled>
        {items.map(({ slug, title, description, image, authorName, publishedAt }) => (
          <Card
            key={slug}
            link={`/articles/${slug}`}
            title={title}
            description={description}
            image={image}
            authorName={authorName}
            publishedAt={publishedAt}
          />
        ))}
      </Content>
    </Layout>
  );
}

export { Head } from "@/components/Head/head";
