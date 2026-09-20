# Vibration Structural Health

## Key Question
Can a single onboard sensor learn what "healthy" airframe vibration looks
like well enough to flag a loosened fastener or damaged structure purely
from how the rocket vibrates in flight?

## The Problem
Fatigue and loosening in reusable rockets, fasteners backing out, early
delamination, fin flutter starting, usually only get caught by eyeballing
the airframe after landing, which misses anything internal or subtle.
Commercial aviation and industrial machinery already use vibration-based
health monitoring to catch faults before they cause failures. Nobody's
brought that cheaply to small or amateur rockets yet, even though the
sensors involved aren't expensive.

## The Idea
Log high-rate vibration through the entire flight, not just descent. Build
a baseline vibration signature from a normal, healthy flight. On a second
flight with one fastener intentionally loosened ahead of time (a safe,
controlled, known fault), see if the vibration signature, especially its
frequency content, is measurably different from the baseline.

## What The Rocket Flight Tests
Real motor-induced vibration plus aerodynamic buffet at real flight speeds
plus how that couples through the actual airframe structure is not
something a bench shaker can reproduce. The combined thrust and aero
vibration environment only exists in an actual flight.

## What We Measure
- ADXL375 high-g accelerometer at 400 Hz - 1 kHz, logging the full flight
  including boost, since g-loads during that phase can be significant and a
  16 g sensor risks clipping right when useful vibration data is happening,
  see [CLAUDE.md](../CLAUDE.md).
- A small piezo contact vibration sensor for higher-frequency structural
  resonance beyond the accelerometer's practical bandwidth.
- Continuous logging to microSD for the whole flight.

## What Success Looks Like
Success: a statistically visible difference (for example a shifted or new
peak in the frequency spectrum) between the healthy-flight signature and the
loosened-fastener flight signature. Failure: no detectable difference, or a
difference that could just as easily be explained by normal flight-to-flight
variation (different wind, different motor batch). That result would teach
that a single accelerometer isn't enough to catch this kind of fault, and
you'd need either more sensors or many more flights to separate real damage
signatures from normal variation.

## Payload
Small and light, fits easily in the 6 in x 10 in bay. Estimated electronics
weight is around 80-100 g, under the 250 g floor. If the accelerometer is
mounted on a metal bracket bolted to the airframe (good practice for solid
vibration coupling anyway), that bracket's mass can double as most of the
needed ballast.

| Component | Price (approx) |
|---|---|
| Adafruit Feather M0 Adalogger (flight computer + microSD) | $20 |
| ADXL375 high-g accelerometer breakout | $25 |
| Piezo contact vibration sensor | $8 |
| microSD card (8-32GB) | $8 |
| 3.7V 500mAh LiPo battery | $9 |
| Metal mounting bracket, wiring, hardware | $15 |
| **Total** | **~$85** |

Well under $500.

## Main Risks
- Biggest honest weakness: this competition likely gives one flight. Baseline
  ("healthy") and fault ("loosened fastener") signatures would have to come
  from two separate flights, which means differences could just as easily be
  wind, motor batch variation, or mounting differences rather than the
  fastener at all. A one-flight-vs-one-flight comparison is a genuinely weak
  statistical setup, this is the core limitation of the whole idea and
  should be stated plainly, not buried.
- A single sensor location might just miss a fault that shows up somewhere
  else on the airframe.
- Intentionally loosening a fastener before flight needs to be done
  carefully so it doesn't turn into an actual safety issue, this should be a
  small, non-critical fastener, not anything load-bearing for recovery.

## Why It Could Become A Product
Cheap vibration-based structural health monitoring is directly useful to
reusable and multi-flight amateur/university rockets, and the same idea
scales toward the kind of vibration monitoring already standard on aircraft
engines and industrial equipment, just at hobby-rocket cost.

## Next Step If It Works
Fly the same airframe repeatedly over its service life to build a real
baseline-and-drift dataset across many flights, instead of comparing just
one healthy flight to one deliberately-faulted flight.
