// Garden — 꽃(Bloom)들을 관리하는 시스템
//
// 눈물이 땅에 닿으면 그 자리에 꽃을 심는다.
// 꽃이 너무 많아지면 가장 오래된 꽃부터 시들게 해서 꽃밭의 크기를 유지한다.

class Garden extends ParticleSystem {
  constructor(y) {
    super();
    this.y = y;
  }

  plant(x) {
    // 살짝 흩어지게 해서 두 덩어리로 뭉치지 않도록
    let px = x + random(-14, 14);
    for (let i = 0; i < this.particles.length; i++) {
      if (abs(this.particles[i].base.x - px) < 8) {
        px += random(-10, 10);
        break;
      }
    }
    px = constrain(px, 14, width - 14);

    // 너무 많으면 가장 오래된 꽃부터 시든다
    const living = this.particles.filter((b) => b.wither >= 1);
    if (living.length >= MAX_BLOOMS) living[0].wither = Math.min(living[0].wither, 0.98);

    return this.add(new Bloom(px, this.y + random(-6, 14)));
  }
}
