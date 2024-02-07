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

type SEOProps = {
  subheading?: string
  children: ReactNode
}
type HeadProps = {
  subheading?: string
  location: {
    pathname: string
  }
}

function SEO({ subheading, children }: SEOProps) {
  const { site: { siteMetadata: { title }}} = useStaticQuery(siteTitleQuery)
  const text = (!!subheading ? (subheading + " | ") : "") + title;
  return (
    <>
      <title>{ text }</title>
      <meta name="description" content={ text } />
      <link id="icon" rel="icon" href="" />
      { children }
    </>
  )
}

export const Head = ({ subheading, location }: HeadProps) =>
  <SEO subheading={subheading}>
    <body className={ location?.pathname === "/" ? "home" : location?.pathname.replaceAll("/", "") } />
    <link id="icon" rel="icon" href="" />
  </SEO>
