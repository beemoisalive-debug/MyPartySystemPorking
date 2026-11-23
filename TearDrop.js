// TearDrop — 눈에서 떨어지는 눈물 한 방울
// TearSystem — 눈물 입자들을 관리하는 시스템

class TearDrop {
  constructor(pos) {
    this.pos = pos.copy();
    this.prev = pos.copy();
    this.vel = createVector(random(-0.85, 0.85), random(0.4, 1.0));
    this.size = random(3.2, 5.4);
    this.life = 255;
    this.dead = false;
    this.landed = false;   // 땅에 닿았는지 (꽃을 심는 신호)
  }

  update(wind) {
    this.prev = this.pos.copy();

    // 외부 힘: 바람
    this.vel.x += wind.x * 0.055;
    // 중력
    this.vel.y += 0.13;

    this.vel.mult(0.998);
    this.vel.y = constrain(this.vel.y, 0.2, 4.2);
    this.pos.add(this.vel);

    if (this.pos.y >= GROUND_Y) {
      this.pos.y = GROUND_Y;
      this.landed = true;
      this.dead = true;
    }
    if (this.pos.x < -60 || this.pos.x > width + 60) this.dead = true;
  }

  display() {
    if (this.landed) return;

    // 지나간 자리의 젖은 흔적
    stroke(150, 205, 255, 55);
    strokeWeight(this.size * 0.9);
    line(this.prev.x, this.prev.y, this.pos.x, this.pos.y);

    noStroke();
    fill(175, 218, 255, 120);
    this.tear(this.size * 1.45);
    fill(210, 240, 255, 225);
    this.tear(this.size * 0.8);
    fill(255, 255, 255, 200);
    ellipse(this.pos.x - this.size * 0.3, this.pos.y + this.size * 0.1, this.size * 0.4);
  }

  // 물방울 모양: 위는 뾰족하고 아래는 둥글다
  tear(r) {
    const x = this.pos.x;
    const y = this.pos.y;
    const steps = 10;
    const curve = (a, b, c, d, t) =>
      pow(1 - t, 3) * a + 3 * pow(1 - t, 2) * t * b +
      3 * (1 - t) * t * t * c + pow(t, 3) * d;

    beginShape();
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      vertex(x + curve(0, 0.95 * r, r, 0, t), y + curve(-1.5 * r, -0.55 * r, r, r, t));
    }
    for (let i = steps - 1; i >= 0; i--) {
      const t = i / steps;
      vertex(x - curve(0, 0.95 * r, r, 0, t), y + curve(-1.5 * r, -0.55 * r, r, r, t));
    }
    endShape(CLOSE);
  }
}

class TearSystem extends ParticleSystem {
  constructor(origin) {
    super();
    this.origin = origin.copy();
  }

  // 누르고 있는 동안 여기서 눈물이 만들어진다
  emit() {
    this.add(new TearDrop(this.origin));
  }
}
