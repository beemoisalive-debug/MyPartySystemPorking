// ParticleSystem
//
// 큰 객체(시스템)가 작은 객체(입자)를 여러 개 관리하는 기본 클래스.
// 이 작품에서는 성격이 다른 세 시스템이 이 클래스를 상속한다.
//   - TearSystem  : 눈에서 떨어지는 눈물
//   - Garden      : 땅에 내린 눈물이 피워낸 꽃
//   - PollenField : 꽃에서 올라오는 꽃가루

class ParticleSystem {
  constructor() {
    this.particles = [];
  }

  add(p) {
    this.particles.push(p);
    return p;
  }

  // 모든 시스템이 같은 외부 힘(Wind)을 받는다
  run() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.update(Wind.v);
      p.display();
      if (p.dead) this.particles.splice(i, 1);
    }
  }

  get count() {
    return this.particles.length;
  }
}
