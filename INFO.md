# FGCU Rocket Payload Challenge - Research Workspace

This repo is Krish's research workspace for the FGCU Rocket Payload Challenge, Fall 2026.
Its job is to help pick a payload idea, stress test it honestly, and get to a 1-3 page
application. It is not the application itself.

## Competition constraints (do not invent others)

- Payload envelope: about 6 in wide x 10 in long.
- Weight: 250 g to 5000 g. Lighter is better, all else equal.
- Flight profile: reaches about 5000 ft, Mach 0.55.
- Funding: $500 development award per selected team. Teams may raise more on
  their own, but the base plan should work inside $500.
- Application: 1 to 3 pages.
- Judging weights: innovation 25%, impact 20%, feasibility 20%,
  experiment quality 15%, simplicity 10%, team and funding 10%.
- Timeline: payload gets delivered late October 2026. That is roughly 5 weeks
  of build time from when an idea is picked.
- Safety disclosure list (flag any idea that touches these): liquids,
  pressurized containers, heaters, powerful batteries, radio transmitters,
  lasers, moving mechanisms, magnets, sharp components, chemicals, and parts
  that move outside the rocket.

If a rule you need isn't listed above and isn't in `site_references/`, say so
instead of guessing. `site_references/` currently has generic branding
images and a list of other university rocketry team websites, not official
challenge rules.

## Hardware on hand

- Arduino Uno, ground prototyping only. It does not fly.
- A generic starter sensor kit (basic sensors, no flight-grade parts).
- No IMU, no barometer, no high-g accelerometer on hand.
- Every sensor that actually flies is a new purchase, funded out of the $500
  award. Never assume a kit part is good enough for flight without checking
  its spec against the flight environment.

### Known gotcha: accelerometer clipping

Cheap IMUs in typical starter kits (MPU6050, ADXL345) saturate around 16 g.
A real launch can exceed that, so any idea that needs clean launch-phase
acceleration data needs a high-g part, specifically an ADXL375 (about $25).
Budget for it up front rather than hoping a 16 g sensor is close enough.
Ideas that only care about descent/landing dynamics (well under 16 g) can
skip this and save the money - say so explicitly when that's the case.

### Default flight computer

Unless an idea has a specific reason not to, prototype and cost ideas around
an Adafruit Feather M0 Adalogger (~$20, built in microSD logging, small and
light). One consistent board across ideas means less firmware to rewrite
between ideas and less to relearn.

### Weight floor

Most sensor payloads built from small breakout boards will land well under
the 250 g minimum. Every idea file should call this out and account for
ballast (denser enclosure, mounting bracket, added mass) to clear the floor
rather than ignoring it.

## Repo structure

- `README.md` - index table of every idea, kept current as ideas are added
  or change status.
- `payload_ideas/<kebab-case-name>.md` - one file per idea, using the
  template below.
- `decisions.md` - running log of ideas that get killed, and why.
- `site_references/` - saved reference material (images, links). Treat as
  the only source of "official" outside info; everything else in this repo
  is analysis, not a source.

## Idea file template

Every file in `payload_ideas/` follows this exact section order:

```
# <Idea Name>
## Key Question
## The Problem
## The Idea
## What The Rocket Flight Tests
## What We Measure
## What Success Looks Like
## Payload
## Main Risks
## Why It Could Become A Product
## Next Step If It Works
```

- **Key Question**: one single yes/no question the flight answers.
- **The Problem**: who hurts today and why, in plain terms.
- **The Idea**: plain language, no jargon.
- **What The Rocket Flight Tests**: why this cannot just be tested on the
  ground (drop tower, shake table, car window, etc).
- **What We Measure**: sensors, sample rates, what gets logged.
- **What Success Looks Like**: concrete pass criteria, and what a failure
  would actually teach us (a failure that teaches nothing is a bad
  experiment).
- **Payload**: size and weight vs the 6x10 in / 250-5000 g limits, plus a
  full bill of materials with real approximate prices, totaling under $500,
  assuming nothing on hand except the Uno for prototyping.
- **Main Risks**: honest. If an idea is weak, say so here, don't bury it.
- **Why It Could Become A Product**: who would pay for this beyond the
  competition.
- **Next Step If It Works**: the follow-on experiment or product step.

## Writing rules

- Short, plain English, casual tone. No em dashes.
- Be honest about weaknesses. A file that only has upside isn't done.
- Every component in a BOM gets a real approximate price. Every payload's
  BOM must total under $500 with nothing assumed on hand (the Uno doesn't
  count, it doesn't fly).
- Flag anything that touches the safety disclosure list, explicitly, by
  name.
- If something isn't in `site_references/` or in the constraints above, say
  "I don't know" instead of guessing. Don't invent competition rules,
  deadlines, or judging details not given here.
- Keep `README.md`'s table in sync any time an idea is added, dropped, or
  meaningfully changed.
