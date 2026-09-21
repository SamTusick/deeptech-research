# Real-Time Landing Site Detection with Machine Learning

**FGCU Rocket Payload Challenge | Fall 2026 Application**
**Team:** [Team name]

---

## 1. Our Team

| Name                | Major                | Role |
| ------------------- | -------------------- | ---- |
| Samuel Tusick       | Software Engineering |      |
| Ishita Chakkalakkal | Software Engineering |      |
| Krish Shah          | Software Engineering |      |

Our team is strong in software and AI and has prior Arduino experience. Raspberry Pi and camera work are newer to us, so we plan to start hardware testing as soon as we are selected.

---

## 2. The Problem

When a spacecraft arrives at a surface no one has mapped, such as a distant moon, a planet, or a planet-like body, it has to land without GPS, without detailed maps of the exact spot, and without help from Earth. Radio delay makes live control impractical at the distances of our own solar system and impossible beyond it, so the lander must look at the ground and decide for itself where it is safe to touch down. The same need exists on Earth: an emergency landing over unfamiliar terrain, or a drone entering a disaster zone where no current maps exist.

Today's approaches depend on prior data or on measuring shape. NASA's TRN(Terrain Relative Navigation) compares camera images to maps made by earlier orbiters, and NASA's SPLICE program uses lidar to detect hazards like steep slopes and boulders. Methods based on geometry alone do not identify what the ground is made of, and a flat surface of water or ice can look safe to them. A machine learning model trained on many examples of terrain could recognize such surfaces directly, including terrain no one has mapped.

---

## 3. Our Idea

We will train a machine learning model before flight to label ground as **safe** (open, flat ground) or **unsafe** (water, trees, buildings, roads), and test it on held-out imagery first. During the rocket's parachute descent, the payload will run that model live onboard on camera frames, predicting terrain safety in real time while also saving every frame and sensor reading.

That gives us two things: a real test of real-time prediction on flight hardware during an actual descent, and a new dataset collected in real conditions to keep improving the model.

We are not claiming to be the first to apply machine learning to landing. We want to learn whether a model trained before flight can do this job in real time under real flight conditions, and what it takes to make that work.

--

## 4. The Experiment

**Riskiest assumption:** A model trained before flight will run fast enough on the payload, and stay accurate on real descent imagery, which has motion, blur, changing altitude, and lighting that a ground test cannot fully reproduce.

**Key question:** Can a machine learning model trained before flight run in real time on the payload during a real descent and correctly classify the terrain beneath it?

**What we measure:**

- **Before flight:** accuracy on held-out test imagery that includes both safe and unsafe terrain
- **In flight, speed:** predictions per second and delay per prediction, and whether the system keeps running through vibration, heat, and power draw
- **In flight, accuracy:** how often live predictions match our hand-labeled frames, especially false alarms on safe ground
- **Consistency:** live predictions compared with the same model re-run offline on the saved frames
- **Image quality and orientation:** from the camera and IMU, so we know when the camera can see the ground

**About our launch site:** The launch area is expected to be mostly safe ground. That means the flight mainly tests real-time performance and false alarms on safe terrain, and collects real descent data. Testing detection of unsafe terrain continues before and after the flight, using held-out aerial imagery and further data collection over unsafe areas such as water, trees, and buildings. If the descent view includes any of those, we will score them too.

**What counts as success:** We will set final targets after ground testing. Initial goals are at least 1 to 2 predictions per second in flight and at least 80% pixel accuracy on labeled test frames. We will report the result either way. If the model falls short, we will document why: speed, blur, viewing angle, unfamiliar terrain, or lighting. That is still a valid answer.

**Why we need the flight:** Real descent conditions cannot be fully recreated on the ground, and the flight gives us honest real-time results and real data.

**Stretch goals:** Compare the model's "safe" areas against public elevation data to see what it misses, such as slope, and retrain using the frames we collect.

---

## 5. The Payload

