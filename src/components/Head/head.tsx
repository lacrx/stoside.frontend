import { graphql, useStaticQuery } from "gatsby"
import { ReactNode } from "react";

export const siteTitleQuery = graphql`
  query SiteTitleQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`;

type HeadProps = {
  subheading?: string;
  bodyClass?: string;
  location?: { pathname: string };
  children?: ReactNode;
};

export function Head({ subheading, bodyClass, location, children }: HeadProps) {
  const { site: { siteMetadata: { title }}} = useStaticQuery(siteTitleQuery)
  const text = (subheading ? subheading + " | " : "") + title;
  const cls = bodyClass ?? (location?.pathname === "/" ? "home" : location?.pathname.replaceAll("/", ""));
  return (
    <>
      <title>{text}</title>
      <meta name="description" content={text} />
      <link id="icon" rel="icon" href="" />
      {cls && <body className={cls} />}
      {children}
    </>
  );
}
