# v0.2: Sound is not a circle

## Observations from v0.1

Three things felt wrong:

1. **The color is fixed in mapping** — only volume changes hue.
   Sound has frequency, timbre, harmonic structure.
   Mapping by amplitude alone is reductive.

2. **The shape is a circle** — but sound isn't symmetric.
   Sound has direction, distortion, irregularity.
   A perfect circle smooths out everything that makes sound *sound*.

3. **The spread is too even** — pulsing smoothly hides
   the attack, the noise, the sudden bursts.
   Sound is jagged in time. The visual should be too.

## Questions for v0.2

- Can frequency analysis (FFT) replace amplitude as the primary signal?
- What shape can hold "soundness" better than a circle?
- How do we make attacks visible without losing ambience?

## References to read

- Marks, L. (1975) — On colored-hearing synesthesia: cross-modal translations of sensory dimensions.
- Caivano, J. (1994) — Color and sound: physical and psychophysical relations.
- (more to add)

## Plan

- v0.1.2: Add FFT, map mean frequency to hue
- v0.1.3: Replace circle with frequency-distributed polygon
- v0.1.4: Add attack detection for visual bursts
- v0.2.0: Integrate all, tune

## Notes

[今日の作業中の気づきを随時追記]