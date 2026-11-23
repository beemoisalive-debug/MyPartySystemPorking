/* ============================================================
   눈물이 꽃이 된다 (Tears in Bloom)

   흐느끼는 사람의 눈에서 눈물이 떨어진다.
   눈물은 바람에 궤적이 휘고, 땅에 닿은 자리에 꽃이 피어난다.
   다 핀 꽃은 꽃가루를 내보내고, 꽃가루도 바람을 타고 흩어진다.

   구조
     Wind ............. 외부 힘의 출처 (시스템도 입자도 아님)
     ParticleSystem ... 입자를 관리하는 기본 시스템
       ├ TearSystem .... 눈물 입자 (TearDrop) 관리
       ├ Garden ........ 꽃 입자 (Bloom) 관리
       └ PollenField ... 꽃가루 입자 (Pollen) 관리

   바람 하나를 세 시스템이 공유하기 때문에,
   마우스를 좌우로 움직이면 눈물의 낙하 지점·꽃의 기울기·꽃가루의 흐름이
   동시에 달라진다.
   ============================================================ */

// ---------- 상태 ----------
let tearsLeft, tearsRight;   // 눈물 시스템 (왼눈 / 오른눈)
let garden;                  // 꽃밭 시스템
let pollen;                  // 꽃가루 시스템

let ripples = [];            // 눈물이 떨어진 자리의 물결
let sob = 0;                 // 흐느끼는 정도 0~1
let sobBoost = 0;            // 누를 때 잠깐 세지는 흐느낌
let emitTimer = 0;           // 다음 눈물까지의 프레임

function setup() {
  const c = createCanvas(CANVAS_W, CANVAS_H);
  c.parent(document.querySelector("main"));
  noStroke();

  Wind.init();

  tearsLeft = new TearSystem(createVector(TEAR_L.x, TEAR_L.y));
  tearsRight = new TearSystem(createVector(TEAR_R.x, TEAR_R.y));
  garden = new Garden(GROUND_Y);
  pollen = new PollenField();
}

function draw() {
  Wind.update();

  sobBoost *= 0.96;
  sob = constrain(0.35 + 0.65 * noise(frameCount * 0.008) + sobBoost, 0, 1);

  drawBackground();
  drawGround();
  drawGirl();

  // 눈물 생성 — 마우스를 누르고 있는 동안에만 흘러나온다
  if (mouseIsPressed && insideCanvas()) {
    emitTimer -= 1;
    if (emitTimer <= 0) {
      emitTimer = random(1.2, 4.5) * (1.4 - sob * 0.85);
      tearsLeft.emit();
      tearsRight.emit();
    }
  }

  drawRipples();

  // 1) 눈물: 떨어지다 땅에 닿으면 꽃을 심는다
  for (const s of [tearsLeft, tearsRight]) {
    for (let i = s.particles.length - 1; i >= 0; i--) {
      const p = s.particles[i];
      p.update(Wind.v);
      p.display();
      if (p.landed) {
        garden.plant(p.pos.x);
        ripples.push({ x: p.pos.x, y: GROUND_Y, r: 2, a: 150 });
      }
      if (p.dead) s.particles.splice(i, 1);
    }
  }

  // 2) 꽃: 바람에 휘고, 다 피면 꽃가루를 내보낸다
  for (let i = garden.particles.length - 1; i >= 0; i--) {
    const b = garden.particles[i];
    b.update(Wind.v);
    b.display();
    if (b.ready && b.wither >= 1 && random() < 0.0025) {
      pollen.release(b.tip());
    }
    if (b.dead) garden.particles.splice(i, 1);
  }

  // 3) 꽃가루
  pollen.run();

  drawHud();
}

// ---------- 그리기 ----------
function drawBackground() {
  noStroke();
  for (let y = 0; y < height; y += 4) {
    const t = y / height;
    fill(lerpColor(color(24, 20, 38), color(7, 7, 14), t));
    rect(0, y, width, 4);
  }

  // 얼굴 뒤 은은한 빛
  const g = drawingContext.createRadialGradient(
    FACE.cx, FACE.cy + 10, 30,
    FACE.cx, FACE.cy + 10, 330
  );
  g.addColorStop(0, "rgba(125, 155, 255, 0.16)");
  g.addColorStop(1, "rgba(125, 155, 255, 0)");
  drawingContext.fillStyle = g;
  drawingContext.fillRect(0, 0, width, height);
}

