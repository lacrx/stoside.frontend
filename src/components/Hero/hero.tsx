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
    nodes: Array<{
      instagramUrl: string | null
      meetupUrl: string | null
    }>
  }
};

const DEFAULT_INSTAGRAM_URL = "https://www.instagram.com/strongtowns.oceanside/";
const DEFAULT_MEETUP_URL = "https://www.meetup.com/north-county-urbanists/";

const siteSettingQuery = graphql`
  query HeroSiteSetting {
    allGatsbySiteSetting {
      nodes {
        instagramUrl
        meetupUrl
      }
    }
  }
`;

const h3 = (text: string) => <h4>{ text }</h4>;

const buddyStyle = { position: "absolute" as const, bottom: "-6px", right: "-5px" };

export default function Hero({ title, cta, description, style = { paddingBottom: "5rem" }, showBuddy = false }: HeroProps) {
  const { allGatsbySiteSetting } = useStaticQuery<SiteSettingQuery>(siteSettingQuery);
  const settings = allGatsbySiteSetting.nodes[0];
  const instagramUrl = settings?.instagramUrl || DEFAULT_INSTAGRAM_URL;
  const meetupUrl = settings?.meetupUrl || DEFAULT_MEETUP_URL;

  return (
    <header className={ hero } style={ style }>
      <h1>{ title }</h1>
      { description && h3(description) }
      { cta && (
        <Link to={ meetupUrl }>
          <h2>{ cta }</h2>
        </Link>
      ) }
      { showBuddy && <Link to={ instagramUrl } style={ buddyStyle } ><img src={pelican} width="60" alt="Strong Towns Oceanside Instagram" /></Link> }
    </header>
  )
}
