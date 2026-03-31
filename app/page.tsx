import { exhibitData } from "@/lib/exhibit-data";
import { SectionHeader } from "@/components/ui/section-header";
import { ExhibitImage } from "@/components/ui/exhibit-image";
import { StatCard } from "@/components/ui/stat-card";
import { StepCard } from "@/components/ui/step-card";
import { SourceBadge } from "@/components/ui/source-badge";
import { DataComparisonCard } from "@/components/ui/data-comparison-card";

function getSource(id: string) {
  return exhibitData.sources.find((s) => s.id === id);
}

export default function Home() {
  const heroSection = exhibitData.sections.find((s) => s.id === "hero")!;
  const howItWorksSection = exhibitData.sections.find(
    (s) => s.id === "how-it-works",
  )!;
  const benefitsSection = exhibitData.sections.find(
    (s) => s.id === "benefits",
  )!;
  const safetySection = exhibitData.sections.find(
    (s) => s.id === "safety",
  )!;
  const heroStats = exhibitData.statCards["hero"];
  const howItWorksSteps = exhibitData.processSteps["how-it-works"];
  const benefitsStats = exhibitData.statCards["benefits"];
  const safetyComparisons = exhibitData.comparisonData["safety"];

  const heroSource = getSource("uranium_vs_fossil_fuels_diagram");
  const reactorAnimSource = getSource("nuclearplant_animation");
  const nrcSource = getSource("nrc_pwr_overview");
  const doeSource = getSource("doe_nuclear_101");
  const chartSource = getSource("safest_cleanest_sources_chart");
  const iaaeCleanSource = getSource("iaea_clean_energy_pdf");
  const iaaeStableSource = getSource("iaea_smart_stable_reliable");
  const chernobylSource = getSource("ourworldindata_chernobyl_fukushima");
  const nrcSpentFuelSource = getSource("nrc_spent_fuel_storage");

  const placeholderSections = [
    { id: "fuel-cycle", title: "Fuel Cycle" },
    { id: "future-demand", title: "Powering AI and the Future Grid" },
    { id: "timeline", title: "Timeline" },
  ];

  return (
    <main id="main-content">
      {/* ── Hero Section ── */}
      <section
        id="hero"
        aria-labelledby="hero-title"
        className="bg-[var(--color-bg-dark)] py-[var(--space-16)] px-[var(--space-6)]"
      >
        <div className="mx-auto max-w-[var(--grid-max-width)]">
          <SectionHeader
            eyebrow={heroSection.eyebrow}
            title={heroSection.title}
            lede={heroSection.lede}
            id="hero-title"
            variant="dark"
          />

          <div className="mt-[var(--space-8)]">
            <ExhibitImage
              src="/assets/images/uranium_vs_fossil_fuels_diagram.png"
              alt="Infographic comparing energy density: a single uranium fuel pellet produces as much energy as one ton of coal, 17,000 cubic feet of natural gas, or 149 gallons of oil."
              caption="Energy density comparison — one uranium pellet versus fossil fuel equivalents."
              sourceName="Visual Capitalist"
              sourceUrl={heroSource?.sourceUrl}
              priority={true}
              variant="dark"
            />
          </div>

          <p className="mt-[var(--space-8)] max-w-[720px] text-[length:var(--font-size-body)] leading-relaxed text-[var(--color-text-secondary-on-dark)]">
            {heroSection.bodyContent}
          </p>

          <div className="mt-[var(--space-12)] grid grid-cols-1 gap-[var(--space-8)] sm:grid-cols-3">
            {heroStats.map((stat) => (
              <StatCard
                key={stat.label}
                value={stat.value}
                label={stat.label}
                context={stat.context}
                accentColor={heroSection.accentColor}
                variant="dark"
              />
            ))}
          </div>

          {heroSection.transitionText && (
            <p className="mt-[var(--space-12)] text-[length:var(--font-size-body)] italic text-[var(--color-text-secondary-on-dark)]">
              {heroSection.transitionText}
            </p>
          )}
        </div>
      </section>

      {/* ── How It Works Section ── */}
      <section
        id="how-it-works"
        aria-labelledby="how-it-works-title"
        className="bg-[var(--color-bg-secondary)] py-[var(--space-16)] px-[var(--space-6)]"
      >
        <div className="mx-auto max-w-[var(--grid-max-width)]">
          <SectionHeader
            eyebrow={howItWorksSection.eyebrow}
            title={howItWorksSection.title}
            lede={howItWorksSection.lede}
            id="how-it-works-title"
            variant="light"
          />

          <div className="mt-[var(--space-8)]">
            <ExhibitImage
              src="/assets/images/nuclearplant.gif"
              alt="Animated diagram of a pressurized water reactor (PWR) cycle: fission heats water in the reactor core, steam transfers through the steam generator, spins the turbine and generator, then condenses and recycles."
              caption="How a pressurized water reactor generates electricity."
              sourceName="Nuclear Energy Institute"
              sourceUrl={reactorAnimSource?.sourceUrl}
              reducedMotionSrc="/assets/images/uranium_vs_fossil_fuels_diagram.png"
              variant="light"
            />
          </div>

          <div className="mt-[var(--space-12)] grid grid-cols-1 gap-[var(--grid-gutter)] md:grid-cols-2 xl:grid-cols-4">
            {howItWorksSteps.map((step) => (
              <StepCard
                key={step.stepNumber}
                stepNumber={step.stepNumber}
                title={step.title}
                description={step.description}
                accentColor={howItWorksSection.accentColor}
              />
            ))}
          </div>

          <div className="mt-[var(--space-8)] flex flex-wrap gap-[var(--space-3)]">
            {nrcSource && (
              <SourceBadge
                sourceName="U.S. Nuclear Regulatory Commission"
                sourceUrl={nrcSource.sourceUrl}
              />
            )}
            {doeSource && (
              <SourceBadge
                sourceName="U.S. Department of Energy"
                sourceUrl={doeSource.sourceUrl}
              />
            )}
          </div>

          {howItWorksSection.transitionText && (
            <p className="mt-[var(--space-12)] text-[length:var(--font-size-body)] italic text-[var(--color-text-secondary)]">
              {howItWorksSection.transitionText}
            </p>
          )}
        </div>
      </section>

      {/* ── Benefits Section ── */}
      <section
        id="benefits"
        aria-labelledby="benefits-title"
        className="bg-[var(--color-bg-secondary)] py-[var(--space-16)] px-[var(--space-6)]"
      >
        <div className="mx-auto max-w-[var(--grid-max-width)]">
          <SectionHeader
            eyebrow={benefitsSection.eyebrow}
            title={benefitsSection.title}
            lede={benefitsSection.lede}
            id="benefits-title"
            variant="light"
          />

          <div className="mt-[var(--space-8)]">
            <ExhibitImage
              src="/assets/images/safest_cleanest_sources_of_energy_chart.png"
              alt="Chart comparing deaths per unit of energy and greenhouse gas emissions across energy sources including coal, oil, natural gas, biomass, hydropower, wind, nuclear, and solar — nuclear ranks among the lowest for both metrics."
              caption="Deaths and greenhouse gas emissions by energy source."
              sourceName="Our World in Data"
              sourceUrl={chartSource?.sourceUrl}
              variant="light"
            />
          </div>

          <p className="mt-[var(--space-8)] max-w-[720px] text-[length:var(--font-size-body)] leading-relaxed text-[var(--color-text-secondary)]">
            {benefitsSection.bodyContent}
          </p>

          <div className="mt-[var(--space-12)] grid grid-cols-1 gap-[var(--space-8)] sm:grid-cols-2 xl:grid-cols-4">
            {benefitsStats.map((stat) => (
              <StatCard
                key={stat.label}
                value={stat.value}
                label={stat.label}
                context={stat.context}
                accentColor={benefitsSection.accentColor}
                variant="light"
              />
            ))}
          </div>

          <div className="mt-[var(--space-8)] flex flex-wrap gap-[var(--space-3)]">
            {chartSource && (
              <SourceBadge
                sourceName="Our World in Data"
                sourceUrl={chartSource.sourceUrl}
              />
            )}
            {iaaeCleanSource && (
              <SourceBadge
                sourceName="IAEA — Clean Energy"
                sourceUrl={iaaeCleanSource.sourceUrl}
              />
            )}
            {iaaeStableSource && (
              <SourceBadge
                sourceName="IAEA — Smart, Stable, Reliable"
                sourceUrl={iaaeStableSource.sourceUrl}
              />
            )}
          </div>

          {benefitsSection.transitionText && (
            <p className="mt-[var(--space-12)] text-[length:var(--font-size-body)] italic text-[var(--color-text-secondary)]">
              {benefitsSection.transitionText}
            </p>
          )}
        </div>
      </section>

      {/* ── Safety Section ── */}
      <section
        id="safety"
        aria-labelledby="safety-title"
        className="bg-[var(--color-bg-primary)] py-[var(--space-16)] px-[var(--space-6)]"
      >
        <div className="mx-auto max-w-[var(--grid-max-width)]">
          <SectionHeader
            eyebrow={safetySection.eyebrow}
            title={safetySection.title}
            lede={safetySection.lede}
            id="safety-title"
            variant="light"
          />

          <p className="mt-[var(--space-8)] max-w-[720px] text-[length:var(--font-size-body)] leading-relaxed text-[var(--color-text-secondary)]">
            {safetySection.bodyContent}
          </p>

          <div className="mt-[var(--space-12)]">
            {safetyComparisons.map((comparison) => (
              <DataComparisonCard
                key={comparison.title}
                title={comparison.title}
                items={comparison.items}
                sourceName="Our World in Data"
                sourceUrl={chartSource?.sourceUrl}
                accentColor={safetySection.accentColor}
                variant="light"
              />
            ))}
          </div>

          <div
            className="mt-[var(--space-12)] border-l-4 pl-[var(--space-6)] py-[var(--space-4)]"
            style={{
              borderColor: `var(${safetySection.accentColor})`,
            }}
          >
            <p className="text-[length:var(--font-size-body)] leading-relaxed text-[var(--color-text-primary)]">
              <strong>Waste in perspective:</strong> All U.S. spent fuel from
              more than 60 years of commercial reactor operation would fit on a
              single football field, stacked less than 10 yards high. Spent fuel
              is stored in steel-lined concrete pools and dry cask systems under
              continuous NRC oversight.
            </p>
          </div>

          <div className="mt-[var(--space-8)] flex flex-wrap gap-[var(--space-3)]">
            {chernobylSource && (
              <SourceBadge
                sourceName="Our World in Data — Chernobyl & Fukushima"
                sourceUrl={chernobylSource.sourceUrl}
              />
            )}
            {nrcSpentFuelSource && (
              <SourceBadge
                sourceName="U.S. Nuclear Regulatory Commission — Spent Fuel Storage"
                sourceUrl={nrcSpentFuelSource.sourceUrl}
              />
            )}
          </div>

          {safetySection.transitionText && (
            <p className="mt-[var(--space-12)] text-[length:var(--font-size-body)] italic text-[var(--color-text-secondary)]">
              {safetySection.transitionText}
            </p>
          )}
        </div>
      </section>

      {/* ── Placeholder Sections ── */}
      {placeholderSections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          aria-labelledby={`${section.id}-heading`}
          style={{
            padding: "var(--space-16) var(--space-6)",
          }}
        >
          <h2 id={`${section.id}-heading`}>{section.title}</h2>
        </section>
      ))}
    </main>
  );
}
