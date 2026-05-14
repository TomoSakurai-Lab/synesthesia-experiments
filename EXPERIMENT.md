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
## v0.1.5 testing — raw mic comparison (2026-05-XX)

### Setup
- Hardware: condenser microphone (no ANC)
- Code: identical to v0.1.4 (3-axis mapping)
- Comparison target: Day 7 measurements with AirPods Pro (ANC active)

### Measured values (condenser mic)

| Sound | logCentroid | spread | hue | sat | level |
|---|---|---|---|---|---|
| Silence | 2.3 | 0 | 78 | 0.58 | 0.001 |
| Low "ah" | 3.6 | 1.09 | 16 | 46 | 0.018 |
| High "ee" | 4.85 | 0.94 | 162 | 56 | 0.074 |
| Whistle | 4.25 | 0.85 | 109 | 61 | 0.044 |
| Hand clap | 5.25 | 1.09 | 220 | 45 | 0.209 |
| "Sss" | 5.42 | 0.78 | 220 | 66 | 0.038 |

### Comparison with Day 7 (AirPods Pro)

| Sound | AirPods centroid | Condenser centroid | Δ centroid | AirPods hue | Condenser hue |
|---|---|---|---|---|---|
| Silence | 3.2 | 2.3 | -0.9 | 0 | 78 |
| Low "ah" | 5.0 | 3.6 | -1.4 | 130 | 16 |
| High "ee" | 5.25 | 4.85 | -0.4 | 168 | 162 |
| Whistle | 4.8 | 4.25 | -0.55 | 120 | 109 |
| Hand clap | 5.8 | 5.25 | -0.55 | 223 | 220 |
| "Sss" | 6.0 | 5.42 | -0.58 | 314 | 220 |

### Findings (observations)

1. AirPods 内では、低い「あー」(centroid 5.0) と高い「いー」(5.25) の差は0.25。声の高さを変えても、ほとんど同じ数値だった。

2. AirPods の低い「あー」の centroid (5.0) は、コンデンサマイクの高い「いー」(4.85) よりも高かった。AirPods は全体的に高い centroid を返してる。

3. AirPods 内の音高差 0.25 に対し、コンデンサは 1.25。コンデンサの方が5倍大きい。

### Interpretation

ANC は人の声を高めに処理している。さらに、コンデンサマイクと比べて5倍も音高差が圧縮されていることから、ANC が声の周波数情報に何らかの加工をしているのは確実。

### Hypotheses (still to verify)

- A: ANC は「人の声」と「それ以外」をカテゴリ的に分けて処理している
- B: ANC は人の声の周波数帯域を一律に持ち上げているだけで、カテゴリ分けはない
- C: 別の機構 (要調査)

これは現状のデータからは判定できない。純音や合成音声で再実験すれば検証可能。

### Implications for the project

音の違いを表現するこのプロジェクトにおいて、AirPods は音を均そうとする処理がある以上、適していないデバイスである。

- 実験実装段階ではこのデバイスを極力使用しない
- 発表段階で色んなデバイスで試されることを考えると、デバイスごとのフィルタ処理については別途考える必要がある

### Open questions

- Whose hearing am I visualizing?
- 共感覚を視覚化したいのに、入力時点で既に加工された信号を可視化していたとしたら、それは何の可視化なのか?
- v0.x でデバイス差を扱う方法 (キャリブレーション? 表示?) を検討する

### Status update

- [x] "Color is fixed" — solved (v0.1.4)
- [x] "ANC = humanized listening" — empirically confirmed (v0.1.5)
- [ ] "Shape is a circle" — next (v0.2.0)
- [ ] "Spread is even in time" — later
- [ ] NEW: "Whose hearing am I visualizing?" — to explore in v0.2+

## v0.2.0 first observations (2026-05-07)

### Setup
- 16 vertices polygon
- Spectrum grouped: 64 bands → 16 groups (4 bins averaged each)
- Per-group floor threshold: 30
- Color logic: same as v0.1.4

### What I observed

1. **Fan noise persists in silence**
   PC fan and ambient room noise still register. The polygon 
   never fully collapses. Decided not to fight this — 
   environmental sound is also sound.

2. **Voice produces recognizable shapes**
   Talking creates clear, visible polygons.

3. **16 vertices is enough resolution**
   The shape is readable. 8 felt too coarse (mental model: 
   generic visualizer), 64 felt too abstract.

4. **High and low frequencies produce different shape characters**
   - High pitched sounds (whistle, sibilants): spiky shapes
     One or two vertices spike out, rest stays small.
     The energy concentrates in narrow bands.
   - Low pitched sounds (low "ah", hum): fan-shaped
     Multiple adjacent vertices grow together.
     The energy spreads across nearby bands (harmonics + resonance).

5. **Color logic intact**
   The 3-axis HSB mapping from v0.1.4 still works correctly.

### Interpretation

The shape difference between high and low pitches is not 
something I designed — it emerged from FFT spectral physics.
Low frequencies have wider spectral distribution (harmonics, 
formants), so neighbor bins activate together → smooth shapes.
High frequencies have narrow spectral concentration → spikes.

