import { graphql, Link, useStaticQuery } from "gatsby";
import { hero } from './hero.module.css';
import pelican from "@/images/pelican.svg";

type HeroProps = {
  title: string;
  cta?: string;
  description?: string;
  style?: object
  showBuddy?: boolean
};

type SiteSettingQuery = {
  allGatsbySiteSetting: {
    nodes: Array<{ instagramUrl: string | null }>
  }
};

const DEFAULT_INSTAGRAM_URL = "https://www.instagram.com/strongtowns.oceanside/";

const siteSettingQuery = graphql`
  query HeroSiteSetting {
    allGatsbySiteSetting {
      nodes {
        instagramUrl
      }
    }
  }
`;

const link = (text: string) =>
  <Link to="https://www.meetup.com/oceanside-strong-towns/">
    <h2>{ text }</h2>
  </Link>;
const h3 = (text: string) => <h4>{ text }</h4>;

const buddyStyle = { position: "absolute" as const, bottom: "-6px", right: "-5px" };

export default function Hero({ title, cta, description, style = { paddingBottom: "5rem" }, showBuddy = false }: HeroProps) {
  const { allGatsbySiteSetting } = useStaticQuery<SiteSettingQuery>(siteSettingQuery);
  const instagramUrl = allGatsbySiteSetting.nodes[0]?.instagramUrl || DEFAULT_INSTAGRAM_URL;

  return (
    <header className={ hero } style={ style }>
      <h1>{ title }</h1>
      { description && h3(description) }
      { cta && link(cta) }
      { showBuddy && <Link to={ instagramUrl } style={ buddyStyle } ><img src={pelican} width="60" alt="Strong Towns Oceanside Instagram" /></Link> }
    </header>
  )
}
