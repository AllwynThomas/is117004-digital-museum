import Link from "next/link";
import { cn } from "@/lib/utils";

interface TimelineEntryProps {
  year: number | string;
  title: string;
  description: string;
  badge?: string;
  variant?: "light" | "dark";
  className?: string;
  slug?: string;
}

export function TimelineEntry({
  year,
  title,
  description,
  variant = "dark",
  className,
  slug,
}: TimelineEntryProps) {
  const isDark = variant === "dark";

  const inner = (
    <>
      {/* Vertical timeline rule — visible on mobile as a left border */}
      <div
        className={cn(
          "absolute left-0 top-0 bottom-0 w-[2px] md:hidden",
          isDark
            ? "bg-[var(--color-accent-cyan)]"
            : "bg-[var(--color-surface-rule)]",
        )}
      />

      {/* Year numeral */}
      <p
        className={cn(
          "text-[length:var(--font-size-section)] font-extrabold leading-none md:text-right",
          isDark
            ? "text-[var(--color-accent-cyan)]"
            : "text-[var(--color-accent-blue)]",
        )}
      >
        {year}
      </p>

      {/* Content */}
      <div>
        <div className="flex items-baseline justify-between gap-[var(--space-3)]">
          <h3
            className={cn(
              "text-[length:var(--font-size-sub)] font-bold leading-tight mb-[var(--space-2)]",
              slug && "group-hover:underline",
              isDark
                ? "text-[var(--color-text-on-dark)]"
                : "text-[var(--color-text-primary)]",
            )}
          >
            {title}
          </h3>
          {slug && (
            <span
              className={cn(
                "shrink-0 text-[length:var(--font-size-body)] font-semibold leading-none transition-transform duration-150 group-hover:translate-x-[3px]",
                isDark
                  ? "text-[var(--color-accent-cyan)]"
                  : "text-[var(--color-accent-blue)]",
              )}
              aria-hidden="true"
            >
              →
            </span>
          )}
        </div>
        <p
          className={cn(
            "text-[length:var(--font-size-body)] leading-relaxed",
            isDark
              ? "text-[var(--color-text-secondary-on-dark)]"
              : "text-[var(--color-text-secondary)]",
          )}
        >
          {description}
        </p>
      </div>
    </>
  );

  if (slug) {
    return (
      <Link
        href={`/timeline/${slug}`}
        className={cn(
          "group relative grid gap-[var(--space-6)] pl-[var(--space-8)] md:grid-cols-[120px_1fr] md:gap-[var(--space-8)] md:pl-0 no-underline",
          className,
        )}
      >
        {inner}
      </Link>
    );
  }

  return (
    <div
      className={cn(
        "relative grid gap-[var(--space-6)] pl-[var(--space-8)] md:grid-cols-[120px_1fr] md:gap-[var(--space-8)] md:pl-0",
        className,
      )}
    >
      {inner}
    </div>
  );
}
