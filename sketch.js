let mic;
let amp;
let started = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  mic = new p5.AudioIn();
  amp = new p5.Amplitude();
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
  
  let level = amp.getLevel();
  let diameter = map(level, 0, 0.3, 80, min(width, height) * 0.9);
  let hue = map(level, 0, 0.3, 30, 90);
  let sat = map(level, 0, 0.3, 40, 90);
  
  fill(hue, sat, 95, 0.7);
  circle(width / 2, height / 2, diameter);
}

function mousePressed() {
  if (!started) {
    userStartAudio();
    mic.start();
    amp.setInput(mic);
    started = true;
  }
}

function touchStarted() {
  if (!started) {
    userStartAudio();
    mic.start();
    amp.setInput(mic);
    started = true;
  }
  return false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