function drawGround() {
  noStroke();
  // 흙
  fill(14, 14, 22);
  rect(0, GROUND_Y, width, height - GROUND_Y);

  // 땅 위에 번지는 은은한 빛 (꽃밭의 온기)
  const g = drawingContext.createRadialGradient(
    width / 2, GROUND_Y, 20,
    width / 2, GROUND_Y, 380
  );
  g.addColorStop(0, "rgba(110, 195, 180, 0.10)");
  g.addColorStop(1, "rgba(110, 195, 180, 0)");
  drawingContext.fillStyle = g;
  drawingContext.fillRect(0, GROUND_Y - 220, width, 220);

  // 땅의 경계
  fill(46, 44, 66, 170);
  rect(0, GROUND_Y - 1, width, 1.5);
}

function drawGirl() {
  const hair = color(34, 28, 48);
  const skin = color(245, 214, 196);
  const skinShade = color(228, 187, 176);

  push();
  // 아주 살짝 떨리는 어깨
  translate(FACE.cx, FACE.cy + sin(frameCount * 0.09) * 1.5);

  // 긴 머리 (뒤)
  noStroke();
  fill(hair);
  ellipse(0, 62, 316, 440);

  // 얼굴
  fill(skin);
  ellipse(0, 0, FACE.w, FACE.h);

  // 얼굴 아래쪽 그림자
  fill(skinShade);
  ellipse(0, 38, 142, 110);

  // 앞머리
  fill(hair);
  beginShape();
  for (let x = -116; x <= 116; x += 6) {
    const inside = sqrt(max(0, 1 - sq(x / 158)));
    vertex(x, 62 - 220 * inside + 3);
  }
  for (let x = 116; x >= -116; x -= 6) {
    const t = x / 110;
    vertex(x, -43 - 10 * cos((t * PI) / 2));
  }
  endShape(CLOSE);

  // 옆머리
  fill(hair);
  ellipse(-92, 6, 38, 200);
  ellipse(92, 6, 38, 200);

  // 눈썹 (슬픈 표정)
  stroke(84, 60, 72);
  strokeWeight(5);
  line(-70, -16, -22, -29);
  line(70, -16, 22, -29);

  // 감은 눈
  stroke(66, 46, 58);
  strokeWeight(5);
  arc(-EYE.dx, EYE.y, EYE.w, EYE.h, PI, TWO_PI);
  arc(EYE.dx, EYE.y, EYE.w, EYE.h, PI, TWO_PI);

  // 속눈썹
  strokeWeight(3);
  line(-EYE.dx - EYE.w / 2, EYE.y, -EYE.dx - EYE.w / 2 - 9, EYE.y + 7);
  line(EYE.dx + EYE.w / 2, EYE.y, EYE.dx + EYE.w / 2 + 9, EYE.y + 7);

  // 코
  noFill();
  stroke(212, 166, 158);
  strokeWeight(3);
  arc(0, 42, 17, 13, 0.15, PI - 0.15);

  // 입 (흐느낄수록 크게 일그러진다)
  stroke(150, 90, 100);
  strokeWeight(4);
  arc(0, 74, 42 + sob * 10, 24 + sob * 12, PI, TWO_PI);

  // 볼터치
  noStroke();
  fill(236, 128, 148, 55);
  ellipse(-56, 44, 54, 26);
  ellipse(56, 44, 54, 26);

  // 눈꼬리에 맺힌 눈물
  fill(190, 230, 255, 220);
  ellipse(-EYE.dx - 21, EYE.y + 13, 6, 7);
  ellipse(EYE.dx + 21, EYE.y + 13, 6, 7);

  pop();
}

function drawRipples() {
  noStroke();
  for (let i = ripples.length - 1; i >= 0; i--) {
    const r = ripples[i];
    r.r += 0.8;
    r.a -= 7;
    if (r.a <= 0) {
      ripples.splice(i, 1);
      continue;
    }
    fill(160, 205, 255, r.a * 0.5);
    ellipse(r.x, r.y, r.r * 3, r.r * 0.8);
  }
}

function drawHud() {
  noStroke();
  fill(220, 226, 255, 120);
  textAlign(LEFT, BOTTOM);
  textSize(11);
  text(
    "마우스 좌우: 바람   ·   누르고 있기: 눈물   ·   ← →: 바람   ·   R: 꽃밭 비우기",
    18,
    height - 10
  );

  textAlign(RIGHT, BOTTOM);
  fill(255, 226, 180, 150);
  text(`꽃 ${garden.count}   꽃가루 ${pollen.count}`, width - 18, height - 10);
}

// ---------- 입력 ----------
function insideCanvas() {
  return mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height;
}

function mousePressed() {
  if (!insideCanvas()) return;
  sobBoost = 0.7;
  // 누르기 시작할 때 한 번 터진다
  for (let i = 0; i < 3; i++) {
    tearsLeft.emit();
    tearsRight.emit();
  }
}

function keyPressed() {
  // 꽃밭 비우기
  if (key === "r" || key === "R") {
    garden.particles.length = 0;
    pollen.particles.length = 0;
  }
  return false; // 방향키로 페이지가 스크롤되지 않도록
}
