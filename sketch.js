let mic;
let amp;
let fft;
let started = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  mic = new p5.AudioIn();
  amp = new p5.Amplitude();
  fft = new p5.FFT(0.8, 1024);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(20);
  textFont('monospace');
}

function draw() {
  background(0, 0, 5, 0.08);
  
  if (!started) {
    fill(0, 0, 70);
    text('tap & allow microphone', width/2, height/2);
    return;
  }
  
  let spectrum = fft.analyze();
  let level = amp.getLevel();
  
  // 対数スケールでcentroid計算 + ノイズフロア除去
  let logCentroid = 0;
  let totalEnergy = 0;
  let noiseFloor = 8;  // この値以下は無視
  
  for (let i = 2; i < spectrum.length; i++) {  // i=0,1はDC近辺なのでスキップ
    if (spectrum[i] < noiseFloor) continue;
    let logFreq = log(i);
    let energy = spectrum[i] - noiseFloor;  // ノイズフロアを差し引く
    logCentroid += logFreq * energy;
    totalEnergy += energy;
  }
  logCentroid = totalEnergy > 0 ? logCentroid / totalEnergy : 4;
  
  // 範囲を観察値に合わせて狭める
  // 低い声 → 4付近、高い声 → 6付近、想定
  let hue = map(logCentroid, 3.5, 6.5, 0, 280);
  hue = constrain(hue, 0, 360);
  
  // Spectral flatness (簡易版): ノイズ vs 音
  let highFreqEnergy = 0;
  let lowFreqEnergy = 0;
  for (let i = 0; i < spectrum.length; i++) {
    if (i < 100) lowFreqEnergy += spectrum[i];
    else highFreqEnergy += spectrum[i];
  }
  let noisiness = highFreqEnergy / (lowFreqEnergy + highFreqEnergy + 0.001);
  
  let sat = map(noisiness, 0.3, 0.7, 90, 20);
  sat = constrain(sat, 20, 90);
  
  let diameter = map(level, 0, 0.3, 80, min(width, height) * 0.9);
  
  fill(hue, sat, 95, 0.7);
  circle(width / 2, height / 2, diameter);
  
  // デバッグ表示
  fill(0, 0, 70, 0.5);
  textSize(12);
  textAlign(LEFT);
  text(`logCentroid: ${logCentroid.toFixed(2)}`, 20, height - 80);
  text(`hue: ${hue.toFixed(0)}`, 20, height - 60);
  text(`noisiness: ${noisiness.toFixed(2)}`, 20, height - 40);
  text(`level: ${level.toFixed(3)}`, 20, height - 20);
  textAlign(CENTER);
  textSize(20);
}

function mousePressed() {
  if (!started) {
    userStartAudio();
    mic.start();
    amp.setInput(mic);
    fft.setInput(mic);
    started = true;
  }
}

function touchStarted() {
  if (!started) {
    userStartAudio();
    mic.start();
    amp.setInput(mic);
    fft.setInput(mic);
    started = true;
  }
  return false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}