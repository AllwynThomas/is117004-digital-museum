import Image from "next/image";
import Link from "next/link";
import { exhibitData } from "@/lib/exhibit-data";
import { SectionHeader } from "@/components/ui/section-header";
import { ExhibitImage } from "@/components/ui/exhibit-image";
import { StatCard } from "@/components/ui/stat-card";
import { StepCard } from "@/components/ui/step-card";
import { SourceBadge } from "@/components/ui/source-badge";
import { DataComparisonCard } from "@/components/ui/data-comparison-card";
import { TimelineEntry } from "@/components/ui/timeline-entry";
import { cn } from "@/lib/utils";
import { prefixAssetPath } from "@/lib/asset-path";

function getSource(id: string) {
  return exhibitData.sources.find((s) => s.id === id);
}

interface SummaryItem {
  title: string;
  text: string;
}

function SectionSummary({
  items,
  className,
  itemClassName,
}: {
  items: SummaryItem[];
  className?: string;
  itemClassName?: string;
}) {
  return (
    <ul
      className={cn(
        "mt-[var(--space-8)] grid gap-x-[var(--space-10)] gap-y-[var(--space-4)] pl-[1.25rem] xl:grid-cols-2",
        className,
      )}
    >
      {items.map((item) => (
        <li
          key={item.title}
          className={cn(
            "border-t border-[var(--color-surface-rule)] pt-[var(--space-3)] marker:text-[var(--color-text-primary)]",
            itemClassName,
          )}
        >
          <p className="text-[length:var(--font-size-body)] leading-relaxed text-[var(--color-text-secondary)]">
            <strong className="font-semibold text-[var(--color-text-primary)]">
              {item.title}
            </strong>{" "}
            {item.text}
          </p>
        </li>
      ))}
    </ul>
  );
}

