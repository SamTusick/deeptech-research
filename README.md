# FGCU Rocket Payload Challenge - Research Workspace

Research workspace for the FGCU Rocket Payload Challenge, Fall 2026. See
[CLAUDE.md](CLAUDE.md) for the full competition constraints, hardware on
hand, and writing rules this repo follows.

## Idea index

| Idea | Summary | Key Question | Rough Cost | Feasibility | Link |
|---|---|---|---|---|---|
| Landing Point Prediction | Dead-reckon a landing point from IMU + baro only, GPS logged as ground truth, never steers | Can IMU-only dead reckoning predict touchdown point during descent without GPS? | ~$92 | Medium | [payload_ideas/landing-point-prediction.md](payload_ideas/landing-point-prediction.md) |
| Touchdown Detection | Detect the exact landing moment and score impact hardness for cargo integrity | Can accel data alone pinpoint touchdown and score how hard it was? | ~$77 | Medium | [payload_ideas/touchdown-detection.md](payload_ideas/touchdown-detection.md) |
| Air Quality Profiling | PM + gas sensors log how pollution stratifies from ground to 5000 ft | Does pollution change measurably with altitude across one flight? | ~$121 | Low-Medium | [payload_ideas/air-quality-profiling.md](payload_ideas/air-quality-profiling.md) |
| Clipped Sensor Recovery | Fuse two saturated 16g accelerometers to reconstruct true launch acceleration, checked against an ADXL375 | Can two clipped 16g sensors reconstruct a true high-g signal? | ~$91 | Medium | [payload_ideas/clipped-sensor-recovery.md](payload_ideas/clipped-sensor-recovery.md) |
| Vibration Structural Health | Learn a healthy airframe's vibration signature, try to detect a loosened fastener from vibration alone | Can one sensor flag a loosened fastener from in-flight vibration? | ~$85 | Low-Medium | [payload_ideas/vibration-structural-health.md](payload_ideas/vibration-structural-health.md) |
| ML Safe Landing | Run a terrain-safety model live on a Pi during descent, classifying ground as safe or unsafe from camera frames | Can a model trained before flight classify terrain in real time on the payload during a real descent? | ~$355 | Low-Medium | [payload_ideas/ml_safe_landing.md](payload_ideas/ml_safe_landing.md) |

Feasibility is a rough read on build risk and whether the physics/sensors
are likely to actually work in 5 weeks, not a judging score. See each file's
Main Risks section for why.

See [decisions.md](decisions.md) for ideas that get cut and why.
