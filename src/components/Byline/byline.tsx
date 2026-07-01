import { byline, compact as compactCls, author as authorCls, withSep } from "./byline.module.css";

type BylineProps = {
  author?: string | null;
  publishedAt?: string | Date | null;
  compact?: boolean;
};

const TZ = "America/Los_Angeles";

const PARTS_FORMATTER = new Intl.DateTimeFormat("en-US", {
  timeZone: TZ,
  year: "numeric",
  month: "long",
  day: "numeric",
});

function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function formatDate(input: string | Date): { label: string; iso: string } | null {
  const date = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(date.getTime())) return null;
  const parts = PARTS_FORMATTER.formatToParts(date);
  const month = parts.find(p => p.type === "month")!.value;
  const day = Number(parts.find(p => p.type === "day")!.value);
  const year = parts.find(p => p.type === "year")!.value;
  return { label: `${month} ${ordinal(day)}, ${year}`, iso: date.toISOString() };
}

export default function Byline({ author, publishedAt, compact = false }: BylineProps) {
  const date = publishedAt ? formatDate(publishedAt) : null;
  if (!author && !date) return null;

  return (
    <div className={`${byline}${compact ? ` ${compactCls}` : ""}`}>
      {author && (
        <span className={authorCls}>
          By {author}
        </span>
      )}
      {date && <time className={author ? withSep : undefined} dateTime={date.iso}>{date.label}</time>}
    </div>
  );
}
