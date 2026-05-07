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
  
  // === 軸1: 周波数 (logCentroid) ===
  let logCentroid = 0;
  let totalEnergy = 0;
  let noiseFloor = 8;
  
  for (let i = 2; i < spectrum.length; i++) {
    if (spectrum[i] < noiseFloor) continue;
    let logFreq = log(i);
    let energy = spectrum[i] - noiseFloor;
    logCentroid += logFreq * energy;
    totalEnergy += energy;
  }
  logCentroid = totalEnergy > 0 ? logCentroid / totalEnergy : 3.2;
  
  // 実測レンジ 3.2-6.0 を全色相 0-300 にマッピング
  // 声の中も差が出るように、より広いレンジで使う
  let hue = map(logCentroid, 3.5, 6.0, 0, 300);
  hue = constrain(hue, 0, 360);
  
  // === 軸2: ノイズ性 (spectral spread) ===
  // 音楽音 = 一部の周波数に集中、ノイズ = 全帯域に分散
  // 標準偏差っぽく計算
  let spread = 0;
  if (totalEnergy > 0) {
    for (let i = 2; i < spectrum.length; i++) {
      if (spectrum[i] < noiseFloor) continue;
      let logFreq = log(i);
      let energy = spectrum[i] - noiseFloor;
      spread += pow(logFreq - logCentroid, 2) * energy;
    }
    spread = sqrt(spread / totalEnergy);
  }
  
  // 純音 → 彩度高い、ノイズ → 彩度低い
  // 観察: 純音 spread が小さく、ノイズ spread が大きい
  let sat = map(spread, 0.3, 1.5, 95, 20);
  sat = constrain(sat, 20, 95);
  
  // 明度: 音量で変える (大きい音ほど明るく)
  let bri = map(level, 0, 0.2, 60, 100);
  bri = constrain(bri, 60, 100);
  
  // spectrum を 16 グループに集約
  const NUM_VERTICES = 16;
  const SPECTRUM_FLOOR = 30;
  let groups = new Array(NUM_VERTICES);
  for (let g = 0; g < NUM_VERTICES; g++) {
    let sum = 0;
    for (let b = 0; b < 4; b++) {
      sum += spectrum[g * 4 + b];
    }
    let avg = sum / 4;
    // 個別閾値: 閾値未満は 0 にする
    groups[g] = avg < SPECTRUM_FLOOR ? 0 : avg;
  }

  // polygon 描画
  fill(hue, sat, bri, 0.7);
  noStroke();
  beginShape();
  for (let g = 0; g < NUM_VERTICES; g++) {
    let angle = map(g, 0, NUM_VERTICES, 0, TWO_PI);
    let radius = map(groups[g], 0, 255, 0, min(width, height) * 0.4);
    let x = width / 2 + cos(angle) * radius;
    let y = height / 2 + sin(angle) * radius;
    vertex(x, y);
  }
  endShape(CLOSE);
  
  // デバッグ表示
  fill(0, 0, 70, 0.5);
  textSize(12);
  textAlign(LEFT);
  text(`logCentroid: ${logCentroid.toFixed(2)}`, 20, height - 100);
  text(`spread: ${spread.toFixed(2)}`, 20, height - 80);
  text(`hue: ${hue.toFixed(0)}`, 20, height - 60);
  text(`sat: ${sat.toFixed(0)}`, 20, height - 40);
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