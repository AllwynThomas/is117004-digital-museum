import { exhibitData } from "@/lib/exhibit-data";

interface SourceCategory {
  label: string;
  sourceIds: string[];
}

const SOURCE_CATEGORIES: SourceCategory[] = [
  {
    label: "Government & Regulatory",
    sourceIds: [
      "nrc_pwr_overview",
      "nrc_spent_fuel_storage",
      "doe_nuclear_101",
      "doe_smr_overview",
      "eia_nuclear_fuel_cycle",
      "eia_nuclear_explained",
    ],
  },
  {
    label: "Data & Research",
    sourceIds: [
      "safest_cleanest_sources_chart",
      "ourworldindata_chernobyl_fukushima",
      "iaea_nuclear_power_topic",
      "iaea_science_of_nuclear_power",
      "iaea_clean_energy_pdf",
      "iaea_smart_stable_reliable",
    ],
  },
  {
    label: "Industry Analysis",
    sourceIds: ["deloitte_data_center_nuclear"],
  },
  {
    label: "Media",
    sourceIds: ["uranium_vs_fossil_fuels_diagram", "nuclearplant_animation"],
  },
];

const IMAGE_CREDITS = [
  {
    description: "Energy density comparison diagram",
    credit: "Visual Capitalist",
  },
  {
    description: "Safest and cleanest sources of energy chart",
    credit: "Our World in Data",
  },
  {
    description: "How a nuclear reactor works animation",
    credit: "Nuclear Energy Institute (NEI)",
  },
];

export function SiteFooter() {
  function getSource(id: string) {
    return exhibitData.sources.find((s) => s.id === id);
  }

  return (
    <footer className="bg-[var(--color-bg-dark)] py-[var(--space-16)] px-[var(--space-6)]">
      <div className="mx-auto max-w-[var(--grid-max-width)]">
        <h2
          className="font-bold text-[var(--color-text-on-dark)]"
          style={{ fontSize: "var(--font-size-section)", marginBottom: "var(--space-4)" }}
        >
          Sources and Attribution
        </h2>

        <p
          className="text-[var(--color-text-secondary-on-dark)] italic mb-[var(--space-12)]"
          style={{ fontSize: "var(--font-size-body)" }}
        >
          We showed you the evidence. Here is where to verify it yourself.
        </p>

        <div className="grid grid-cols-1 gap-[var(--space-12)] md:grid-cols-2">
          {SOURCE_CATEGORIES.map((category) => (
            <div key={category.label}>
              <h3
                className="font-bold text-[var(--color-text-on-dark)] mb-[var(--space-4)]"
                style={{ fontSize: "var(--font-size-sub)" }}
              >
                {category.label}
              </h3>
              <ul className="list-none m-0 p-0 flex flex-col gap-[var(--space-4)]">
                {category.sourceIds.map((id) => {
                  const source = getSource(id);
                  if (!source) return null;
                  return (
                    <li key={id}>
                      <a
                        href={source.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--color-accent-cyan)] no-underline hover:underline"
                        style={{ fontSize: "var(--font-size-body)" }}
                      >
                        {source.title}
                      </a>
                      <p
                        className="text-[var(--color-text-secondary-on-dark)] mt-[var(--space-1)]"
                        style={{ fontSize: "var(--font-size-caption)" }}
                      >
                        {source.recommendedUse}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Visual asset credits */}
        <div
          className="border-t border-[var(--color-surface-rule)] mt-[var(--space-12)] pt-[var(--space-8)]"
        >
          <h3
            className="font-bold text-[var(--color-text-on-dark)] mb-[var(--space-4)]"
            style={{ fontSize: "var(--font-size-sub)" }}
          >
            Visual Asset Credits
          </h3>
          <ul className="list-none m-0 p-0 flex flex-col gap-[var(--space-3)]">
            {IMAGE_CREDITS.map((credit) => (
              <li
                key={credit.description}
                className="text-[var(--color-text-secondary-on-dark)]"
                style={{ fontSize: "var(--font-size-caption)" }}
              >
                {credit.description} — {credit.credit}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
