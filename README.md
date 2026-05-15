# is117004-digital-museum

Deployed Website: https://allwynthomas.github.io/is117004-digital-museum/

# Orchestration Process

## Research

1. I used 3 sources I found when doing initial research as my baseline. I stored them in `SOURCES.md` with an explanation of the museum's purpose and why the sources are useful.
2. I used these baseline sources and explanation and asked Perplexity AI to research more sources that could be beneficial and stored them in a structured format in `SOURCES.json`.
3. I then used the AI Plan mode in VSCode to review `SOURCES.json` and make any changes, either updating or adding sources, that would improve my website.
4. When expanding on the timeline, I used Google Gemini to search the web for 3 statistics about each of the 7 events in my timeline and also provide a 2 sentence summary with sources.
5. I added this data to `SOURCES.json` and `exhibit-data.ts`.

## Spec Driven Development

1. For each task, I asked the agent to review the reference repo to understand the workflow to improve the website's quality. Each task was also done in a new chat session to prevent the context window from overflowing which could cause drift.
2. I first asked to create a spec based on `SOURCES.json` and my museum idea while ensuring design style, Cialdini's persuasion principles, and brand archetype were all tailored to support nuclear energy generation.
3. Next, the agent did a QA pass to fix any missed issues with the spec.
4. The agent then created 6 detailed sprint documents that were based on the spec.
5. Next, the agent did a QA pass to fix any missed issues with the sprint markdown files.
6. The agent then completed each sprint sequentially following the documentation in the sprint markdown files.
7. Then the agent did a final QA pass for each sprint's implementations.
8. When expanding on the timeline, I used the same steps from 1-7 but asked to create a spec for expanding the timeline section into seperate exhibit pages and the agent created 5 detailed sprint documents based on the training expansion spec.

## Design Style

The Swiss International Style was chosen to effectively convey objective information about nuclear energy production like statistics, facts, and processes in a clear way without distracting the reader with unnecessary clutter.

## Brand Archetype

The Sage was chosen as the brand archetype because of the use of factual statements that dismiss common misconceptions and uneasiness related to nuclear power production safety with evidence from reputable organizations and regulatory agencies.

## Persuasion Principles

- Social proof through global nuclear power adoption increasing with research into new reactor types
- Authority through source links from trustworthy agencies like the NRC/DOE/IAEA
- Scarcity through rising energy demands as datacenters need more energy production
