// Bloom — 땅에 내린 눈물이 피워낸 꽃 한 송이
//
// 눈물과 달리 스스로 떨어지지 않는다.
// 줄기가 자라고 꽃잎이 열리고, 바람이 불면 줄기가 휜다 (스프링으로 되돌아온다).
// 다 피면 꽃가루를 내보낼 수 있는 상태가 된다.

const PETAL_COLORS = [
  [255, 186, 214],
  [255, 216, 168],
  [205, 190, 255],
  [180, 224, 255],
  [255, 240, 210],
];

class Bloom {
  constructor(x, y) {
    this.base = createVector(x, y);
    this.scale = random(0.72, 1.12);          // 앞뒤 깊이감
    this.height = random(26, 74) * this.scale;
    this.grow = 0;                            // 줄기가 자라는 정도 0~1
    this.open = 0;                            // 꽃잎이 열린 정도 0~1
    this.angle = random(-0.12, 0.12);         // 줄기가 휘어진 각도
    this.angVel = 0;
    this.petals = floor(random(5, 8));
    this.color = random(PETAL_COLORS);
    this.spin = random(TWO_PI);
    this.age = 0;
    this.wither = 1;                          // 1 → 0 (시들면 사라진다)
    this.dead = false;
    this.ready = false;                       // 꽃가루를 내보낼 수 있는 상태
    this.lean = (x - width / 2) * 0.0004;
  }

  // 바람은 줄기를 휘게 하는 힘으로 작용한다
  update(wind) {
    this.age++;

    if (this.grow < 1) {
      this.grow = min(1, this.grow + 0.022);
    } else if (this.open < 1) {
      this.open = min(1, this.open + 0.028);
    }
    if (this.open >= 1) this.ready = true;

    // 바람 → 각가속도
    this.angVel += wind.x * 0.0035 * (0.25 + this.open * 0.75);
    // 원래 자세로 돌아가려는 스프링
    this.angVel += (-this.angle + this.lean) * 0.02;
    this.angVel *= 0.93;
    this.angle += this.angVel;

    if (this.wither < 1) {
      this.wither -= 0.02;
      if (this.wither <= 0) this.dead = true;
    }
  }

  // 꽃이 달린 끝 (꽃가루가 여기서 나온다)
  tip() {
    const h = this.height * this.grow;
    return createVector(
      this.base.x + sin(this.angle) * h,
      this.base.y - cos(this.angle) * h
    );
  }

  display() {
    const h = this.height * this.grow;
    const tip = this.tip();
    const a = 255 * this.wither;

    // 줄기
    stroke(120, 160, 120, a * 0.9);
    strokeWeight(2 * this.scale);
    noFill();
    const cx = this.base.x + sin(this.angle) * h * 0.35;
    const cy = this.base.y - h * 0.6;
    beginShape();
    for (let i = 0; i <= 12; i++) {
      const t = i / 12;
      const u = 1 - t;
      vertex(
        u * u * this.base.x + 2 * u * t * cx + t * t * tip.x,
        u * u * this.base.y + 2 * u * t * cy + t * t * tip.y
      );
    }
    endShape();

    // 잎
    if (this.grow > 0.5) {
      const lx = this.base.x + sin(this.angle) * h * 0.3;
      const ly = this.base.y - h * 0.42;
      noStroke();
      fill(110, 150, 115, a * 0.8);
      ellipse(lx, ly, 9 * this.grow * this.scale, 4.5 * this.grow * this.scale);
      ellipse(lx + 7 * this.scale, ly - 6 * this.scale, 7 * this.grow * this.scale, 4 * this.grow * this.scale);
    }

    if (this.open <= 0.01) return;

    // 꽃잎
    push();
    translate(tip.x, tip.y);
    rotate(this.spin + this.angle * 0.6);
    noStroke();
    const size = 7.4 * this.open * this.scale;
    for (let i = 0; i < this.petals; i++) {
      rotate(TWO_PI / this.petals);
      fill(this.color[0], this.color[1], this.color[2], a * 0.9);
      ellipse(0, -size * 0.8, size * 0.62, size * 1.15);
    }
    fill(255, 246, 200, a);
    ellipse(0, 0, size * 0.55, size * 0.55);
    pop();
  }
}