export default function Home() {
  const heroSection = exhibitData.sections.find((s) => s.id === "hero")!;
  const energyDensitySection = exhibitData.sections.find(
    (s) => s.id === "energy-density",
  )!;
  const howItWorksSection = exhibitData.sections.find(
    (s) => s.id === "how-it-works",
  )!;
  const benefitsSection = exhibitData.sections.find(
    (s) => s.id === "benefits",
  )!;
  const safetySection = exhibitData.sections.find((s) => s.id === "safety")!;
  const energyDensityStats = exhibitData.statCards["hero"];
  const howItWorksSteps = exhibitData.processSteps["how-it-works"];
  const benefitsStats = exhibitData.statCards["benefits"];
  const safetyComparisons = exhibitData.comparisonData["safety"];
  const fuelCycleSection = exhibitData.sections.find(
    (s) => s.id === "fuel-cycle",
  )!;
  const futureDemandSection = exhibitData.sections.find(
    (s) => s.id === "future-demand",
  )!;
  const fuelCycleSteps = exhibitData.processSteps["fuel-cycle"];
  const futureDemandStats = exhibitData.statCards["future-demand"];

  const energyDensitySource = getSource("uranium_vs_fossil_fuels_diagram");
  const reactorAnimSource = getSource("nuclearplant_animation");
  const nrcSource = getSource("nrc_pwr_overview");
  const doeSource = getSource("doe_nuclear_101");
  const chartSource = getSource("safest_cleanest_sources_chart");
  const spentFuelImageSource = getSource("generation_atomic_spent_fuel");
  const iaaeCleanSource = getSource("iaea_clean_energy_pdf");
  const iaaeStableSource = getSource("iaea_smart_stable_reliable");
  const chernobylSource = getSource("ourworldindata_chernobyl_fukushima");
  const nrcSpentFuelSource = getSource("nrc_spent_fuel_storage");
  const eiaFuelCycleSource = getSource("eia_nuclear_fuel_cycle");
  const iaaeNuclearSource = getSource("iaea_science_of_nuclear_power");
  const eiaNuclearSource = getSource("eia_nuclear_explained");
  const deloitteSource = getSource("deloitte_data_center_nuclear");
  const doeSmrSource = getSource("doe_smr_overview");
  const iaeaTopicSource = getSource("iaea_nuclear_power_topic");

  const timelineEntries = exhibitData.timelineEntries;
  const timelineClosingStatement = exhibitData.timelineClosingStatement;

  const energyDensitySummary: SummaryItem[] = [
    {
      title: "One pellet:",
      text: "a gummy-bear sized fuel pellet can deliver as much energy as one ton of coal, 17,000 cubic feet of natural gas, or 149 gallons of oil.",
    },
    {
      title: "Global reach:",
      text: "more than 440 reactors across 32 countries help keep power flowing day and night.",
    },
    {
      title: "Always available:",
      text: "nuclear supplies about 10% of the world's electricity with near-zero carbon emissions during operation.",
    },
  ];

  const howItWorksSummary: SummaryItem[] = [
    {
      title: "Fission makes heat:",
      text: "splitting uranium atoms releases thermal energy inside the reactor core.",
    },
    {
      title: "Steam makes power:",
      text: "that heat drives steam, spins a turbine, and turns a generator to produce electricity.",
    },
    {
      title: "Closed-loop design:",
      text: "the hot reactor water transfers energy through a steam generator without leaving the reactor system.",
    },
    {
      title: "Continuous cycle:",
      text: "steam cools, condenses, and returns to start the process again.",
    },
  ];

  const benefitsSummary: SummaryItem[] = [
    {
      title: "Very low emissions:",
      text: "nuclear lifecycle CO2 is in the same range as wind and solar.",
    },
    {
      title: "Reliable output:",
      text: "plants operate at about a 93% capacity factor, higher than any other major source.",
    },
    {
      title: "Strong safety record:",
      text: "per unit of electricity produced, nuclear has the lowest death rate among major energy sources.",
    },
  ];

  const safetySummary: SummaryItem[] = [
    {
      title: "Accidents in context:",
      text: "Chernobyl and Fukushima remain serious events, but they are rare and heavily studied edge cases in civilian nuclear history.",
    },
    {
      title: "Measured impact:",
      text: "even when those disasters are included, nuclear is estimated at 0.03 deaths per terawatt-hour versus 2.8 for natural gas, 18.4 for oil, and 24.6 for coal.",
    },
    {
      title: "Waste is managed:",
      text: "spent fuel is tracked, shielded, and stored under continuous NRC oversight in pools and dry casks.",
    },
  ];

  const fuelCycleSummary: SummaryItem[] = [
    {
      title: "Regulated at every step:",
      text: "mining, enrichment, fabrication, reactor use, and storage all follow strict domestic and international rules.",
    },
    {
      title: "Compact fuel form:",
      text: "uranium becomes ceramic pellets, then fuel rods, then reactor-ready fuel assemblies.",
    },
    {
      title: "Long-term control:",
      text: "after use, fuel is cooled on site and then moved into hardened storage systems designed for decades of containment.",
    },
  ];

  const futureDemandSummary: SummaryItem[] = [
    {
      title: "Demand is rising fast:",
      text: "AI data centers are driving electricity growth of roughly 30% per year.",
    },
    {
      title: "Best fit for 24/7 loads:",
      text: "data centers need dense, always-on, low-carbon electricity, which matches nuclear's operating profile.",
    },
    {
      title: "SMRs expand options:",
      text: "small modular reactors are designed for scalable deployment closer to demand centers with shorter build timelines.",
    },
  ];

  return (
    <main id="main-content">
      {/* ── Hero Section ── */}
      <section
        id="hero"
        aria-labelledby="hero-title"
        className="relative isolate overflow-hidden bg-[var(--color-bg-dark)]"
      >
        <div className="absolute inset-0">
          <Image
            src={prefixAssetPath("/assets/images/hero_section.png")}
            alt="Inside a nuclear reactor facility, a glowing blue reactor pool surrounds the reactor core beneath an industrial observation deck."
            fill
            priority={true}
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,17,23,0.18)_0%,rgba(13,17,23,0.55)_45%,rgba(13,17,23,0.96)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-[28svh] bg-[linear-gradient(180deg,rgba(13,17,23,0)_0%,rgba(13,17,23,0.9)_100%)]" />
        </div>

        <div className="relative mx-auto flex min-h-[calc(100svh-var(--header-height))] max-w-[var(--grid-max-width)] items-end px-[var(--space-6)] py-[clamp(4rem,10vh,8rem)]">
          <div className="max-w-[760px] space-y-[var(--space-6)]">

            <h1
              id="hero-title"
              className="max-w-[12ch] text-[clamp(3rem,7vw,6rem)] font-bold leading-[0.92] text-[var(--color-text-on-dark)]"
            >
              {heroSection.title}
            </h1>

            <p className="max-w-[64ch] text-[clamp(1rem,1.7vw,1.3rem)] leading-relaxed text-[var(--color-text-on-dark)]">
              {heroSection.lede}
            </p>

            <div className="flex flex-wrap gap-[var(--space-4)] pt-[var(--space-2)]">
              <Link
                href="#timeline"
                className="inline-flex items-center justify-center rounded-full bg-[var(--color-accent-cyan)] px-[var(--space-6)] py-[var(--space-3)] text-[var(--color-bg-dark)] no-underline transition-transform duration-200 hover:-translate-y-[1px]"
              >
                View Timeline
              </Link>
              <Link
                href="#energy-density"
                className="inline-flex items-center justify-center rounded-full border border-[rgba(168,240,255,0.55)] bg-[rgba(13,17,23,0.28)] px-[var(--space-6)] py-[var(--space-3)] text-[var(--color-text-on-dark)] no-underline shadow-[0_0_0_rgba(0,229,255,0)] transition-[transform,background-color,box-shadow,border-color] duration-300 hover:-translate-y-[1px] hover:border-[rgba(168,240,255,0.9)] hover:bg-[rgba(13,17,23,0.42)] hover:shadow-[0_0_24px_rgba(0,229,255,0.22),0_0_56px_rgba(74,214,255,0.16)]"
              >
                Start at the Source
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Energy Density Section ── */}
      <section
        id="energy-density"
        aria-labelledby="energy-density-title"
        className="bg-[var(--color-bg-secondary)] px-[var(--space-6)] py-[var(--space-16)]"
      >
        <div className="mx-auto max-w-[var(--grid-max-width)]">
          <SectionHeader
            eyebrow={energyDensitySection.eyebrow}
            title={energyDensitySection.title}
            id="energy-density-title"
            variant="light"
          />

          <div className="mt-[var(--space-8)] grid grid-cols-1 items-start gap-[var(--space-8)] xl:grid-cols-[minmax(0,0.9fr)_minmax(300px,0.62fr)] xl:items-center xl:gap-[var(--space-12)]">
            <ExhibitImage
              src="/assets/images/uranium_vs_fossil_fuels_diagram.webp"
              alt="Infographic comparing energy density: a single uranium fuel pellet produces as much energy as one ton of coal, 17,000 cubic feet of natural gas, or 149 gallons of oil."
              caption="Energy density comparison — one uranium pellet versus fossil fuel equivalents."
              sourceName="Visual Capitalist"
              sourceUrl={energyDensitySource?.sourceUrl}
              priority={false}
              variant="light"
              className="mx-auto w-full max-w-[760px] xl:mx-0 xl:max-w-[680px]"
            />

            <SectionSummary
              items={energyDensitySummary}
              className="mt-0 max-w-[500px] gap-y-[var(--space-6)] sm:grid-cols-1 xl:w-full xl:grid-cols-1 xl:justify-self-center xl:self-center xl:pt-0"
            />
          </div>

          <div className="mt-[var(--space-12)] grid grid-cols-1 gap-[var(--space-8)] sm:grid-cols-3">
            {energyDensityStats.map((stat) => (
              <StatCard
                key={stat.label}
                value={stat.value}
                label={stat.label}
                context={stat.context}
                accentColor={energyDensitySection.accentColor}
                variant="light"
              />
            ))}
          </div>

          {energyDensitySection.transitionText && (
            <p className="mt-[var(--space-12)] text-[length:var(--font-size-body)] italic text-[var(--color-text-secondary)]">
              {energyDensitySection.transitionText}
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
              reducedMotionSrc="/assets/images/uranium_vs_fossil_fuels_diagram.webp"
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
            id="benefits-title"
            variant="light"
          />

          <div className="mt-[var(--space-8)]">
            <ExhibitImage
              src="/assets/images/safest_cleanest_sources_of_energy_chart.webp"
              alt="Chart comparing deaths per unit of energy and greenhouse gas emissions across energy sources including coal, oil, natural gas, biomass, hydropower, wind, nuclear, and solar — nuclear ranks among the lowest for both metrics."
              caption="Deaths and greenhouse gas emissions by energy source."
              sourceName="Our World in Data"
              sourceUrl={chartSource?.sourceUrl}
              variant="light"
            />
          </div>

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
            id="safety-title"
            variant="light"
          />

          <div className="mt-[var(--space-8)] grid grid-cols-1 items-start gap-[var(--space-8)] xl:grid-cols-[minmax(0,0.92fr)_minmax(320px,0.78fr)] xl:items-center xl:gap-[var(--space-12)]">
            <div className="xl:justify-self-center xl:self-center">
              <SectionSummary
                items={safetySummary}
                className="mt-0 max-w-[500px] gap-y-[var(--space-10)] xl:grid-cols-1"
                itemClassName="pt-[var(--space-5)] pb-[var(--space-3)]"
              />
            </div>

            <figure className="m-0">
              <div className="relative aspect-[4/3] overflow-hidden border-b border-[var(--color-surface-rule)] pb-[var(--space-3)]">
                <Image
                  src={prefixAssetPath("/assets/images/nuclear_spent_fuel.png")}
                  alt="Infographic showing that the total volume of U.S. spent nuclear fuel would fit on a football field roughly 360 feet by 160 feet and 24 feet high."
                  fill
                  sizes="(min-width: 1280px) 34vw, (min-width: 768px) 50vw, 100vw"
                  className="object-contain"
                />
              </div>
              <figcaption className="grid gap-[var(--space-2)] border-t border-[var(--color-surface-rule)] pt-[var(--space-3)] text-[length:var(--font-size-caption)] text-[var(--color-text-secondary)] md:grid-cols-[minmax(0,1fr)_auto] md:items-baseline">
                <span className="text-[0.95rem] leading-relaxed text-[var(--color-text-secondary)]">
                  <strong className="text-[var(--color-text-primary)]">
                    Spent fuel stays compact.
                  </strong>{" "}
                  The entire U.S. commercial inventory fits within a football-field footprint, reinforcing why storage is treated as a solvable engineering problem rather than an uncontrolled waste stream.
                </span>
                {spentFuelImageSource && (
                  <a
                    href={spentFuelImageSource.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[0.72rem] font-medium uppercase tracking-[0.18em] text-[var(--color-text-primary)] no-underline transition-opacity hover:opacity-70"
                  >
                    Source / Generation Atomic
                  </a>
                )}
              </figcaption>
            </figure>
          </div>

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

      {/* ── Fuel Cycle Section ── */}
      <section
        id="fuel-cycle"
        aria-labelledby="fuel-cycle-title"
        className="bg-[var(--color-bg-secondary)] py-[var(--space-16)] px-[var(--space-6)]"
      >
        <div className="mx-auto max-w-[var(--grid-max-width)]">
          <SectionHeader
            eyebrow={fuelCycleSection.eyebrow}
            title={fuelCycleSection.title}
            id="fuel-cycle-title"
            variant="light"
          />

          <SectionSummary
            items={fuelCycleSummary}
            className="max-w-[760px] gap-y-[var(--space-6)] xl:grid-cols-1"
          />

          <div className="mt-[var(--space-8)]">
            <ExhibitImage
              src="/assets/images/fuel_cycle.webp"
              alt="Diagram of the nuclear fuel cycle: Mining and Milling, Conversion, Enrichment, Fuel Fabrication, Electricity Generation, Spent Fuel Storage, and Waste Disposal arranged in a circular flow around a central label."
              caption="The nuclear fuel cycle — from uranium mining to waste disposal."
              sourceName="IAEA"
              sourceUrl="https://www.iaea.org/newscenter/multimedia/videos/what-is-the-nuclear-fuel-cycle"
              variant="light"
            />
          </div>

          <div className="mt-[var(--space-12)] grid grid-cols-1 gap-[var(--grid-gutter)] md:grid-cols-2 xl:grid-cols-3">
            {fuelCycleSteps.map((step) => (
              <StepCard
                key={step.stepNumber}
                stepNumber={step.stepNumber}
                title={step.title}
                description={step.description}
                accentColor={fuelCycleSection.accentColor}
              />
            ))}
          </div>

          <div className="mt-[var(--space-8)] flex flex-wrap gap-[var(--space-3)]">
            {eiaFuelCycleSource && (
              <SourceBadge
                sourceName="EIA — Nuclear Fuel Cycle"
                sourceUrl={eiaFuelCycleSource.sourceUrl}
              />
            )}
            {iaaeNuclearSource && (
              <SourceBadge
                sourceName="IAEA — Science of Nuclear Power"
                sourceUrl={iaaeNuclearSource.sourceUrl}
              />
            )}
            {eiaNuclearSource && (
              <SourceBadge
                sourceName="EIA — Nuclear Explained"
                sourceUrl={eiaNuclearSource.sourceUrl}
              />
            )}
            {nrcSpentFuelSource && (
              <SourceBadge
                sourceName="NRC — Spent Fuel Storage"
                sourceUrl={nrcSpentFuelSource.sourceUrl}
              />
            )}
          </div>

          {fuelCycleSection.transitionText && (
            <p className="mt-[var(--space-12)] text-[length:var(--font-size-body)] italic text-[var(--color-text-secondary)]">
              {fuelCycleSection.transitionText}
            </p>
          )}
        </div>
      </section>

      {/* ── Future Demand Section ── */}
      <section
        id="future-demand"
        aria-labelledby="future-demand-title"
        className="bg-[var(--color-bg-primary)] py-[var(--space-16)] px-[var(--space-6)]"
      >
        <div className="mx-auto max-w-[var(--grid-max-width)]">
          <SectionHeader
            eyebrow={futureDemandSection.eyebrow}
            title={futureDemandSection.title}
            id="future-demand-title"
            variant="light"
          />

          <div className="mt-[var(--space-8)]">
            <ExhibitImage
              src="/assets/images/3_reactors_future_demand.webp"
              alt="Comparison of three reactor sizes: Large Conventional Reactor at 700+ MW(e) powering cities, Small Modular Reactor up to 300 MW(e) for towns and industrial sites, and Microreactor up to ~10 MW(e) for remote locations."
              caption="Reactor technology at three scales — from large conventional plants to transportable microreactors."
              sourceName="IAEA"
              sourceUrl="https://www.iaea.org/newscenter/news/what-are-small-modular-reactors-smrs"
              variant="light"
            />
          </div>

          <div className="mt-[var(--space-12)] grid grid-cols-1 gap-[var(--space-8)] sm:grid-cols-3">
            {futureDemandStats.map((stat) => (
              <StatCard
                key={stat.label}
                value={stat.value}
                label={stat.label}
                context={stat.context}
                accentColor={futureDemandSection.accentColor}
                variant="light"
              />
            ))}
          </div>

          <div className="mt-[var(--space-8)] flex flex-wrap gap-[var(--space-3)]">
            {deloitteSource && (
              <SourceBadge
                sourceName="Deloitte — Data Center Nuclear"
                sourceUrl={deloitteSource.sourceUrl}
              />
            )}
            {doeSmrSource && (
              <SourceBadge
                sourceName="DOE — Small Modular Reactors"
                sourceUrl={doeSmrSource.sourceUrl}
              />
            )}
          </div>

          {futureDemandSection.transitionText && (
            <p className="mt-[var(--space-12)] text-[length:var(--font-size-body)] italic text-[var(--color-text-secondary)]">
              {futureDemandSection.transitionText}
            </p>
          )}
        </div>
      </section>

      {/* ── Timeline Section ── */}
      <section
        id="timeline"
        aria-labelledby="timeline-title"
        className="bg-[var(--color-bg-dark)] py-[var(--space-16)] px-[var(--space-6)]"
      >
        <div className="mx-auto max-w-[var(--grid-max-width)]">
          <SectionHeader
            eyebrow="History"
            title="The Rise of Nuclear Power"
            id="timeline-title"
            variant="dark"
          />

          <div className="relative mt-[var(--space-12)]">
            {/* Desktop vertical timeline rule */}
            <div className="absolute left-[120px] top-0 bottom-0 hidden w-[2px] bg-[var(--color-accent-cyan)] md:block" />

            <div className="flex flex-col gap-[var(--space-12)]">
              {timelineEntries.map((entry) => (
                <TimelineEntry
                  key={String(entry.year)}
                  year={entry.year}
                  title={entry.title}
                  description={entry.description}
                  variant="dark"
                />
              ))}
            </div>
          </div>

          <div className="mt-[var(--space-12)] flex flex-wrap gap-[var(--space-3)]">
            {iaeaTopicSource && (
              <SourceBadge
                sourceName="IAEA"
                sourceUrl={iaeaTopicSource.sourceUrl}
                variant="dark"
              />
            )}
            {chernobylSource && (
              <SourceBadge
                sourceName="Our World in Data"
                sourceUrl={chernobylSource.sourceUrl}
                variant="dark"
              />
            )}
            {doeSmrSource && (
              <SourceBadge
                sourceName="DOE — Small Modular Reactors"
                sourceUrl={doeSmrSource.sourceUrl}
                variant="dark"
              />
            )}
            {deloitteSource && (
              <SourceBadge
                sourceName="Deloitte"
                sourceUrl={deloitteSource.sourceUrl}
                variant="dark"
              />
            )}
          </div>

          <p className="mt-[var(--space-12)] max-w-[720px] text-[length:var(--font-size-body)] italic leading-relaxed text-[var(--color-text-secondary-on-dark)]">
            {timelineClosingStatement}
          </p>
        </div>
      </section>
    </main>
  );
}
