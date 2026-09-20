# Air Quality Profiling

## Key Question
Does measured air pollution (particulates and gas concentration) change in a
consistent way with altitude across a single vertical profile from the
ground to about 5000 ft?

## The Problem
Ground air quality monitors only measure at head height. Understanding how
pollution is layered with altitude, smoke sitting in an inversion layer,
smog trapped below a certain height, matters for public health and
atmospheric science, but getting a fast vertical profile is expensive or
slow. Weather balloons take hours and cost real money per flight. Research
aircraft are very expensive. Drones are capped around 400 ft by FAA rules in
most cases. A rocket can sample ground to 5000 ft in under two minutes for a
few hundred dollars of sensors, if the sensors can actually keep up.

## The Idea
Mount a particulate sensor and a gas sensor in the payload. Sample
continuously through the whole flight, log GPS/barometric altitude
alongside every reading, then afterward plot pollution level against
altitude to look for a real transition, like a smoke layer boundary or a
clean-air layer above the mess near the ground.

## What The Rocket Flight Tests
There's no way to get a real vertical atmospheric profile on the ground,
this is inherently an altitude experiment. The only substitute would be an
actual weather balloon or aircraft flight, which defeats the point of
testing whether a cheap rocket-based approach works at all.

## What We Measure
- Plantower PMS5003 laser particulate sensor (PM1.0/2.5/10), about 1
  reading/second.
- SGP30 gas sensor (VOC / eCO2 equivalent), about 1 reading/second.
- BMP390 barometer for altitude reference, 10 Hz.
- u-blox NEO-6M GPS for altitude cross-check.
- All logged to microSD with a timestamp.

## What Success Looks Like
Success: PM and gas readings show a repeatable, altitude-linked pattern
that also makes physical sense against known local conditions that day
(for example higher near ground, dropping off with altitude on a clear day,
or a distinct layer if there's wildfire smoke around). Failure: readings
are flat, noisy, or don't correlate with altitude at all. That's still a
useful and honestly likely result, it would tell us that commodity sensors
with multi-second response times can't resolve a profile compressed into
under two minutes of flight, which is a real limitation worth knowing before
anyone tries this at larger scale.

## Payload
Fits inside the 6 in x 10 in bay, though the PMS5003 is the biggest single
part at roughly 65 x 40 x 25 mm and needs a clear air path (an intake vent
with a small filter) to the outside. Estimated electronics weight is around
150-200 g, closer to the 250 g floor than the other ideas here but likely
still needs a little added ballast to clear it for sure, weigh the finished
assembly before final ballast decisions.

| Component | Price (approx) |
|---|---|
| Adafruit Feather M0 Adalogger (flight computer + microSD) | $20 |
| Plantower PMS5003 particulate sensor | $28 |
| SGP30 gas sensor breakout | $18 |
| BMP390 barometer breakout | $10 |
| u-blox NEO-6M GPS module + antenna | $18 |
| 3.7V 1200mAh LiPo battery (PMS5003 fan draws ~100mA) | $12 |
| Intake tubing, filter, enclosure, wiring | $15 |
| **Total** | **~$121** |

Well under $500.

## Main Risks
- Biggest honest weakness: the PMS5003's internal fan and multi-second
  response time were designed for slow-moving ambient air, not a fast
  vertical transit through wildly changing pressure and, during boost,
  Mach 0.55 airflow. The sensor may simply not respond fast enough to
  resolve a real profile, this is a real feasibility concern, not a minor
  detail, and should be tested on the ground (car window at speed, or a
  leaf blower rig) before committing to this idea.
- Ram air heating/compression during ascent could make readings near the
  intake unrepresentative of true ambient air.
- Only one flight means one weather condition, no way to know from a single
  flight whether a result is a real atmospheric feature or a one-off.

## Why It Could Become A Product
A cheap, fast vertical air-quality profiling service would be useful to
wildfire smoke researchers and public health groups who currently rely on
slow, expensive balloon sondes. Rapid repeatable profiles during smoke
events would be genuinely valuable if the sensor response time problem can
be solved.

## Next Step If It Works
Partner with an atmospheric science group to fly repeated profiles across
smoke and no-smoke days, and see if the profile shape is consistent enough
to be scientifically useful, not just a one-off interesting chart.
