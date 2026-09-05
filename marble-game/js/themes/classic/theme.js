import { createClassicBoard } from "./board.js";
import { CLASSIC_RULES } from "./rules.js";

export const classicTheme = Object.freeze({
  id: "classic",
  name: "Classic",
  title: "세계일주",
  icon: "🌍",
  status: "core",
  engineReady: true,
  playable: true,
  description: "도시를 사고 건설하며 세계를 한 바퀴 도는 가장 익숙한 기준 테마입니다.",
  highlights: Object.freeze(["도시 소유", "건설", "통행료", "특수 타일"]),
  renderer: Object.freeze({ environmentKey: "classic-world" }),
  rules: CLASSIC_RULES,
  createBoard: createClassicBoard,
});
