import { createBoardGraph } from "../../core/boardGraph.js";

const property = (id, label, price, baseToll, buildCost) => ({
  id,
  type: "PROPERTY",
  label,
  price,
  buildCost,
  tollByLevel: [baseToll, baseToll * 2, baseToll * 4, baseToll * 7],
  maxBuildingLevel: 3,
});

export const CLASSIC_NODES = Object.freeze([
  { id: "start", type: "START", label: "출발 · 서울" },
  property("tokyo", "도쿄", 240, 28, 120),
  { id: "event-east", type: "EVENT", label: "여행 소식" },
  property("singapore", "싱가포르", 260, 30, 130),
  property("sydney", "시드니", 280, 34, 140),
  { id: "tax-airport", type: "TAX", label: "공항 이용료", amount: 120 },
  property("cairo", "카이로", 300, 38, 150),
  property("athens", "아테네", 320, 42, 160),
  { id: "rest", type: "REST", label: "휴식", skipTurns: 1 },
  property("rome", "로마", 340, 46, 170),
  { id: "event-europe", type: "EVENT", label: "세계 뉴스" },
  property("paris", "파리", 380, 52, 190),
  property("london", "런던", 400, 56, 200),
  { id: "bonus", type: "BONUS", label: "여행 지원금", amount: 150 },
  property("new-york", "뉴욕", 440, 64, 220),
  property("mexico-city", "멕시코시티", 360, 48, 180),
  { id: "event-america", type: "EVENT", label: "뜻밖의 소식" },
  property("rio", "리우", 400, 56, 200),
  property("vancouver", "밴쿠버", 420, 60, 210),
  property("honolulu", "호놀룰루", 300, 38, 150),
]);

export const CLASSIC_EDGES = Object.freeze(CLASSIC_NODES.map((node, index) => ({
  id: `classic-route-${index}`,
  from: node.id,
  to: CLASSIC_NODES[(index + 1) % CLASSIC_NODES.length].id,
})));

export function createClassicBoard() {
  return createBoardGraph({ nodes: CLASSIC_NODES, edges: CLASSIC_EDGES, startNodeId: "start" });
}
