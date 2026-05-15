"use client";

import Link from "next/link";
import { useEffect, useState, useCallback, useRef } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { exhibitData } from "@/lib/exhibit-data";

const NAV_SECTIONS = [
  { id: "hero", label: "Home" },
  { id: "energy-density", label: "Energy Density" },
  { id: "how-it-works", label: "How It Works" },
  { id: "benefits", label: "Benefits" },
  { id: "safety", label: "Safety" },
  { id: "fuel-cycle", label: "Fuel Cycle" },
  { id: "future-demand", label: "Future Demand" },
  { id: "timeline", label: "Timeline" },
] as const;

export function SiteHeader() {
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTimelineDropdownOpen, setIsTimelineDropdownOpen] = useState(false);
  const [isTimelineMobileExpanded, setIsTimelineMobileExpanded] = useState(false);
  const timelineTriggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const sectionElements = NAV_SECTIONS.map(({ id }) =>
      document.getElementById(id),
    ).filter(Boolean) as HTMLElement[];

    if (sectionElements.length === 0) return;

    const getHeaderHeight = () => {
      const header = document.querySelector("header");
      return header instanceof HTMLElement ? header.offsetHeight : 0;
    };

    const updateActiveSection = () => {
      const headerHeight = getHeaderHeight();
      const focusLine = headerHeight + window.innerHeight * 0.35;

      const currentSection =
        [...sectionElements]
          .reverse()
          .find((section) => {
            const rect = section.getBoundingClientRect();
            return rect.top <= focusLine && rect.bottom > focusLine;
          }) ?? sectionElements[0];

      setActiveSection((current) =>
        current === currentSection.id ? current : currentSection.id,
      );
    };

    let animationFrame = 0;

    const scheduleUpdate = () => {
      if (animationFrame !== 0) return;

      animationFrame = window.requestAnimationFrame(() => {
        animationFrame = 0;
        updateActiveSection();
      });
    };

    updateActiveSection();

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("hashchange", scheduleUpdate);

    return () => {
      if (animationFrame !== 0) {
        window.cancelAnimationFrame(animationFrame);
      }

      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("hashchange", scheduleUpdate);
    };
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
    setIsTimelineMobileExpanded(false);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  // Close menu on Escape key
  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeMobileMenu();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMobileMenuOpen, closeMobileMenu]);

  // Click-outside handler for the desktop dropdown
  useEffect(() => {
    if (!isTimelineDropdownOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        timelineTriggerRef.current &&
        !timelineTriggerRef.current
          .closest("[data-timeline-container]")
          ?.contains(e.target as Node)
      ) {
        setIsTimelineDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isTimelineDropdownOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40",
        "bg-[var(--color-bg-primary)] border-b border-[var(--color-surface-rule)]",
      )}
    >
      <div
        className="mx-auto flex items-center justify-between gap-[var(--space-4)]"
        style={{
          maxWidth: "var(--grid-max-width)",
          minHeight: "var(--header-height)",
          padding: "var(--space-3) var(--space-6)",
        }}
      >
        <Link
          href="/"
          className="font-bold text-[var(--color-text-primary)] no-underline"
          style={{ fontSize: "var(--font-size-sub)", letterSpacing: "-0.02em" }}
        >
          Nuclear Energy Museum
        </Link>

        {/* Desktop navigation */}
        <nav
          aria-label="Exhibit sections"
          className="hidden min-w-0 items-center gap-0.5 md:flex lg:gap-1"
        >
          {NAV_SECTIONS.filter(({ id }) => id !== "timeline").map(
            ({ id, label }) => (
              <Link
                key={id}
                href={`/#${id}`}
                className={cn(
                  "no-underline rounded px-2.5 py-2 transition-colors lg:px-3.5",
                  "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]",
                  activeSection === id &&
                    "text-[var(--color-accent-blue)] font-semibold",
                )}
                style={{
                  fontSize: "clamp(13px, 0.3vw + 11.5px, 15px)",
                  lineHeight: 1.25,
                }}
              >
                {label}
              </Link>
            ),
          )}

          {/* Timeline dropdown composite */}
          <div
            className="relative"
            data-timeline-container
            onMouseEnter={() => setIsTimelineDropdownOpen(true)}
            onMouseLeave={() => setIsTimelineDropdownOpen(false)}
          >
            <button
              ref={timelineTriggerRef}
              type="button"
              aria-haspopup="menu"
              aria-expanded={isTimelineDropdownOpen ? "true" : "false"}
              onFocus={() => setIsTimelineDropdownOpen(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setIsTimelineDropdownOpen((prev) => !prev);
                }
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setIsTimelineDropdownOpen(true);
                  setTimeout(() => {
                    const panel = timelineTriggerRef.current
                      ?.closest("[data-timeline-container]")
                      ?.querySelector<HTMLElement>('[role="menuitem"]');
                    panel?.focus();
                  }, 0);
                }
                if (e.key === "Escape") {
                  setIsTimelineDropdownOpen(false);
                }
                if (e.key === "Tab") {
                  setIsTimelineDropdownOpen(false);
                }
              }}
              className={cn(
                "no-underline rounded px-2.5 py-2 transition-colors lg:px-3.5",
                "bg-transparent border-none cursor-pointer",
                "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]",
                activeSection === "timeline" &&
                  "text-[var(--color-accent-blue)] font-semibold",
              )}
              style={{
                fontSize: "clamp(13px, 0.3vw + 11.5px, 15px)",
                lineHeight: 1.25,
              }}
            >
              Timeline
            </button>

            {isTimelineDropdownOpen && (
              <div
                role="menu"
                onKeyDown={(e) => {
                  const items = Array.from(
                    e.currentTarget.querySelectorAll<HTMLElement>(
                      '[role="menuitem"]',
                    ),
                  );
                  const focused = document.activeElement as HTMLElement;
                  const currentIndex = items.indexOf(focused);

                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    const next = (currentIndex + 1) % items.length;
                    items[next]?.focus();
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    const prev =
                      (currentIndex - 1 + items.length) % items.length;
                    items[prev]?.focus();
                  } else if (e.key === "Home") {
                    e.preventDefault();
                    items[0]?.focus();
                  } else if (e.key === "End") {
                    e.preventDefault();
                    items[items.length - 1]?.focus();
                  } else if (e.key === "Escape") {
                    setIsTimelineDropdownOpen(false);
                    timelineTriggerRef.current?.focus();
                  } else if (e.key === "Tab") {
                    setIsTimelineDropdownOpen(false);
                  }
                }}
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  minWidth: "240px",
                  zIndex: 50,
                  background: "var(--color-bg-primary)",
                  border: "1px solid var(--color-surface-rule)",
                  borderRadius: 0,
                }}
              >
                <Link
                  role="menuitem"
                  href="/#timeline"
                  onClick={() => setIsTimelineDropdownOpen(false)}
                  style={{
                    display: "block",
                    padding: "var(--space-2) var(--space-4)",
                    fontSize: "clamp(13px, 0.3vw + 11.5px, 15px)",
                    fontWeight: 700,
                    color: "var(--color-accent-blue)",
                    textDecoration: "none",
                    borderBottom: "1px solid var(--color-surface-rule)",
                  }}
                >
                  Timeline Overview
                </Link>
                {exhibitData.timelineEntries.map((entry) => (
                  <Link
                    key={entry.slug}
                    role="menuitem"
                    href={`/timeline/${entry.slug}`}
                    onClick={() => setIsTimelineDropdownOpen(false)}
                    className="block no-underline hover:underline"
                    style={{
                      display: "block",
                      padding: "var(--space-2) var(--space-4)",
                      fontSize: "clamp(13px, 0.3vw + 11.5px, 15px)",
                      color: "var(--color-text-primary)",
                      textDecoration: "none",
                    }}
                  >
                    {entry.year} — {entry.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Mobile hamburger button */}
        <button
          type="button"
          className={cn(
            "md:hidden flex items-center justify-center",
            "w-10 h-10 rounded",
            "text-[var(--color-text-primary)]",
            "bg-transparent border-none cursor-pointer",
          )}
          onClick={toggleMobileMenu}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-nav-menu"
          aria-label={
            isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"
          }
        >
          {isMobileMenuOpen ? (
            <X size={24} aria-hidden="true" />
          ) : (
            <Menu size={24} aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Mobile navigation overlay */}
      <nav
        id="mobile-nav-menu"
        aria-label="Exhibit sections"
        className={cn(
          "md:hidden",
          "bg-[var(--color-bg-primary)] border-t border-[var(--color-surface-rule)]",
          !isMobileMenuOpen && "hidden",
        )}
      >
        <ul className="list-none m-0 p-0">
          {NAV_SECTIONS.map(({ id, label }) =>
            id === "timeline" ? (
              <li key="timeline">
                <button
                  type="button"
                  onClick={() =>
                    setIsTimelineMobileExpanded((prev) => !prev)
                  }
                  className={cn(
                    "w-full flex items-center justify-between no-underline",
                    "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]",
                    "border-b border-[var(--color-surface-rule)]",
                    activeSection === "timeline" &&
                      "text-[var(--color-accent-blue)] font-semibold",
                  )}
                  style={{
                    padding: "var(--space-4) var(--space-6)",
                    fontSize: "var(--font-size-body)",
                    background: "transparent",
                    cursor: "pointer",
                  }}
                  aria-expanded={isTimelineMobileExpanded ? "true" : "false"}
                >
                  Timeline
                  <ChevronDown
                    size={16}
                    aria-hidden="true"
                    className={cn(
                      "transition-transform duration-200 motion-reduce:transition-none",
                      isTimelineMobileExpanded && "rotate-180",
                    )}
                  />
                </button>

                {isTimelineMobileExpanded && (
                  <ul className="list-none m-0 p-0">
                    <li>
                      <Link
                        href="/#timeline"
                        onClick={closeMobileMenu}
                        className="block no-underline text-[var(--color-accent-blue)] font-bold border-b border-[var(--color-surface-rule)]"
                        style={{
                          padding: "var(--space-3) var(--space-6)",
                          paddingLeft: "var(--space-8)",
                          fontSize: "var(--font-size-body)",
                        }}
                      >
                        Timeline Overview
                      </Link>
                    </li>
                    {exhibitData.timelineEntries.map((entry) => (
                      <li key={entry.slug}>
                        <Link
                          href={`/timeline/${entry.slug}`}
                          onClick={closeMobileMenu}
                          className="block no-underline text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border-b border-[var(--color-surface-rule)]"
                          style={{
                            padding: "var(--space-3) var(--space-6)",
                            paddingLeft: "var(--space-8)",
                            fontSize: "var(--font-size-body)",
                          }}
                        >
                          {entry.year} — {entry.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ) : (
              <li key={id}>
                <Link
                  href={`/#${id}`}
                  onClick={closeMobileMenu}
                  className={cn(
                    "block no-underline",
                    "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]",
                    "border-b border-[var(--color-surface-rule)]",
                    activeSection === id &&
                      "text-[var(--color-accent-blue)] font-semibold",
                  )}
                  style={{
                    padding: "var(--space-4) var(--space-6)",
                    fontSize: "var(--font-size-body)",
                  }}
                >
                  {label}
                </Link>
              </li>
            ),
          )}
        </ul>
      </nav>
    </header>
  );
}
