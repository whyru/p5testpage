let video;
let poseNet;
let poses = [];
let nose = { x: -1000, y: -1000 };
let target = { x: 200, y: 250 };

let score = 0;
let targetRadius = 60;

let gameState = 0;

let minLimit = 1000;
let timeLimit = 5000;
let timeLimitDecayRate = 0.97;
let lastTimestamp;
let timeElapsed=0;

function setup() {
  createCanvas(640, 480);

  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  poseNet = ml5.poseNet(video);
  poseNet.on("pose", results => {
    poses = results; 
  });
}

function draw() {
  image(video, 0, 0, width, height);
  if(mouseIsPressed) gameState = 1;
  if (gameState === 1) {
    drawNose();
    drawTarget();
    drawTiming();
    check();
  } else {
    fill(67, 174, 166, 200);
    rect(-1, -1, width + 2, height + 2);
  }
}

function check() {
  if (dist(target.x, target.y, nose.x, nose.y) < targetRadius * 0.5) {
    score = score + 1;
    resetTarget();
    resetTiming();
  }
}

function drawTiming() {
  timeElapsed = millis() - lastTimestamp;
  push();
  fill(255,0,0);
  textSize(width / 10);
  text(timeElapsed ,width-100,100);
  pop();  
  if (timeElapsed > timeLimit) {
    fail();
  }
}

function resetTiming() {
  lastTimestamp = millis();
  timeLimit = Math.max(minLimit, timeLimit * timeLimitDecayRate);
}

function fail() {
  //게임 오버
  timeLimit = 5000;
  targetRadius = 40;
  gameState = 2;
}

function resetTarget() {
  const { x, y } = target;
  while (dist(x, y, target.x, target.y) < width * 0.3) {
    target.x = map(Math.random(), 0, 1, 0.1 * width, 0.95 * width);
    target.y = map(Math.random(), 0, 1, 0.05 * height, 0.95 * height);
  }
}

function drawTarget() {
  push();
  stroke(159, 112, 208);
  strokeWeight(4);
  noFill();
  translate(target.x, target.y);
  const radius = 60; 
  ellipse(0, 0, radius, radius);
  pop();
}

function drawNose() {
  if (poses.length > 0) {
    nose = poses[0].pose.keypoints[0].position;
    fill(255, 154, 0);
    noStroke();
    ellipse(nose.x, nose.y, 15, 15);
  }
}