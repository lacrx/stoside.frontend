import { Link } from "gatsby"
import { GatsbyImage, getImage, IGatsbyImageData } from "gatsby-plugin-image";
import Byline from "@/components/Byline/byline";
import { card } from "./card.module.css";

type CardProps = {
  link: string
  title: string
  description: string
  image: IGatsbyImageData | string
  fallbackImage?: string
  authorName?: string | null
  publishedAt?: string | Date | null
}

export default function Card({link, title, description, image, fallbackImage, authorName, publishedAt}: CardProps) {
  const img = typeof image === "string" ? <img src={image} width="150" alt={title} /> : <GatsbyImage image={getImage(image)!} alt={title} />;
  const slotStyle = fallbackImage
    ? {
        backgroundImage: `url(${fallbackImage})`,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }
    : undefined;
  return (
    <article className={ card }>
      <div>
        <div>
          <Link to={ link }>
            <h2>{ title }</h2>
          </Link>
        </div>
        <div>
          <Link to={ link }>
            <h4>{ description }</h4>
          </Link>
        </div>
        <Byline author={authorName} publishedAt={publishedAt} compact />
      </div>
      <div>
        <Link to={ link } style={ slotStyle }>
          { img }
        </Link>
      </div>
    </article>
  );
};
