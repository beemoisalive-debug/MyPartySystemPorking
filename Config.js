// 화면 크기와 공통 수치

const CANVAS_W = 760;
const CANVAS_H = 540;

// 땅(꽃밭)의 높이
const GROUND_Y = 496;

// 동시에 유지할 입자 수
const MAX_BLOOMS = 120;
const MAX_POLLEN = 260;

// 얼굴 기준 좌표 (캔버스 중앙)
const FACE = { cx: 380, cy: 200, w: 190, h: 226 };
const EYE = { y: 6, dx: 44, w: 50, h: 32 };

// 눈물이 흘러나오는 눈꼬리
const TEAR_L = { x: FACE.cx - EYE.dx - 21, y: FACE.cy + EYE.y + 13 };
const TEAR_R = { x: FACE.cx + EYE.dx + 21, y: FACE.cy + EYE.y + 13 };
