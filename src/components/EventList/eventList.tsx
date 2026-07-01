import { GatsbyImage, getImage, IGatsbyImageData } from "gatsby-plugin-image";
import { eventList, event, location as locationCls } from "./eventList.module.css";

type EventItem = {
  id: string
  title: string
  description: string
  url: string
  location: string
  startDate: string
  startDateDisplay: string
  image: { childImageSharp: { gatsbyImageData: IGatsbyImageData } } | null
};

type EventListProps = {
  events: EventItem[]
};

const TZ = "America/Los_Angeles";

function formatDisplayDate(iso: string, display: string): string {
  const eventDate = new Date(iso);
  const now = new Date();
  const eventDay = new Intl.DateTimeFormat("en-US", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(eventDate);
  const today = new Intl.DateTimeFormat("en-US", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
  if (eventDay !== today) return display;
  const hour = Number(new Intl.DateTimeFormat("en-US", { timeZone: TZ, hour: "numeric", hour12: false }).format(eventDate));
  const timeStr = new Intl.DateTimeFormat("en-US", { timeZone: TZ, hour: "numeric", minute: "2-digit", hour12: true }).format(eventDate);
  const label = hour >= 17 ? "Tonight" : "Today";
  return `${label} at ${timeStr}`;
}

export default function EventList({ events }: EventListProps) {
  if (events.length === 0) {
    return <p>No upcoming events. Check back soon.</p>;
  }

  return (
    <ul className={ eventList }>
      {events.map(e => {
        const img = e.image?.childImageSharp ? getImage(e.image.childImageSharp.gatsbyImageData) : null;
        const dateLabel = formatDisplayDate(e.startDate, e.startDateDisplay);
        return (
          <li key={ e.id } className={ event }>
            <div>
              <div>
                <a href={ e.url } target="_blank" rel="noopener noreferrer">
                  <h2>{ e.title }</h2>
                </a>
              </div>
              <div>
                <p>{ dateLabel }{e.location && <span className={locationCls}>{e.location}</span>}</p>
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
