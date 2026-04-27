### v0.1.4 testing (2026-04-26)

#### Design
Three-axis mapping:
- Hue ← logCentroid (pitch)
- Saturation ← spectral spread (timbre/noise)
- Brightness ← amplitude (volume)

#### Measured values (AirPods Pro mic)
| Sound | hue | sat | spread |
|---|---|---|---|
| Silence | 0 | 3.2 | - |
| Low "ah" | 117 | 42 | 1.15 |
| High "ee" | 180 | 33 | 1.28 |
| Whistle | 290 | 72 | - |
| Hand clap | 223 | 60 | - |
| "Sss" | 314 | 76 | - |

#### Results
- ✓ Hue maps cleanly to pitch (117 → 314 across the voice/whistle range)
- ✓ Voices now show clear color difference (delta hue = 63)
- ✗ Saturation does not strongly differentiate noise from tone
   (whistle 72 vs clap 60, expected larger gap)

#### Critical discovery: the microphone is not neutral

I'm using AirPods Pro with active noise cancellation.
ANC is designed to:
- Suppress wide-band ambient noise
- Enhance the human voice band (300Hz - 3kHz)
- Apply ML-trained voice isolation

Which means: the input device already implements 
"human-centric listening" before my code sees the signal.

I was trying to make a machine listen like a human, 
but the machine I'm listening through has already done that.

This complicates the original question:
"How do we make a machine hear like a human?"
becomes
"What does 'machine hearing' even mean when our machines 
are increasingly designed to hear like humans?"

#### Status of the original three problems
- [x] "Color is fixed" — solved via three-axis mapping
- [ ] "Shape is a circle" — next
- [ ] "Spread is even in time" — next

#### Next experiments (deferred)
- v0.1.5: Test with raw microphone (laptop built-in, no ANC)
  to see what the model "really" hears
- v0.2.0: Move from circle to non-circular form
- v0.2.x: Add temporal jaggedness (attack detection)

#### References to chase
- Listening through processed signals — what mediated perception even is
- Beats Studio / AirPods ANC technical papers
- "Anthropocentric audio processing" as a research topic