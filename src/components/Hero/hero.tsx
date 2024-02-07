import { Link } from "gatsby";
import { hero } from './hero.module.css';
import pelican from "@/images/pelican.svg";

type HeroProps = {
  title: string;
  cta?: string;
  description?: string;
  style?: object
  showBuddy?: boolean
};

const link = (text: string) =>
  <Link to="https://www.meetup.com/oceanside-strong-towns/">
    <h2>{ text }</h2>
  </Link>;
const h3 = (text: string) => <h4>{ text }</h4>;

const buddyStyle = { position: "absolute", bottom: "-6px", right: "-5px", };

export default function Hero({ title, cta, description, style = { paddingBottom: "5rem" }, showBuddy = false }: HeroProps) {
  return (
    <header className={ hero } style={ style }>
      <h1>{ title }</h1>
      { description && h3(description) }
      { cta && link(cta) }
      { showBuddy && <Link to="https://www.instagram.com/oceansidecleanup/?ref=post" style={ buddyStyle } ><img src={pelican} width="60" alt="Oceanside Cleanup Instagram" /></Link> }
    </header>
  )
}
