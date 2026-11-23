// 외부 힘: 바람
//
// 이 작품에서 유일한 "외부 힘"이다.
// 눈물(TearDrop), 꽃(Bloom), 꽃가루(Pollen)가 모두 이 하나의 벡터를 공유한다.
// 그래서 바람이 바뀌면 세 시스템의 결과가 동시에 달라진다.

const Wind = {
  v: null,        // 현재 바람 벡터
  target: null,   // 목표 바람 벡터

  init() {
    this.v = createVector(0, 0);
    this.target = createVector(0, 0);
  },

  // 마우스 위치 / 방향키를 하나의 힘으로 합친다
  update() {
    let base = 0;

    // 마우스가 캔버스 안에 있으면 좌우 위치가 바람이 된다
    if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
      base += map(mouseX, 0, width, -1.6, 1.6);
    }

    // 방향키
    if (keyIsDown(LEFT_ARROW)) base -= 1.6;
    if (keyIsDown(RIGHT_ARROW)) base += 1.6;

    // 아주 약한 자연 바람 (없으면 정지해 보인다)
    base += (noise(frameCount * 0.0035) * 2 - 1) * 0.35;

    this.target.set(base, 0);
    this.v.lerp(this.target, 0.06);
  },
};
