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
            <a href={ e.url } target="_blank" rel="noopener noreferrer">
              <div>
                <div>
                  <h2>{ e.title }</h2>
                </div>
                <div>
                  <p>{ e.startDate }{e.location && <span className={locationCls}>{e.location}</span>}</p>
                </div>
              </div>
              {img && (
                <div>
                  <GatsbyImage image={ img } alt={ e.title } />
                </div>
              )}
            </a>
          </li>
        );
      })}
    </ul>
  );
};
