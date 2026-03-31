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
  timelineClosingStatement: string;
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
    {
      id: "fuel-cycle",
      title: "From Uranium to Electricity",
      eyebrow: "The Full Journey",
      lede: "Nuclear fuel follows one of the most carefully regulated industrial lifecycles of any energy source — from the mine to the reactor and into long-term storage.",
      bodyContent:
        "Understanding the nuclear fuel cycle removes much of the mystery around nuclear energy. Each stage — mining, enrichment, fabrication, reactor operation, and storage — is governed by strict international and domestic regulations. The result is a tightly controlled process that converts a naturally occurring element into carbon-free electricity at industrial scale.",
      sourceIds: [
        "eia_nuclear_fuel_cycle",
        "iaea_science_of_nuclear_power",
        "eia_nuclear_explained",
        "nrc_spent_fuel_storage",
      ],
      accentColor: "--color-accent-amber",
      transitionText:
        "With this lifecycle in view, the question becomes: where is nuclear energy headed next?",
    },
    {
      id: "future-demand",
      title: "Powering AI and the Future Grid",
      eyebrow: "Looking Ahead",
      lede: "As electricity demand accelerates — driven by AI data centers and widespread electrification — nuclear energy offers a proven, scalable, carbon-free answer.",
      bodyContent:
        "AI data centers are emerging as one of the fastest-growing sources of electricity demand. According to Deloitte analysis, data center power consumption is growing at roughly 30% per year and could account for up to 8% of total U.S. electricity by 2030. These facilities require round-the-clock, high-density, low-carbon electricity — precisely the profile nuclear delivers. Small Modular Reactors (SMRs) represent the next generation of nuclear technology: compact, factory-built, and designed for flexible deployment near demand centers. With scalable capacity additions and shorter construction timelines, SMRs are positioned to meet the energy needs of an increasingly electrified future.",
      sourceIds: [
        "deloitte_data_center_nuclear",
        "doe_smr_overview",
        "iaea_smart_stable_reliable",
      ],
      accentColor: "--color-accent-blue",
      transitionText:
        "Nuclear power is not new. It has been growing for eight decades. Here is how it became a global energy source.",
    },
    {
      id: "timeline",
      title: "The Rise of Nuclear Power",
      eyebrow: "History",
      lede: "",
      bodyContent: "",
      sourceIds: [
        "iaea_nuclear_power_topic",
        "ourworldindata_chernobyl_fukushima",
        "doe_smr_overview",
        "deloitte_data_center_nuclear",
      ],
      accentColor: "--color-accent-cyan",
    },
  ],
  timelineEntries: [
    {
      year: 1942,
      title: "Chicago Pile-1",
      description:
        "First controlled nuclear chain reaction, achieved by Enrico Fermi's team at the University of Chicago. Proved that sustained fission was possible.",
      sourceIds: ["iaea_nuclear_power_topic"],
    },
    {
      year: 1954,
      title: "Obninsk, USSR",
      description:
        "First nuclear power plant connected to an electrical grid. A 5-megawatt reactor demonstrated that nuclear fission could generate usable electricity.",
      sourceIds: ["iaea_nuclear_power_topic"],
    },
    {
      year: 1957,
      title: "Shippingport, Pennsylvania",
      description:
        "First full-scale commercial nuclear power plant in the United States. Operated for 25 years, proving the viability of civilian nuclear power.",
      sourceIds: ["iaea_nuclear_power_topic"],
    },
    {
      year: 1979,
      title: "Three Mile Island",
      description:
        "Partial meltdown of a reactor in Pennsylvania. No deaths resulted. The accident led to sweeping safety reforms across the U.S. nuclear industry.",
      sourceIds: ["ourworldindata_chernobyl_fukushima"],
    },
    {
      year: 1986,
      title: "Chernobyl",
      description:
        "Worst nuclear accident in history, caused by design flaws and operator errors during a safety test. Led to a global overhaul of nuclear safety standards and reactor design.",
      sourceIds: ["ourworldindata_chernobyl_fukushima"],
    },
    {
      year: 2011,
      title: "Fukushima Daiichi",
      description:
        "Tsunami-caused meltdowns at three reactors in Japan. Zero deaths from radiation exposure. The accident prompted worldwide safety reviews and reinforced the importance of natural-disaster preparedness in plant design.",
      sourceIds: ["ourworldindata_chernobyl_fukushima"],
    },
    {
      year: "2020s",
      title: "Nuclear Renaissance",
      description:
        "Small Modular Reactors enter the licensing pipeline. AI data center demand drives renewed investment. Net-zero commitments bring nuclear back to the center of energy planning worldwide.",
      sourceIds: ["doe_smr_overview", "deloitte_data_center_nuclear"],
    },
  ],
  timelineClosingStatement:
    "Nuclear energy is not a hypothetical. It is a proven, global-scale, low-carbon power source — and the evidence is here for you to verify.",
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
    "fuel-cycle": [
      {
        stepNumber: 1,
        title: "Mining & Milling",
        description:
          "Uranium ore is extracted from the earth and processed into uranium oxide concentrate, known as yellowcake.",
      },
      {
        stepNumber: 2,
        title: "Conversion & Enrichment",
        description:
          "Yellowcake is converted to uranium hexafluoride gas and enriched to increase the concentration of fissile U-235 from about 0.7% to 3–5%.",
      },
      {
        stepNumber: 3,
        title: "Fuel Fabrication",
        description:
          "Enriched uranium is formed into small ceramic pellets, stacked into metal fuel rods, and assembled into fuel bundles ready for the reactor.",
      },
      {
        stepNumber: 4,
        title: "Reactor Operation",
        description:
          "Fuel assemblies are loaded into the reactor core, where controlled fission generates heat that produces electricity through the steam-turbine cycle.",
      },
      {
        stepNumber: 5,
        title: "Storage & Disposal",
        description:
          "Spent fuel is first cooled in water pools at the reactor site, then transferred to dry cask storage — robust concrete and steel containers designed for decades of safe containment.",
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
    "future-demand": [
      {
        value: "~30%",
        label: "Annual Growth",
        context:
          "Data center power demand is increasing at roughly 30% per year",
        sourceId: "deloitte_data_center_nuclear",
      },
      {
        value: "24/7",
        label: "Carbon-Free Power",
        context:
          "Data centers require round-the-clock, high-density, low-carbon electricity — precisely the profile nuclear delivers",
        sourceId: "deloitte_data_center_nuclear",
      },
      {
        value: "SMRs",
        label: "Small Modular Reactors",
        context:
          "Flexible, scalable, factory-built reactors designed for incremental capacity additions. Deployed near demand centers.",
        sourceId: "doe_smr_overview",
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
      id: "iaea_nuclear_power_topic",
      type: "topic_overview",
      title: "What is Nuclear Energy? The Science of Nuclear Power",
      sourceUrl:
        "https://www.iaea.org/newscenter/news/what-is-nuclear-energy-the-science-of-nuclear-power",
      recommendedUse:
        "General historical and policy context for nuclear power development, plus projections to 2050.",
      notes:
        "Replaces former /topics/nuclear-power page. Covers fission, fuel cycle, waste, and climate.",
      licenseNote: "Verify reuse permission before publication.",
    },
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
    {
      id: "eia_nuclear_fuel_cycle",
      type: "educational_page",
      title: "The nuclear fuel cycle",
      sourceUrl:
        "https://www.eia.gov/energyexplained/nuclear/the-nuclear-fuel-cycle.php",
      recommendedUse:
        "Explain uranium mining, enrichment, fuel use, and spent fuel handling.",
      notes: "Helpful for a lifecycle or fuel-cycle section.",
      licenseNote:
        "Public agency source; generally suitable for citation and reference.",
    },
    {
      id: "deloitte_data_center_nuclear",
      type: "industry_analysis",
      title: "Nuclear energy's role in powering data center growth",
      sourceUrl:
        "https://www.deloitte.com/us/en/insights/industry/power-and-utilities/nuclear-energy-powering-data-centers.html",
      recommendedUse:
        "Support a future-demand section focused on AI data centers and round-the-clock electricity needs.",
      notes:
        "Use as a current industry perspective, not as a primary technical source.",
      licenseNote: "Verify reuse permission before publication.",
    },
    {
      id: "doe_smr_overview",
      type: "reference_page",
      title: "Advanced Small Modular Reactors (SMRs)",
      sourceUrl: "https://www.energy.gov/ne/small-modular-reactors",
      recommendedUse:
        "Introduce next-generation reactor technology: smaller footprint, flexible siting, incremental capacity additions.",
      notes:
        "Covers NuScale design approval, DOE R&D program, and deployment timeline.",
      licenseNote:
        "Public agency source; suitable for citation and reference.",
    },
  ],
};
