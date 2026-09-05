import { createBoardGraph } from "../../core/boardGraph.js";

const FOUNDATION_NODES = [
  { id: "start", type: "START", label: "출발" },
  { id: "city-a", type: "PROPERTY", label: "도시 A" },
  { id: "event-a", type: "EVENT", label: "이벤트" },
  { id: "city-b", type: "PROPERTY", label: "도시 B" },
];

const FOUNDATION_EDGES = [
  { from: "start", to: "city-a" },
  { from: "city-a", to: "event-a" },
  { from: "event-a", to: "city-b" },
  { from: "city-b", to: "start" },
];

export const classicTheme = Object.freeze({
  id: "classic",
  name: "Classic",
  title: "세계일주",
  icon: "🌍",
  status: "foundation",
  engineReady: true,
  playable: false,
  description: "도시를 사고 건설하며 세계를 한 바퀴 도는 가장 익숙한 기준 테마입니다.",
  highlights: Object.freeze(["도시 소유", "건설", "통행료", "경매·거래 확장 예정"]),
  renderer: Object.freeze({ environmentKey: "classic-world" }),
  createBoard() {
    return createBoardGraph({
      nodes: FOUNDATION_NODES,
      edges: FOUNDATION_EDGES,
      startNodeId: "start",
    });
  },
});
