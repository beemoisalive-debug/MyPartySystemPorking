// Particle을 상속받은 새 입자
// - 시각: 수명이 줄면 물방울 → 꽃으로 변한다 (display 오버라이드)
// - 기능: 꽃이 된 뒤에는 공중에서 천천히 떠다니며 사라진다 (update 오버라이드)

class MorphingTear extends Particle {
  constructor(position) {
    super(position);                    // 부모 생성자 먼저 호출 (필수)

    // 꽃이 되면 쓸 값들
    this.rotation = random(TWO_PI);
    this.spin = random(-0.05, 0.05);
    this.petals = floor(random(5, 8));
    this.petalColor = random([
      [255, 185, 212],
      [255, 214, 170],
      [206, 190, 255],
      [180, 226, 255],
    ]);
  }

  update() {
    super.update();                     // 부모의 낙하·수명 계산은 그대로

    this.rotation += this.spin;

    // 꽃이 되면 낙하 속도가 줄어 공중에 머문다
    if (this.lifespan < 190) {
      this.velocity.mult(0.96);
    }
  }

  display() {
    // 아직 물방울일 때는 부모의 그림을 그대로 쓴다
    if (this.lifespan > 190) {
      super.display();
      return;
    }

    // 물방울 → 꽃으로 피어나는 정도 (0~1)
    const bloom = constrain(map(this.lifespan, 190, 150, 0, 1), 0, 1);
    // 꽃이 된 뒤 서서히 사라지는 투명도
    const alpha = constrain(map(this.lifespan, 150, 0, 255, 0), 0, 255);

    push();
    translate(this.position.x, this.position.y);
    rotate(this.rotation);

    noStroke();

    // 꽃잎
    const size = this.size * (1.1 + bloom * 0.9);
    for (let i = 0; i < this.petals; i++) {
      rotate(TWO_PI / this.petals);
      fill(this.petalColor[0], this.petalColor[1], this.petalColor[2], alpha * 0.85);
      ellipse(0, -size * 0.8, size * 0.6, size * 1.15);
    }

    // 꽃술
    fill(255, 238, 170, alpha);
    ellipse(0, 0, size * 0.6, size * 0.6);

    pop();
  }
}
