import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { exhibitData } from "@/lib/exhibit-data";
import { SourceBadge } from "@/components/ui/source-badge";
import { EventNav } from "@/components/ui/event-nav";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { prefixAssetPath } from "@/lib/asset-path";

export async function generateStaticParams() {
  return exhibitData.timelineEntries.map((entry) => ({
    slug: entry.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = exhibitData.timelineEntries.find((e) => e.slug === slug);
  if (!entry) notFound();

  const descriptions: Record<string, string> = {
    "chicago-pile-1":
      "On December 2, 1942, Enrico Fermi's team achieved the first controlled nuclear chain reaction under Stagg Field, opening the nuclear age.",
    "obninsk-ussr":
      "In 1954 the Soviet Union connected the world's first nuclear power plant to an electrical grid, proving fission could generate usable electricity.",
    shippingport:
      "Shippingport became the first full-scale U.S. commercial nuclear plant in 1958, operating for 25 years and validating civilian nuclear power.",
    "three-mile-island":
      "The 1979 Three Mile Island partial meltdown caused zero radiation deaths and triggered sweeping safety reforms that strengthened U.S. nuclear oversight.",
    chernobyl:
      "The 1986 Chernobyl accident caused 31 acute deaths and prompted a global safety overhaul. WHO projects up to 4,000 long-term cancer fatalities.",
    "fukushima-daiichi":
      "A 2011 tsunami triggered meltdowns at three Fukushima reactors. Confirmed radiation deaths: zero. 154,000 people were evacuated as a precaution.",
    "nuclear-renaissance":
      "SMRs entering the NRC licensing pipeline and rising AI data-center demand are driving a 21st-century nuclear renaissance targeting 3× global capacity by 2050.",
  };

  return {
    title: `${entry.year} — ${entry.title} | Nuclear Energy Museum`,
    description: descriptions[slug],
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entries = exhibitData.timelineEntries;
  const index = entries.findIndex((e) => e.slug === slug);
  if (index === -1) notFound();

  const entry = entries[index];
  const prevEntry = index > 0 ? entries[index - 1] : null;
  const nextEntry = index < entries.length - 1 ? entries[index + 1] : null;

  return (
    <main id="main-content">
      <div
        style={{
          maxWidth: "var(--grid-max-width)",
          margin: "0 auto",
          padding: "0 var(--space-6)",
        }}
      >
        {/* Breadcrumb */}
        <div
          style={{
            paddingTop: "var(--space-8)",
            paddingBottom: "var(--space-6)",
          }}
        >
          <Link
            href="/#timeline"
            style={{
              fontSize: "var(--font-size-caption)",
              color: "var(--color-text-secondary)",
              textDecoration: "none",
            }}
            className="event-nav-link"
          >
            ← Back to Timeline
          </Link>
        </div>

        {/* Event Hero */}
        <div style={{ paddingBottom: "var(--space-12)" }}>
          <p
            style={{
              fontSize: "var(--font-size-display)",
              fontWeight: 800,
              color: "var(--color-accent-blue)",
              letterSpacing: "-0.02em",
              margin: 0,
            }}
          >
            {entry.year}
          </p>
          <h1
            style={{
              fontSize: "var(--font-size-section)",
              fontWeight: 700,
              color: "var(--color-text-primary)",
              letterSpacing: "-0.02em",
              marginTop: "var(--space-2)",
              marginBottom: 0,
            }}
          >
            {entry.title}
          </h1>
        </div>

        {/* Content Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-2"
          style={{ gap: "var(--space-8)" }}
        >
          {/* Left column: image placeholder */}
          <div>
            <div
              style={{
                aspectRatio: "16 / 9",
                border: "1px solid var(--color-surface-rule)",
                borderRadius: 0,
                background: "var(--color-bg-tertiary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  color: "var(--color-text-secondary)",
                  fontSize: "var(--font-size-caption)",
                }}
              >
                {/* prefixAssetPath() from lib/asset-path.ts must be used when a real
                    next/image src is added here in a future pass */}
                [Image: {entry.imageAlt}]
              </span>
            </div>
            <p
              style={{
                fontSize: "var(--font-size-caption)",
                color: "var(--color-text-secondary)",
                marginTop: "var(--space-2)",
              }}
            >
              {entry.imageAlt}
            </p>
          </div>

          {/* Right column: stat cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
            {entry.stats.map((stat) => {
              const source = exhibitData.sources.find(
                (s) => s.id === stat.sourceId,
              );
              return (
                <div
                  key={stat.label}
                  style={{
                    background: "var(--color-bg-secondary)",
                    border: "1px solid var(--color-surface-rule)",
                    borderRadius: 0,
                    padding: "var(--space-4)",
                  }}
                >
                  <p
                    style={{
                      fontSize: "var(--font-size-section)",
                      fontWeight: 700,
                      color: "var(--color-text-primary)",
                      margin: 0,
                    }}
                  >
                    {stat.value}
                  </p>
                  <p
                    style={{
                      fontSize: "var(--font-size-caption)",
                      color: "var(--color-text-secondary)",
                      margin: 0,
                    }}
                  >
                    {stat.label}
                  </p>
                  {source && (
                    <SourceBadge
                      sourceName={source.title}
                      sourceUrl={source.sourceUrl}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Source Badges Row */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "var(--space-3)",
            paddingTop: "var(--space-8)",
          }}
        >
          {entry.sourceIds.map((id) => {
            const source = exhibitData.sources.find((s) => s.id === id);
            return source ? (
              <SourceBadge
                key={id}
                sourceName={source.title}
                sourceUrl={source.sourceUrl}
              />
            ) : null;
          })}
        </div>

        {/* EventNav */}
        <EventNav prevEntry={prevEntry} nextEntry={nextEntry} />
      </div>
    </main>
  );
}
