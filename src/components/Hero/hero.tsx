import { CSSProperties } from "react";
import { graphql, useStaticQuery } from "gatsby";
import { hero, centered as centeredCls } from './hero.module.css';
import pelican from "@/images/pelican.png";

type HeroProps = {
  title: string;
  cta?: string;
  description?: string;
  showBuddy?: boolean;
  centered?: boolean;
  style?: CSSProperties;
};

type SiteSettingQuery = {
  allGatsbySiteSetting: {
    nodes: Array<{
      instagramUrl: string | null
    }>
  }
};

const DEFAULT_INSTAGRAM_URL = "https://www.instagram.com/strongtowns.oceanside/";
const DISCORD_URL = "https://discord.com/invite/sraXTxwC3P";

const siteSettingQuery = graphql`
  query HeroSiteSetting {
    allGatsbySiteSetting {
      nodes {
        instagramUrl
      }
    }
  }
`;

const subtitle = (text: string) => <p>{ text }</p>;

const buddyStyle = { position: "absolute" as const, bottom: "-6px", right: "-5px", zIndex: 2 };

export default function Hero({ title, cta, description, showBuddy = false, centered = false, style }: HeroProps) {
  const { allGatsbySiteSetting } = useStaticQuery<SiteSettingQuery>(siteSettingQuery);
  const settings = allGatsbySiteSetting.nodes[0];
  const instagramUrl = settings?.instagramUrl || DEFAULT_INSTAGRAM_URL;

  return (
    <header className={`${hero}${centered ? ` ${centeredCls}` : ''}`} style={style}>
      <h1>{ title }</h1>
      { description && subtitle(description) }
      { cta && (
        <a href={ DISCORD_URL } target="_blank" rel="noopener noreferrer">
          <p>{ cta }</p>
        </a>
      ) }
      { showBuddy && <a href={ instagramUrl } target="_blank" rel="noopener noreferrer" style={ buddyStyle } ><img src={pelican} width="60" height="60" alt="Strong Towns Oceanside Instagram" /></a> }
    </header>
  )
}
