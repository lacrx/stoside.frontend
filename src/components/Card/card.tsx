import { Link } from "gatsby"
import { GatsbyImage, getImage, IGatsbyImageData } from "gatsby-plugin-image";
import { card } from "./card.module.css";

type CardProps = {
  link: string
  title: string
  description: string
  image: IGatsbyImageData | string
}

export default function Card({link, title, description, image}: CardProps) {
  const img = typeof image === "string" ? <img src={image} width="100" alt={title} /> : <GatsbyImage image={getImage(image)} alt={title} />;
  return (
    <tr className={ card }>
      <td>
        <Link to={ link }>
          <h2>{ title }</h2>
        </Link>
      </td>
      <td>
        <Link to={ link }>
          <h4>{ description }</h4>
        </Link>
      </td>
      <td>
        <Link to={ link }>
          { img }
        </Link>
      </td>
    </tr>
  );
};
