import test from "node:test";
import assert from "node:assert/strict";

import { createClassicTileInfo } from "../js/tileInfo.js";

const state = {
  board: {
    nodes: [
      {
        id: "paris",
        type: "PROPERTY",
        label: "파리",
        price: 380,
        buildCost: 190,
        tollByLevel: [52, 104, 208, 364],
        maxBuildingLevel: 3,
      },
      { id: "tax", type: "TAX", label: "공항 이용료", amount: 120 },
      { id: "start", type: "START", label: "출발 · 서울" },
    ],
  },
  boardState: {
    properties: {
      paris: { ownerId: "player-a", buildingLevel: 2 },
    },
  },
  players: [{ id: "player-a", name: "플레이어 A" }],
};

test("property tile info exposes price, owner, building level and current toll", () => {
  const info = createClassicTileInfo(state, "paris");

  assert.equal(info.title, "파리");
  assert.equal(info.typeLabel, "도시");
  assert.deepEqual(info.stats, [
    { label: "구매가", value: "M 380" },
    { label: "현재 통행료", value: "M 208" },
    { label: "소유자", value: "플레이어 A" },
    { label: "건물", value: "2 / 3 단계" },
    { label: "건설 비용", value: "M 190" },
  ]);
});

test("special tile info explains direct effects", () => {
  const tax = createClassicTileInfo(state, "tax");
  const start = createClassicTileInfo(state, "start", { startSalary: 250 });

  assert.equal(tax.stats[0].value, "- M 120");
  assert.match(tax.effect, /차감/);
  assert.equal(start.stats[0].value, "+ M 250");
  assert.match(start.summary, /M 250/);
});

test("unknown node returns null", () => {
  assert.equal(createClassicTileInfo(state, "missing"), null);
});
