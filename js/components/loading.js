import { el } from "../ui.js";

export function cardSkeleton(count = 3) {
  const grid = el("div", { className: "activity-grid", role: "status", "aria-label": "활동 목록 불러오는 중" });
  for (let index = 0; index < count; index += 1) {
    grid.append(el("div", { className: "card page-stack", "aria-hidden": "true" }, [
      el("div", { className: "skeleton", style: { width: "35%" } }),
      el("div", { className: "skeleton", style: { width: "80%", minHeight: "28px" } }),
      el("div", { className: "skeleton", style: { width: "62%" } }),
      el("div", { className: "skeleton", style: { minHeight: "44px" } }),
    ]));
  }
  return grid;
}
