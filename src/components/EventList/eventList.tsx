import { GatsbyImage, getImage, IGatsbyImageData } from "gatsby-plugin-image";
import { eventList, event, location as locationCls } from "./eventList.module.css";

type EventItem = {
  id: string
  title: string
  description: string
  url: string
  location: string
  startDate: string
  image: { childImageSharp: { gatsbyImageData: IGatsbyImageData } } | null
};

type EventListProps = {
  events: EventItem[]
};

export default function EventList({ events }: EventListProps) {
  if (events.length === 0) {
    return <p>No upcoming events. Check back soon.</p>;
  }

  return (
    <ul className={ eventList }>
      {events.map(e => {
        const img = e.image?.childImageSharp ? getImage(e.image.childImageSharp.gatsbyImageData) : null;
        return (
          <li key={ e.id } className={ event }>
            <div>
              <div>
                <a href={ e.url } target="_blank" rel="noopener noreferrer">
                  <h2>{ e.title }</h2>
                </a>
              </div>
              <div>
                <p>{ e.startDate }{e.location && <span className={locationCls}>{e.location}</span>}</p>
              </div>
            </div>
            {img && (
              <div>
                <a href={ e.url } target="_blank" rel="noopener noreferrer">
                  <GatsbyImage image={ img } alt={ e.title } />
                </a>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
};
