import Link from "next/link";
import { TimelineEntry } from "@/lib/exhibit-data";

interface EventNavProps {
  prevEntry: Pick<TimelineEntry, "year" | "title" | "slug"> | null;
  nextEntry: Pick<TimelineEntry, "year" | "title" | "slug"> | null;
}

export function EventNav({ prevEntry, nextEntry }: EventNavProps) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        borderTop: "1px solid var(--color-surface-rule)",
        paddingTop: "var(--space-6)",
        paddingBottom: "var(--space-6)",
        marginTop: "var(--space-12)",
        fontSize: "var(--font-size-caption)",
      }}
    >
      <div>
        {prevEntry ? (
          <Link
            href={`/timeline/${prevEntry.slug}`}
            style={{
              color: "var(--color-text-secondary)",
              textDecoration: "none",
            }}
            className="event-nav-link"
          >
            ← {prevEntry.year} — {prevEntry.title}
          </Link>
        ) : (
          <span />
        )}
      </div>

      <div style={{ textAlign: "center" }}>
        <Link
          href="/#timeline"
          style={{
            color: "var(--color-text-secondary)",
            textDecoration: "none",
          }}
          className="event-nav-link"
        >
          Back to Timeline
        </Link>
      </div>

      <div>
        {nextEntry ? (
          <Link
            href={`/timeline/${nextEntry.slug}`}
            style={{
              color: "var(--color-text-secondary)",
              textDecoration: "none",
            }}
            className="event-nav-link"
          >
            {nextEntry.year} — {nextEntry.title} →
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
