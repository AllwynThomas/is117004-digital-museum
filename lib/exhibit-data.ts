export interface Source {
  id: string;
  type: string;
  title: string;
  sourceUrl: string;
  recommendedUse: string;
  notes: string;
  licenseNote: string;
}

export interface ExhibitSection {
  id: string;
  title: string;
  eyebrow: string;
  lede: string;
  bodyContent: string;
  sourceIds: string[];
  accentColor: string;
  transitionText?: string;
}

export interface TimelineEntry {
  year: number | string;
  title: string;
  description: string;
  sourceIds: string[];
}

export interface ProcessStep {
  stepNumber: number;
  title: string;
  description: string;
  icon?: string;
}

export interface StatCard {
  value: string;
  label: string;
  context: string;
  sourceId: string;
}

export interface ComparisonItem {
  label: string;
  value: string;
  unit?: string;
}

export interface ComparisonData {
  title: string;
  items: ComparisonItem[];
  sourceId: string;
}

export interface ExhibitData {
  sections: ExhibitSection[];
  timelineEntries: TimelineEntry[];
  processSteps: Record<string, ProcessStep[]>;
  statCards: Record<string, StatCard[]>;
  comparisonData: Record<string, ComparisonData[]>;
  sources: Source[];
}

export const exhibitData: ExhibitData = {
  sections: [
    {
      id: "hero",
      title: "The Power of Nuclear Energy",
      eyebrow: "Exhibit Opening",
      lede: "What if one fuel pellet could replace a ton of coal?",
      bodyContent:
        "Nuclear energy is one of the most powerful and reliable sources of electricity on Earth. A single uranium fuel pellet — roughly the size of a gummy bear — contains as much energy as one ton of coal, 17,000 cubic feet of natural gas, or 149 gallons of oil. Today, more than 440 reactors operate across 32 countries, generating roughly 10% of the world's electricity around the clock, with near-zero carbon emissions.",
      sourceIds: ["uranium_vs_fossil_fuels_diagram"],
      accentColor: "--color-accent-cyan",
      transitionText:
        "To understand why that pellet is so powerful, you need to see what happens inside a reactor.",
    },
    {
      id: "how-it-works",
      title: "How a Reactor Makes Electricity",
      eyebrow: "Inside the Reactor",
      lede: "A pressurized water reactor converts the heat from splitting uranium atoms into the steam that spins a turbine and generates electricity — all in a closed, continuously recycling loop.",
      bodyContent:
        "Most of the world's nuclear plants use pressurized water reactors (PWRs). The process is elegantly simple: split atoms to make heat, use heat to make steam, use steam to spin a turbine, and the generator converts that motion into electricity. The water that absorbs the heat never leaves the reactor building — it transfers energy through a steam generator to a separate water loop, adding an extra layer of safety.",
      sourceIds: [
        "nuclearplant_animation",
        "nrc_pwr_overview",
        "doe_nuclear_101",
      ],
      accentColor: "--color-accent-blue",
      transitionText:
        "Now that you see how the energy is made, here is how it compares with every other source.",
    },
    {
      id: "benefits",
      title: "Why Nuclear Beats Fossil Fuels",
      eyebrow: "The Evidence",
      lede: "When measured by deaths per unit of energy, greenhouse gas emissions per kilowatt-hour, and capacity factor, nuclear power consistently ranks among the safest and cleanest sources of electricity available today.",
      bodyContent:
        "The chart below compares deaths and greenhouse gas emissions across major energy sources. Nuclear energy produces lifecycle CO₂ emissions comparable to wind and solar, while maintaining the highest capacity factor of any source — meaning plants generate electricity more than 93% of the time. Per unit of energy produced, nuclear has the lowest death rate of any major source, including wind, solar, and hydropower.",
      sourceIds: [
        "safest_cleanest_sources_chart",
        "iaea_clean_energy_pdf",
        "iaea_smart_stable_reliable",
      ],
      accentColor: "--color-accent-green",
      transitionText:
        "If the safety record is this strong, why do accidents dominate the public conversation?",
    },
    {
      id: "safety",
      title: "Addressing Nuclear Safety and Waste",
      eyebrow: "Honest Context",
      lede: "Nuclear energy has the lowest death rate per unit of electricity generated of any major energy source, according to peer-reviewed research compiled by Our World in Data.",
      bodyContent:
        "The two most serious accidents in civilian nuclear history — Chernobyl (1986) and Fukushima (2011) — resulted in estimated death tolls of approximately 4,000 (WHO long-term projection for Chernobyl, including future cancer deaths) and one confirmed radiation fatality at Fukushima. Even including these events, nuclear energy causes 0.03 deaths per terawatt-hour of electricity produced, compared to 24.6 for coal, 18.4 for oil, and 2.8 for natural gas. Routine fossil-fuel combustion kills far more people every year through air pollution than all nuclear accidents in history combined. Nuclear waste, often cited as an unsolved problem, is better described as a managed engineering challenge: all U.S. spent fuel from more than 60 years of commercial reactor operation would fit on a single football field, stacked less than 10 yards high. Spent fuel is stored securely in steel-lined concrete pools and dry cask systems under continuous NRC oversight.",
      sourceIds: [
        "ourworldindata_chernobyl_fukushima",
        "nrc_spent_fuel_storage",
        "safest_cleanest_sources_chart",
      ],
      accentColor: "--color-accent-red",
      transitionText:
        "Nuclear fuel has one of the most carefully managed lifecycles of any energy source. Here is how it works from start to finish.",
    },
  ],
  timelineEntries: [],
  processSteps: {
    "how-it-works": [
      {
        stepNumber: 1,
        title: "Fission → Heat",
        description:
          "Uranium atoms split inside the reactor core, releasing tremendous thermal energy.",
      },
      {
        stepNumber: 2,
        title: "Steam Generation",
        description:
          "The heat boils water into high-pressure steam in the steam generator.",
      },
      {
        stepNumber: 3,
        title: "Turbine & Generator",
        description:
          "High-pressure steam spins the turbine, and the connected generator converts mechanical energy into electricity.",
      },
      {
        stepNumber: 4,
        title: "Cooling & Recycling",
        description:
          "Steam condenses back into water in the cooling system and returns to the steam generator to repeat the cycle.",
      },
    ],
  },
  statCards: {
    hero: [
      {
        value: "440+",
        label: "Operating Reactors",
        context: "Worldwide",
        sourceId: "iaea_science_of_nuclear_power",
      },
      {
        value: "32",
        label: "Countries",
        context: "With nuclear power programs",
        sourceId: "iaea_science_of_nuclear_power",
      },
      {
        value: "~10%",
        label: "Global Electricity",
        context: "From nuclear sources",
        sourceId: "iaea_science_of_nuclear_power",
      },
    ],
    benefits: [
      {
        value: "Low Emissions",
        label: "Lifecycle CO₂",
        context: "Lifecycle CO₂ comparable to wind and solar",
        sourceId: "iaea_clean_energy_pdf",
      },
      {
        value: "~93%",
        label: "Capacity Factor",
        context:
          "Highest of any energy source — nuclear plants run 24/7",
        sourceId: "eia_nuclear_explained",
      },
      {
        value: "Extreme Density",
        label: "Energy per Fuel Unit",
        context:
          "One uranium pellet contains as much energy as one ton of coal",
        sourceId: "uranium_vs_fossil_fuels_diagram",
      },
      {
        value: "Fewest Deaths",
        label: "Deaths per TWh",
        context:
          "Nuclear has the lowest death rate per TWh of any major source",
        sourceId: "safest_cleanest_sources_chart",
      },
    ],
  },
  comparisonData: {
    safety: [
      {
        title: "Deaths per TWh of Electricity Production",
        items: [
          { label: "Nuclear", value: "0.03", unit: "deaths per TWh" },
          { label: "Natural Gas", value: "2.8", unit: "deaths per TWh" },
          { label: "Oil", value: "18.4", unit: "deaths per TWh" },
          { label: "Coal", value: "24.6", unit: "deaths per TWh" },
        ],
        sourceId: "safest_cleanest_sources_chart",
      },
    ],
  },
  sources: [
    {
      id: "uranium_vs_fossil_fuels_diagram",
      type: "image",
      title: "The Power of a Uranium Pellet Compared to Fossil Fuels",
      sourceUrl:
        "https://elements.visualcapitalist.com/the-power-of-a-uranium-pellet/",
      recommendedUse:
        "Illustrate the extraordinary energy density of uranium fuel compared with coal, oil, and gas.",
      notes: "Good hero image for a pro-nuclear opening section.",
      licenseNote: "Verify reuse permission before publication.",
    },
    {
      id: "nuclearplant_animation",
      type: "animation",
      title: "How a Nuclear Reactor Actually Works",
      sourceUrl:
        "https://www.nei.org/fundamentals/how-a-nuclear-reactor-works",
      recommendedUse:
        "Explain reactor heat generation, steam production, turbine rotation, and electricity production.",
      notes:
        "Best simple animation for understanding the core process of PWR reactor.",
      licenseNote: "Verify reuse permission before publication.",
    },
    {
      id: "nrc_pwr_overview",
      type: "reference_page",
      title: "Pressurized Water Reactors",
      sourceUrl: "https://www.nrc.gov/reactors/power/pwrs",
      recommendedUse:
        "Authoritative explanation of how a common reactor type works.",
      notes: "Useful for accurate technical copy and exhibit captions.",
      licenseNote: "Public agency source; verify any graphic reuse terms.",
    },
    {
      id: "doe_nuclear_101",
      type: "educational_page",
      title: "NUCLEAR 101: How Does a Nuclear Reactor Work?",
      sourceUrl:
        "https://www.energy.gov/ne/articles/nuclear-101-how-does-nuclear-reactor-work",
      recommendedUse:
        "Clear, illustrated explanation of how PWR and BWR light-water reactors produce electricity through fission.",
      notes:
        "Includes DOE-produced infographic diagrams of both reactor types.",
      licenseNote: "Public agency source; suitable for citation and reference.",
    },
    {
      id: "iaea_science_of_nuclear_power",
      type: "educational_page",
      title: "What is Nuclear Energy? The Science of Nuclear Power",
      sourceUrl:
        "https://www.iaea.org/newscenter/news/what-is-nuclear-energy-the-science-of-nuclear-power",
      recommendedUse:
        "Comprehensive overview covering fission, reactor operation, fuel cycle, waste management, and nuclear power's role in climate change mitigation.",
      notes:
        "Updated for COP30 (2025). Covers 400+ global reactors and projections to 2050.",
      licenseNote: "Verify reuse permission before publication.",
    },
    {
      id: "safest_cleanest_sources_chart",
      type: "chart",
      title: "What are the safest and cleanest sources of energy?",
      sourceUrl: "https://ourworldindata.org/safest-sources-of-energy",
      recommendedUse:
        "Compare deaths and lifecycle emissions across energy sources.",
      notes:
        "Strong evidence visual for nuclear's safety and climate advantages.",
      licenseNote: "Verify reuse permission before publication.",
    },
    {
      id: "iaea_clean_energy_pdf",
      type: "pdf",
      title: "Nuclear Power: Clean Energy",
      sourceUrl:
        "https://www.iaea.org/sites/default/files/2025-09/cleanenergy_0.pdf",
      recommendedUse:
        "Support high-level claims about nuclear power's low emissions and steady supply.",
      notes: "Good for a concise sustainability section.",
      licenseNote: "Verify reuse permission before publication.",
    },
    {
      id: "iaea_smart_stable_reliable",
      type: "article",
      title: "Smart, stable, reliable",
      sourceUrl: "https://www.iaea.org/bulletin/smart-stable-reliable",
      recommendedUse:
        "Support claims that nuclear can provide stable, low-carbon, 24/7 power and help grids integrate renewables.",
      notes:
        "Especially relevant for reliability and grid stability messaging.",
      licenseNote: "Verify reuse permission before publication.",
    },
    {
      id: "ourworldindata_chernobyl_fukushima",
      type: "data_story",
      title: "What was the death toll from Chernobyl and Fukushima?",
      sourceUrl:
        "https://ourworldindata.org/what-was-the-death-toll-from-chernobyl-and-fukushima",
      recommendedUse:
        "Address the two most well-known nuclear accidents with peer-reviewed, data-driven analysis.",
      notes:
        "Puts accident deaths in context against routine fossil-fuel mortality.",
      licenseNote: "Verify reuse permission before publication.",
    },
    {
      id: "nrc_spent_fuel_storage",
      type: "reference_page",
      title: "Spent Fuel Storage",
      sourceUrl:
        "https://www.nrc.gov/waste/spent-fuel-storage/index.html",
      recommendedUse:
        "Explain how spent nuclear fuel is safely stored and managed after use in a reactor.",
      notes:
        "Authoritative NRC overview of wet and dry storage methods.",
      licenseNote: "Public agency source; verify any graphic reuse terms.",
    },
    {
      id: "eia_nuclear_explained",
      type: "educational_page",
      title: "Nuclear explained",
      sourceUrl: "https://www.eia.gov/energyexplained/nuclear/",
      recommendedUse:
        "Top-level EIA portal for U.S. nuclear energy data.",
      notes:
        "Good general-purpose reference for nuclear capacity factor and generation statistics.",
      licenseNote:
        "Public agency source; generally suitable for citation and reference.",
    },
  ],
};
