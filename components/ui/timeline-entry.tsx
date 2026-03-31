import { cn } from "@/lib/utils";

interface TimelineEntryProps {
  year: number | string;
  title: string;
  description: string;
  badge?: string;
  variant?: "light" | "dark";
  className?: string;
}

export function TimelineEntry({
  year,
  title,
  description,
  variant = "dark",
  className,
}: TimelineEntryProps) {
  const isDark = variant === "dark";

  return (
    <div
      className={cn(
        "relative grid gap-[var(--space-6)] pl-[var(--space-8)] md:grid-cols-[120px_1fr] md:gap-[var(--space-8)] md:pl-0",
        className,
      )}
    >
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
        <h3
          className={cn(
            "text-[length:var(--font-size-sub)] font-bold leading-tight mb-[var(--space-2)]",
            isDark
              ? "text-[var(--color-text-on-dark)]"
              : "text-[var(--color-text-primary)]",
          )}
        >
          {title}
        </h3>
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
    </div>
  );
}
