let mic;
let amp;
let fft;
let started = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  mic = new p5.AudioIn();
  amp = new p5.Amplitude();
  fft = new p5.FFT(0.8, 64);
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
  
  // 周波数の重心を計算 (centroid): 高音多いほど大きい値
  let centroid = 0;
  let totalEnergy = 0;
  for (let i = 0; i < spectrum.length; i++) {
    centroid += i * spectrum[i];
    totalEnergy += spectrum[i];
  }
  centroid = totalEnergy > 0 ? centroid / totalEnergy : 0;
  
  // 周波数重心 → 色相 (低音=赤, 高音=青)
  let hue = map(centroid, 0, spectrum.length * 0.5, 0, 240);
  hue = constrain(hue, 0, 360);
  
  // 音量 → 円の大きさ (まだ円のまま、形状変更は次のstep)
  let diameter = map(level, 0, 0.3, 80, min(width, height) * 0.9);
  let sat = map(level, 0, 0.3, 40, 90);
  
  fill(hue, sat, 95, 0.7);
  circle(width / 2, height / 2, diameter);
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