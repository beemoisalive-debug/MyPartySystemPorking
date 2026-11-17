// 울고 있는 소녀 — 눈에서 눈물 입자(Particle)가 흘러내린다

let tearsLeft;
let tearsRight;

// 얼굴 기준 좌표 (캔버스 중앙)
const FACE = { cx: 360, cy: 208, w: 200, h: 236 };

// 눈 위치 (얼굴 중심 기준)
const EYE = { y: 10, dx: 46, w: 52, h: 34 };

// 눈물이 흘러나오는 눈꼬리 (캔버스 좌표)
const TEAR_L = { x: FACE.cx - EYE.dx - 22, y: FACE.cy + EYE.y + 14 };
const TEAR_R = { x: FACE.cx + EYE.dx + 22, y: FACE.cy + EYE.y + 14 };

let sob = 0;        // 흐느끼는 정도 (0~1)
let emitTimer = 0;

function setup() {
  createCanvas(720, 460);
  noStroke();
  tearsLeft = new ParticleSystem(createVector(TEAR_L.x, TEAR_L.y));
  tearsRight = new ParticleSystem(createVector(TEAR_R.x, TEAR_R.y));
}

function draw() {
  drawBackground();

  // 천천히 커졌다 작아지는 흐느낌
  sob = 0.35 + 0.65 * noise(frameCount * 0.008);

  drawGirl();

  // 눈물 방울 생성 — 흐느낄수록 더 자주 떨어진다
  emitTimer -= 1;
  if (emitTimer <= 0) {
    emitTimer = random(2.5, 9) * (1.45 - sob * 0.9);
    const system = random() < 0.5 ? tearsLeft : tearsRight;
    system.addParticle();
  }

  // 흐느끼는 순간엔 두 눈에서 동시에
  if (random() < sob * 0.07) {
    tearsLeft.addParticle();
    tearsRight.addParticle();
  }

  tearsLeft.run();
  tearsRight.run();
}

function drawBackground() {
  noStroke();
  for (let y = 0; y < height; y += 4) {
    const t = y / height;
    fill(lerpColor(color(26, 22, 40), color(8, 8, 16), t));
    rect(0, y, width, 4);
  }

  // 얼굴 뒤 은은한 빛
  const g = drawingContext.createRadialGradient(
    FACE.cx, FACE.cy + 20, 40,
    FACE.cx, FACE.cy + 20, 320
  );
  g.addColorStop(0, "rgba(125, 155, 255, 0.18)");
  g.addColorStop(1, "rgba(125, 155, 255, 0)");
  drawingContext.fillStyle = g;
  drawingContext.fillRect(0, 0, width, height);
}

function drawGirl() {
  const hair = color(34, 28, 48);
  const skin = color(247, 218, 200);
  const skinShade = color(233, 193, 180);

  push();
  // 아주 살짝 떨리는 어깨
  translate(FACE.cx, FACE.cy + sin(frameCount * 0.09) * 1.5);

  // 긴 머리 (뒤)
  noStroke();
  fill(hair);
  ellipse(0, 66, 330, 460);

  // 얼굴
  fill(skin);
  ellipse(0, 0, FACE.w, FACE.h);

  // 얼굴 아래쪽 그림자
  fill(skinShade);
  ellipse(0, 40, 150, 116);

  // 앞머리 — 이마를 덮는 부드러운 헤어라인
  fill(hair);
  beginShape();
  for (let x = -122; x <= 122; x += 6) {
    // 머리 실루엣 안쪽을 따라 올라간다
    const inside = sqrt(max(0, 1 - sq(x / 165)));
    vertex(x, 66 - 230 * inside + 3);
  }
  for (let x = 122; x >= -122; x -= 6) {
    const t = x / 116;
    vertex(x, -45 - 10 * cos(t * PI / 2));
  }
  endShape(CLOSE);

  // 옆머리
  fill(hair);
  ellipse(-96, 6, 40, 210);
  ellipse(96, 6, 40, 210);

  // 눈썹 (슬픈 표정: 안쪽이 올라감)
  stroke(84, 60, 72);
  strokeWeight(5);
  line(-72, -14, -22, -28);
  line(72, -14, 22, -28);

  // 감은 눈
  stroke(66, 46, 58);
  strokeWeight(5);
  arc(-EYE.dx, EYE.y, EYE.w, EYE.h, PI, TWO_PI);
  arc(EYE.dx, EYE.y, EYE.w, EYE.h, PI, TWO_PI);

  // 속눈썹
  strokeWeight(3);
  line(-EYE.dx - EYE.w / 2, EYE.y,
       -EYE.dx - EYE.w / 2 - 9, EYE.y + 7);
  line(EYE.dx + EYE.w / 2, EYE.y,
       EYE.dx + EYE.w / 2 + 9, EYE.y + 7);

  // 코
  noFill();
  stroke(214, 168, 160);
  strokeWeight(3);
  arc(0, 44, 18, 14, 0.15, PI - 0.15);

  // 입 (흐느낄수록 크게 일그러진다)
  stroke(150, 90, 100);
  strokeWeight(4);
  arc(0, 76, 44 + sob * 10, 26 + sob * 12, PI, TWO_PI);

  // 볼터치
  noStroke();
  fill(236, 128, 148, 60);
  ellipse(-58, 46, 56, 28);
  ellipse(58, 46, 56, 28);

  // 눈꼬리에 맺힌 눈물
  fill(190, 230, 255, 220);
  ellipse(-EYE.dx - 22, EYE.y + 14, 6, 7);
  ellipse(EYE.dx + 22, EYE.y + 14, 6, 7);

  pop();
}
