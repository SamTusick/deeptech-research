# Clipped Sensor Recovery

## Key Question
Can two cheap 16 g accelerometers, fused together in software, reconstruct
a true high-g signal close to what an actual high-g accelerometer records?

## The Problem
Student and hobby rocketry teams usually already own cheap starter-kit
accelerometers (MPU6050, ADXL345 class parts) that saturate around 16 g,
which is exactly the range a launch can exceed, see the gotcha in
[CLAUDE.md](../CLAUDE.md). Every payload that wants real launch acceleration
data ends up needing a $25+ high-g part. If a fusion trick across two cheap
sensors could get close enough to the real signal, teams could reuse
hardware they already have instead of buying a new high-g sensor for every
payload. That's a real cost problem for any team running multiple flights
or multiple payloads a year.

## The Idea
Mount two 16 g accelerometers on the payload at different orientations (or
different configured sensitivity), so when one axis clips on one sensor,
the other sensor or another axis is still in range. Use that overlap plus
the shape of the unclipped parts of the signal to estimate what the true
peak probably was. Fly a genuine ADXL375 (+-200 g) alongside them as ground
truth, so after the flight you can directly compare the reconstructed
estimate to the real signal and see how close it actually gets.

## What The Rocket Flight Tests
A real motor's thrust curve, ignition kick, and structural vibration during
boost is a specific, fast waveform that's hard to fake with a drop test or a
bench shaker. Reconstructing a clipped signal only matters for exactly this
kind of event, so the test has to be a real launch to mean anything.

## What We Measure
- Two 16 g accelerometers (MPU6050 or ADXL345 class), mounted at different
  orientations, logged at 800 Hz - 1 kHz to catch the fast peak.
- One ADXL375 high-g accelerometer (+-200 g), same rate, as ground truth.
- All three logged together, same timestamp base, to microSD.

## What Success Looks Like
Success: the reconstructed peak acceleration from the two clipped sensors
lands within roughly 20% of what the ADXL375 actually recorded across the
launch. Failure: the reconstruction is far off or inconsistent. Worth being
upfront that this could genuinely fail, once a signal clips, real
information is lost, and there's a real chance no amount of software
cleverness gets it back reliably. That's still a useful and honest result,
either way it settles whether this trick is worth teams' time.

## Payload
Small and light, fits easily in the 6 in x 10 in bay. Estimated electronics
weight is around 70-90 g, under the 250 g floor, add ballast in the mount to
clear the minimum.

| Component | Price (approx) |
|---|---|
| Adafruit Feather M0 Adalogger (flight computer + microSD) | $20 |
| MPU6050 accelerometer/gyro breakout #1 | $6 |
| ADXL345 accelerometer breakout #2 | $8 |
| ADXL375 high-g accelerometer (ground truth) | $25 |
| microSD card (8-32GB) | $8 |
| 3.7V 500mAh LiPo battery | $9 |
| Enclosure, standoffs, wiring, ballast mass | $15 |
| **Total** | **~$91** |

Well under $500.

## Main Risks
- Honest core risk: clipping destroys information, and reconstruction from
  clipped data is a known hard, sometimes lossy problem. This might just not
  work well, and that's a legitimate outcome, not a sign the experiment was
  badly designed.
- Mounting misalignment between the two cheap sensors adds error that's hard
  to separate from clipping-recovery error.
- High sample rate (800 Hz+) on three sensors at once is a real data
  throughput and microSD write-speed concern, needs bench testing before
  flight to make sure nothing drops.

## Why It Could Become A Product
If it works, this becomes a free firmware/algorithm library other CanSat and
university rocketry teams could apply to accelerometers they already own,
instead of budgeting for a high-g part on every payload. Ironically this
build still needs to buy the ADXL375 once, to prove the method works, so
other teams don't have to.

## Next Step If It Works
Publish the reconstruction algorithm as an open library, and test it against
a few different motor thrust curves (not just one) to see how well it
generalizes beyond this one flight's specific acceleration profile.