This is interesting because the visualization now embeds 
information that wasn't in v0.1.4: **the spectral character 
of sound types**. Voice ≠ whistle, even at the same loudness 
and pitch range.

### New question

Could this distinction (spread vs concentrated) be made 
explicit through visual treatment? Or is the emergent 
difference enough?

### Status update

- [x] "Color is fixed" — solved (v0.1.4)
- [x] "ANC = humanized listening" — confirmed (v0.1.5)
- [x] "Shape is a circle" — addressed (v0.2.0)
- [ ] "Spread is even in time" — next?
- [ ] "Whose hearing am I visualizing?" — exploring
- [ ] NEW: "Should spectral character be visually emphasized?"
## Day 18 — Understanding deepens, vision pivots

### Morning realizations

Started the day fresh after Day 17's intense session.
Noticed I couldn't explain SPECTRUM_FLOOR in my own code.

Worked through:
- What centroid actually is (spectral center of mass)
- spectrum and energy relationship (array values = band energies)
- FFT's role (time-domain wave → frequency-domain energies)
- Why log scale for centroid (matches human hearing)

Key insight: my Day 14 discovery about ANC compressing 
voice pitch by 5x was found *without* fully understanding 
the math. Now the math gives the discovery deeper meaning.

### Vision update

Initial v0.3 vision: "Make every sound look beautiful"

Self-criticism mid-morning: this is false. Not all sounds 
ARE beautiful. The work shouldn't pretend otherwise.

Revised vision: "Detect structurally beautiful sounds 
and amplify them visually"

This is closer to what artistic curation is — selection, 
not democratic visualization.

### v0.2.5 idea (composer mode)

Realized I want to *compose* the sound side, not only 
react to mic input. p5.Oscillator could be added so 
I can test specific tones, harmonics, dissonances.

This shifts the project from "visualizer" toward 
"sound + visual composition" — closer to the original 
"Web-Native Synesthetic **Composer**" identity.

### Open questions

- What exactly counts as "structural beauty"?
- Should detection be visible to the user or subtle?
- v0.2.5 vs v0.3: which first?

### Status

Slept after morning session — deliberate rest.
Resuming Day 19 with these threads to pick up.

## Day 18 — Understanding deepens, vision pivots (recorded Day [X])

Slept after morning session, then caught a cold. 
Recording now at ~80% recovery.

### Morning understanding

Realized I couldn't explain SPECTRUM_FLOOR in my own code.
This was a wake-up call: my v0.2.0 had AI-generated parts 
I hadn't internalized.

Spent the morning working through the foundations:

**FFT (Fast Fourier Transform)** is the algorithm that 
converts a time-domain waveform into frequency-domain energies. 
Mathematically equivalent to what the cochlea in the human 
ear does, but done in software.

**spectrum[]** is the output array of FFT. Each index 
corresponds to a frequency band, and the value at that 
index is the energy in that band (0-255 range in p5.sound). 
For my 64-bin FFT, each band covers roughly 344Hz of the 
0-22050Hz audible range.

**Spectral centroid** is the "center of mass" of the 
spectrum: a weighted average of frequencies, weighted by 
their energies. High centroid = high-pitched / bright. 
Low centroid = low-pitched / dark.

**logCentroid** = log(centroid). Used because human 
hearing is logarithmic: doubling the frequency is heard 
as "one octave higher" regardless of the starting pitch.

**SPECTRUM_FLOOR = 30** is the per-band threshold. After 
grouping the 64 bands into 16 groups and averaging each 
group, any group with average energy < 30 is treated as 
silence (set to 0). This suppresses persistent ambient 
noise that would otherwise make the polygon never settle.

Key insight: Day 14's ANC discovery was made *without* 
fully understanding the math. The data showed something 
real, but I didn't know precisely what I was measuring. 
Now that I understand spectral centroid as a weighted 
average, the 5x compression of voice pitch by ANC is 
even more striking — it means ANC is actively flattening 
the energy distribution across frequency bands, not just 
applying a passive filter.

### v0.3 vision pivot
Initial: "Make every sound look beautiful"
Self-criticism mid-morning: false. Not all sounds ARE beautiful.
Revised: "Detect structurally beautiful sounds, amplify those"

This is artistic curation, not democratic visualization.

### v0.2.5 idea: composer mode
Realized I want to *compose* the sound side, not only react 
to mic input. p5.Oscillator could be added to test pure tones, 
harmonics, dissonances under controlled conditions.

Shifts the project from "visualizer" toward "sound + visual 
composition" — closer to "Web-Native Synesthetic **Composer**" 
identity.

### External input: Nul-an installation
Saw Ochiai's ヌル庵・即今叢. Fractal-style, technically impressive 
("calculation nature" aesthetic). But cuts/breaks are not continuous
— not my preference.

What I learned about myself:
- Prefer continuous over interrupted
- Aesthetic = emotional connection, not just impressive
- Aligns with v0.3 thesis: structural beauty as continuity

### Strange loops as v1.0+ direction
Hofstadter GEB-style strange loops as long-term goal:
- Sound and visual mutually generating each other
- Shepard-tone visual equivalent
- Self-referential aesthetic systems

Logged as v1.0+. Not for v0.3.