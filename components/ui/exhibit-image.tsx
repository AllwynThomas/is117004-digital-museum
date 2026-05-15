"use client";

import Image from "next/image";
import { useCallback, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";
import { prefixAssetPath } from "@/lib/asset-path";

function useReducedMotion(): boolean {
  const subscribe = useCallback((callback: () => void) => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    mq.addEventListener("change", callback);
    return () => mq.removeEventListener("change", callback);
  }, []);

  const getSnapshot = useCallback(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  const getServerSnapshot = useCallback(() => false, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

interface ExhibitImageProps {
  src: string;
  alt: string;
  caption: string;
  sourceName: string;
  sourceUrl?: string;
  priority?: boolean;
  reducedMotionSrc?: string;
  variant?: "light" | "dark";
  className?: string;
}

export function ExhibitImage({
  src,
  alt,
  caption,
  sourceName,
  sourceUrl,
  priority = false,
  reducedMotionSrc,
  variant = "light",
  className,
}: ExhibitImageProps) {
  const prefersReducedMotion = useReducedMotion();

  const imageSrc =
    prefersReducedMotion && reducedMotionSrc ? reducedMotionSrc : src;

  const sourceMeta = `Source / ${sourceName}`;

  return (
    <figure className={cn("space-y-[var(--space-4)]", className)}>
      <div className="relative w-full min-w-0">
        <Image
          src={prefixAssetPath(imageSrc)}
          alt={alt}
          width={1200}
          height={675}
          priority={priority}
          className="w-full h-auto min-w-[0] md:min-w-[600px]"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
        />
      </div>
      <figcaption
        className={cn(
          "grid gap-[var(--space-2)] border-t border-[var(--color-surface-rule)] pt-[var(--space-3)] text-[length:var(--font-size-caption)] md:grid-cols-[minmax(0,1fr)_auto] md:items-baseline",
          variant === "dark"
            ? "text-[var(--color-text-secondary-on-dark)]"
            : "text-[var(--color-text-secondary)]",
        )}
      >
        <span>{caption}</span>
        {sourceUrl ? (
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "text-[0.72rem] font-medium uppercase tracking-[0.18em] no-underline transition-opacity hover:opacity-70",
              variant === "dark"
                ? "text-[var(--color-text-on-dark)]"
                : "text-[var(--color-text-primary)]",
            )}
          >
            {sourceMeta}
          </a>
        ) : (
          <span
            className={cn(
              "text-[0.72rem] font-medium uppercase tracking-[0.18em]",
              variant === "dark"
                ? "text-[var(--color-text-on-dark)]"
                : "text-[var(--color-text-primary)]",
            )}
          >
            {sourceMeta}
          </span>
        )}
      </figcaption>
    </figure>
  );
}
