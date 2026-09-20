# Touchdown Detection

## Key Question
Can a payload pinpoint the exact moment of touchdown from acceleration data
alone, and turn that into a repeatable "how hard did it land" score?

## The Problem
When a payload comes back down, right now the only way to know if the ride
was gentle or rough is to open it up and look, if there's even anything
visible to look at. For fragile cargo (biological samples, electronics,
anything with an integrity requirement) that's not good enough, you want an
automatic, timestamped record of impact severity that travels with the
payload. Commercial suborbital payload customers (biotech, materials
science) already ask this question after every flight, and right now the
honest answer is usually "we're not sure, it looked fine."

## The Idea
Log acceleration continuously through descent and landing. Write an
algorithm that watches for the touchdown signature (a sharp deceleration
spike followed by the vibration settling down) and timestamps that exact
moment. From the peak deceleration, the jerk (rate of change of
acceleration), and how long it takes to settle, compute a single "landing
hardness" score. That score becomes a permanent, automatic cargo integrity
record.

## What The Rocket Flight Tests
A drop test onto a mat gives you one clean, controlled impact. A real
landing is on uneven field terrain, at a final descent rate that depends on
wind and how well the parachute actually opened, and it happens while the
whole rocket airframe is still moving and settling around the payload. You
cannot fake that combination on a bench, and telling a real touchdown apart
from parachute swings or wind gusts on the way down is exactly the hard part
this experiment needs real flight data to test.

## What We Measure
- ADXL375 high-g accelerometer (+-200 g range) at 800 Hz - 1 kHz. This one
  needs the high-g part: a hard landing under a small parachute can spike
  well past 16 g even from a safe descent rate, especially hitting bare
  ground, so the cheap 16 g sensors in the starter kit would clip right at
  the moment that matters most. See [CLAUDE.md](../CLAUDE.md) on this.
- Continuous logging to microSD, with a burst-mode higher rate triggered
  around the detected impact window.

## What Success Looks Like
Success: the algorithm correctly flags the touchdown timestamp (checked
against ground observers/video) and produces a hardness score that tracks
with an independent estimate of descent speed and landing surface.
Failure: it false-triggers on parachute swing or a wind gust, or misses the
real touchdown entirely. That's still a useful result, it tells us
accelerometer-only touchdown detection isn't reliable enough on its own and
you'd need a second signal (like a simple mechanical impact switch) to
confirm it.

## Payload
Small and light, fits easily in the 6 in x 10 in bay. Estimated electronics
weight is around 70-90 g, under the 250 g floor, so add ballast in the
mount/enclosure to clear the minimum.

| Component | Price (approx) |
|---|---|
| Adafruit Feather M0 Adalogger (flight computer + microSD) | $20 |
| ADXL375 high-g accelerometer breakout | $25 |
| microSD card (8-32GB) | $8 |
| 3.7V 500mAh LiPo battery | $9 |
| Enclosure, foam mounting, wiring, ballast mass | $15 |
| **Total** | **~$77** |

Well under $500, leaves room to add a second sensor (see Main Risks) if
budget allows.

## Main Risks
- Telling "touchdown" apart from "hard parachute swing that slams the
  payload against something" or a gust-driven jolt is genuinely hard with
  one accelerometer. This is the core open question of the experiment, not
  a minor detail.
- Sensor orientation matters, if the payload tumbles on landing the impact
  axis isn't predictable, and a single-axis assumption in the algorithm
  would be wrong.
- One flight means one landing surface and one wind condition. A single data
  point can't prove the hardness score generalizes.

## Why It Could Become A Product
A standardized "landing quality" black box is directly useful to any
company or lab flying fragile cargo on rockets or suborbital vehicles (think
biotech payloads on Blue Origin/Up Aerospace-style flights) as an automatic
chain-of-custody and integrity record, instead of relying on visual
inspection after the fact.

## Next Step If It Works
Pair the sensor with a purpose-built shock-mounted cargo tray and run many
landings to see whether the hardness score actually predicts real payload
damage, not just a clean-looking signal.
