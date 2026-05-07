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