import test from "node:test";
import assert from "node:assert/strict";

import { createClassicTileInfo } from "../js/tileInfo.js";
import { CLASSIC_RULES } from "../js/themes/classic/rules.js";
import { formatThemeMoney } from "../js/themes/money.js";

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
      { id: "event-east", type: "EVENT", label: "여행 소식" },
      { id: "start", type: "START", label: "출발 · 서울" },
    ],
  },
  boardState: {
    properties: {
      paris: { ownerId: "player-a", buildingLevel: 2 },
    },
  },
  players: [{ id: "player-a", name: "플레이어 A" }],
  lastEvents: [],
};

test("Classic uses a theme-scoped gold currency profile", () => {
  assert.equal(CLASSIC_RULES.currency.code, "gold");
  assert.equal(CLASSIC_RULES.currency.label, "골드");
  assert.equal(formatThemeMoney(1500, CLASSIC_RULES.currency), "1,500 골드");
  assert.equal(formatThemeMoney(-120, CLASSIC_RULES.currency, { signed: true }), "-120 골드");
});

test("property tile info exposes price, owner, building level and current toll", () => {
  const info = createClassicTileInfo(state, "paris");

  assert.equal(info.title, "파리");
  assert.equal(info.typeLabel, "도시");
  assert.deepEqual(info.stats, [
    { label: "구매가", value: "380 골드" },
    { label: "현재 통행료", value: "208 골드" },
    { label: "소유자", value: "플레이어 A" },
    { label: "건물", value: "2 / 3 단계" },
    { label: "건설 비용", value: "190 골드" },
  ]);
});

test("special tile info explains direct effects", () => {
  const tax = createClassicTileInfo(state, "tax");
  const start = createClassicTileInfo(state, "start", { startSalary: 250 });

  assert.equal(tax.stats[0].value, "-120 골드");
  assert.match(tax.effect, /차감/);
  assert.equal(start.stats[0].value, "+250 골드");
  assert.match(start.summary, /250 골드/);
});

test("event landing info exposes the actual drawn event result", () => {
  const eventState = {
    ...state,
    lastEvents: [
      { type: "TILE_LANDED", playerId: "player-a", nodeId: "event-east" },
      { type: "EVENT_DRAWN", playerId: "player-a", eventId: "travel-grant", label: "여행 지원금을 받았습니다." },
      { type: "MONEY_RECEIVED", playerId: "player-a", amount: 120, reason: "EVENT" },
    ],
  };
  const info = createClassicTileInfo(eventState, "event-east");

  assert.equal(info.typeLabel, "이벤트");
  assert.equal(info.summary, "여행 지원금을 받았습니다.");
  assert.deepEqual(info.stats, [
    { label: "이벤트", value: "여행 지원금을 받았습니다." },
    { label: "골드 변화", value: "+120 골드" },
  ]);
  assert.match(info.effect, /즉시/);
});

test("unknown node returns null", () => {
  assert.equal(createClassicTileInfo(state, "missing"), null);
});
