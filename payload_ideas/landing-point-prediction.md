# Landing Point Prediction

## Key Question
Can a dead-reckoning algorithm, using only an onboard IMU and barometer
(no GPS feeding the math), predict where the payload will land, logged live
during descent?

## The Problem
Recovery teams lose GPS lock all the time: dense tree cover, the payload
lands upside down with the antenna against the ground, or the receiver just
never gets a fix before landing. When that happens, the team is walking a
field for hours or the payload is gone for good. The same problem shows up
anywhere GPS can't be trusted: dense terrain, jammed signals, indoor or
below-canopy operation. Drones and munitions already use dead reckoning as a
GPS backup. Amateur rocketry mostly doesn't, because nobody's tested whether
cheap sensors are good enough.

## The Idea
Put an accelerometer, gyro, and barometer on the payload. During descent,
never look at GPS in the math, just integrate acceleration and rotation to
track motion, and use barometric altitude to know how much longer until
touchdown. Continuously update a predicted landing point and log it, timestamped, the whole way down. Separately, log real GPS position purely
as an outside referee, never fed into the prediction. After the flight,
compare predicted landing point to actual landing point to see how close
dead reckoning gets, and how the error grows over time.

## What The Rocket Flight Tests
Dead reckoning drift depends on real vibration, real parachute swing, and
real sensor noise under actual flight conditions, none of which a bench test
reproduces. A shake table doesn't swing on a shroud line, and a drop off a
ladder doesn't last long enough to show how error accumulates over a minute
or more of real descent. The only way to know if this drifts too much to be
useful is to fly it.

## What We Measure
- MPU9250 9-DOF IMU (accelerometer, gyro, magnetometer) at 50-100 Hz.
- BMP390 barometer for altitude, same rate.
- u-blox NEO-6M GPS module, logged only as ground truth, never used by the
  prediction algorithm.
- All of it timestamped to microSD via the flight computer.

Note: this idea only needs to reckon position during descent, which stays
under a few g. That means the 16 g clipping issue in [CLAUDE.md](../CLAUDE.md)
doesn't apply here and an ADXL375 isn't needed, which keeps this one cheap.

## What Success Looks Like
Success: the live predicted landing point lands within roughly 50-100 m of
the actual GPS-logged landing point, and the error grows in a
predictable, boundable way rather than blowing up randomly.
Failure: predicted point is off by hundreds of meters or the error is
wildly inconsistent flight to flight. That's still useful, it tells us
dead reckoning alone isn't a viable GPS backup for this class of payload and
sensors, and that you'd need a better IMU or a different approach (like
periodic partial GPS fixes) to make it work.

## Payload
Fits easily in the 6 in x 10 in bay, all components are small breakout
boards. Estimated electronics weight is roughly 60-90 g, which is under the
250 g floor, so the enclosure/mount needs to add ballast mass (thicker
3D-printed shell, small added weight) to clear the minimum.

| Component | Price (approx) |
|---|---|
| Adafruit Feather M0 Adalogger (flight computer + microSD) | $20 |
| MPU9250 9-DOF IMU breakout | $12 |
| BMP390 barometer breakout | $10 |
| u-blox NEO-6M GPS module + antenna | $18 |
| 3.7V 500mAh LiPo battery | $9 |
| microSD card (8-32GB) | $8 |
| Enclosure, standoffs, wiring, ballast mass | $15 |
| **Total** | **~$92** |

Well under the $500 award, leaves budget for a spare sensor set or a second
build/test cycle.

## Main Risks
- Dead reckoning fundamentally drifts. Integrating noisy acceleration twice
  to get position is known to accumulate error fast, this might just not
  work well enough over a minute-plus descent, and that's a real possibility,
  not just a rare failure mode.
- Magnetometer heading can get thrown off by metal in the rocket airframe.
- GPS ground truth itself might not get a fix in time if it's swinging under
  a parachute, which would make grading the prediction harder.
- This idea logs a predicted command but steers nothing. It's honest data
  collection, not a demonstrated capability, so "impact" in judging rests on
  how convincing the accuracy numbers are, not on a physical result like a
  successful guided landing.

## Why It Could Become A Product
GPS-denied dead reckoning for recovery is directly useful to any team that
flies over trees or in areas with weak GPS coverage. The same core
tech (IMU-based position estimation without GPS) is a real building block
for drone and small-UAV backup navigation, which is a much bigger market
than rocketry recovery alone.

## Next Step If It Works
Build a version that actually commands a steerable recovery system (steerable
parafoil or toggled spill panels) using the same dead-reckoning estimate,
and fly it to see if it can actually reduce landing dispersion, not just
predict it.
