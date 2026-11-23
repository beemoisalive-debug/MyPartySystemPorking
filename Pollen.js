// Pollen — 꽃에서 올라오는 꽃가루 한 알
// PollenField — 꽃가루 입자들을 관리하는 시스템

class Pollen {
  constructor(pos) {
    this.pos = pos.copy();
    this.vel = createVector(random(-0.35, 0.35), random(-1.2, -0.45));
    this.size = random(1.2, 2.6);
    this.life = 255;
    this.dead = false;
    this.seed = random(1000);
  }

  update(wind) {
    // 바람 + 아주 약한 유체 흔들림
    this.vel.x += wind.x * 0.02;
    this.vel.x += (noise(this.seed, frameCount * 0.006) - 0.5) * 0.04;
    this.vel.y -= 0.002;
    this.vel.mult(0.988);

    this.pos.add(this.vel);
    this.life -= 0.6;

    if (this.life <= 0 || this.pos.y < -30 || this.pos.x < -40 || this.pos.x > width + 40) {
      this.dead = true;
    }
  }

  display() {
    const a = constrain(this.life, 0, 255);
    noStroke();
    // 빛을 더하는 방식으로 그려서 어두운 배경에서 은은하게 빛나게
    blendMode(ADD);
    fill(255, 214, 130, a * 0.055);
    ellipse(this.pos.x, this.pos.y, this.size * 7);
    fill(255, 236, 180, a * 0.7);
    ellipse(this.pos.x, this.pos.y, this.size * 1.3);
    blendMode(BLEND);
  }
}

class PollenField extends ParticleSystem {
  release(pos) {
    if (this.particles.length >= MAX_POLLEN) return;
    this.add(new Pollen(pos));
  }
}
