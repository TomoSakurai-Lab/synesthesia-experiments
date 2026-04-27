let mic;
let amp;
let fft;
let started = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  mic = new p5.AudioIn();
  amp = new p5.Amplitude();
  fft = new p5.FFT(0.8, 1024);  // 解像度上げる: 64 → 1024
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
  
  // 対数スケールで周波数重心を計算 (人間の耳に近い)
  let logCentroid = 0;
  let totalEnergy = 0;
  for (let i = 1; i < spectrum.length; i++) {  // i=0 はDC成分なのでスキップ
    let logFreq = log(i);  // 対数周波数
    logCentroid += logFreq * spectrum[i];
    totalEnergy += spectrum[i];
  }
  logCentroid = totalEnergy > 0 ? logCentroid / totalEnergy : 0;
  
  // log(1) = 0, log(1024) = 約 6.93
  // この範囲を 0 → 240 (赤→青) にマッピング
  let hue = map(logCentroid, 2, 6.5, 0, 240);
  hue = constrain(hue, 0, 360);
  
  // Spectral flatness (ノイズか音か): 高いほどノイズっぽい
  // ここでは簡易版: 高周波の比率
  let highFreqEnergy = 0;
  let lowFreqEnergy = 0;
  for (let i = 0; i < spectrum.length; i++) {
    if (i < 50) lowFreqEnergy += spectrum[i];
    else highFreqEnergy += spectrum[i];
  }
  let noisiness = highFreqEnergy / (lowFreqEnergy + highFreqEnergy + 0.001);
  
  // ノイズっぽい音は彩度を下げる (灰色寄り)
  let sat = map(noisiness, 0, 1, 90, 30);
  sat = constrain(sat, 30, 90);
  
  let diameter = map(level, 0, 0.3, 80, min(width, height) * 0.9);
  
  fill(hue, sat, 95, 0.7);
  circle(width / 2, height / 2, diameter);
  
  // デバッグ用: 画面下に値を表示 (確認用、後で消せる)
  fill(0, 0, 70, 0.5);
  textSize(12);
  textAlign(LEFT);
  text(`logCentroid: ${logCentroid.toFixed(2)}`, 20, height - 60);
  text(`hue: ${hue.toFixed(0)}`, 20, height - 40);
  text(`noisiness: ${noisiness.toFixed(2)}`, 20, height - 20);
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