```
Camera ------------\
IMU (high-g) -------\
Barometer ------------> Raspberry Pi (runs model live) --> SD card (all frames + data)
GPS logger (receive) -/          ^
Battery + regulator -------------'
```

| Part                             | Purpose                                                   |
| -------------------------------- | --------------------------------------------------------- |
| Raspberry Pi 4 or 5              | Runs the model live, logs data                            |
| Wide-angle camera module         | Records descent imagery                                   |
| High-g accelerometer and IMU     | Detects launch, measures loads and camera orientation     |
| Barometer                        | Altitude                                                  |
| GPS logger                       | Position, used to tag frames                              |
| SD card, LiPo battery, regulator | Storage and power                                         |
| 3D-printed enclosure             | Holds everything securely, with cooling and a camera port |

**Software:** Starts automatically on power-up and waits. The IMU detects launch, then the system records everything and runs live prediction during descent. Raw frames are always saved, so if the live pipeline fails we can still run the same model offline as a fallback result.

**Size:** Designed to fit inside the 6 in by 10 in envelope, with a camera port and mounting points. Final dimensions to be confirmed with the rocket team.
**Mass:** Estimated 300 to 500 g including battery and enclosure.
**Power:** Target at least 2 hours of runtime including pad time, verified in ground testing. The model runs live only during descent to save power.
**Radio:** No transmitters. The GPS logger only receives. The Pi's built-in WiFi and Bluetooth will be disabled unless the rocket team approves otherwise.

**Items we flag for safety review:** one LiPo battery (secured, protected, and mounted in its own compartment), heat from the computer under load (we will test cooling), and a camera that needs optical access outside the rocket body. We have no liquids, pressurized parts, lasers, magnets, sharp components, or moving mechanisms. The payload only records and computes and does not connect to the rocket's flight computer, parachutes, or tracking system. All components and datasets are commercially or publicly available, with no controlled technical data.

**Help we need early:** a camera view (downward or angled), plus the rocket's expected descent speed and how it hangs under the parachute. If the view is limited, the IMU log lets us keep only usable frames.

---

## 6. Our Plan

**Build and test timeline**

- **Now to Oct 12:** Train the model on public aerial imagery, and benchmark its speed on a Raspberry Pi. Neither needs the final flight hardware.
- **Oct 26, design meeting:** Confirm camera port, mounting, dimensions, and safety items.
- **About Nov 9, prototype:** Camera and sensors record reliably with synchronized timestamps, software starts automatically, and the model runs live at our target speed on test imagery.
- **About Nov 19, flight readiness:** All ground tests passed.
- **About Nov 23:** Deliver the payload.

**Ground tests before flight:** battery life under full model load, live prediction speed and heat, camera and sensors recording, data saved to memory, software starting reliably on power-up, components staying attached, vibration and shake testing, and downward-facing test imagery from a high vantage point over both safe and unsafe terrain to check accuracy.

**Budget (approximate, $500 award)**

| Item                                      | Est. cost      |
| ----------------------------------------- | -------------- |
| Raspberry Pi and camera module            | $100           |
| IMU, high-g accelerometer, barometer      | $50            |
| GPS logger                                | $35            |
| SD cards                                  | $20            |
| LiPo battery and regulator                | $40            |
| Enclosure, cooling, mounting, connectors  | $30            |
| Spare parts (backup camera, backup board) | $80            |
| **Total**                                 | **about $355** |

The award covers all parts with room for spares. Any extra cost will be covered by the team, and we will look for additional support.

**After the flight:** Recover the payload and data, hand-label a subset of frames, score the live predictions against our labels and against an offline re-run, and report what worked, what surprised us, and what we would test next. We will then retrain with the new data and keep testing over unsafe terrain. Next steps could include adding a rangefinder for altitude above ground and steering toward the safest spot. This is a stepping stone toward autonomous landing on unfamiliar surfaces and of returned or reusable vehicles.
