"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

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
          {NAV_SECTIONS.map(({ id, label }) => (
            <Link
              key={id}
              href={`#${id}`}
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
          ))}
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
          {NAV_SECTIONS.map(({ id, label }) => (
            <li key={id}>
              <Link
                href={`#${id}`}
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
          ))}
        </ul>
      </nav>
    </header>
  );
}
