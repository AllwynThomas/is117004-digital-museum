import { cn } from "@/lib/utils";
import { SourceBadge } from "@/components/ui/source-badge";

interface ComparisonItem {
  label: string;
  value: string;
  unit?: string;
}

interface DataComparisonCardProps {
  items: ComparisonItem[];
  title?: string;
  sourceName?: string;
  sourceUrl?: string;
  variant?: "light" | "dark";
  accentColor?: string;
  className?: string;
}

export function DataComparisonCard({
  items,
  title,
  sourceName,
  sourceUrl,
  variant = "light",
  accentColor,
  className,
}: DataComparisonCardProps) {
  const isDark = variant === "dark";

  return (
    <div
      className={cn(
        "border border-[var(--color-surface-rule)] bg-[var(--color-bg-tertiary)] p-[var(--space-6)]",
        className,
      )}
    >
      {title && (
        <h3
          className={cn(
            "text-[length:var(--font-size-sub)] font-bold mb-[var(--space-6)]",
            isDark
              ? "text-[var(--color-text-on-dark)]"
              : "text-[var(--color-text-primary)]",
          )}
        >
          {title}
        </h3>
      )}

      <div className="grid grid-cols-1 gap-[var(--space-6)] sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div key={item.label} className="space-y-[var(--space-1)]">
            <p
              className="text-[length:var(--font-size-sub)] font-bold leading-tight"
              style={{
                color: `var(${accentColor || "--color-accent-blue"})`,
              }}
            >
              {item.value}
              {item.unit && (
                <span
                  className={cn(
                    "ml-[var(--space-1)] text-[length:var(--font-size-caption)] font-normal",
                    isDark
                      ? "text-[var(--color-text-secondary-on-dark)]"
                      : "text-[var(--color-text-secondary)]",
                  )}
                >
                  {item.unit}
                </span>
              )}
            </p>
            <p
              className={cn(
                "text-[length:var(--font-size-body)]",
                isDark
                  ? "text-[var(--color-text-on-dark)]"
                  : "text-[var(--color-text-primary)]",
              )}
            >
              {item.label}
            </p>
          </div>
        ))}
      </div>

      {sourceName && (
        <div className="mt-[var(--space-6)]">
          <SourceBadge
            sourceName={sourceName}
            sourceUrl={sourceUrl}
            variant={variant}
          />
        </div>
      )}
    </div>
  );
}
