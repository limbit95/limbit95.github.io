import test from "node:test";
import assert from "node:assert/strict";

import { createClassicTollNotice } from "../js/tollNotice.js";

test("toll notice keeps only the information the payer needs", () => {
  const state = {
    board: {
      nodes: [{
        id: "paris",
        label: "파리",
        type: "PROPERTY",
        tollByLevel: [52, 104, 208, 416],
      }],
    },
    players: [
      { id: "payer", name: "플레이어 A", seat: 0 },
      { id: "owner", name: "플레이어 B", seat: 1 },
    ],
    boardState: {
      properties: {
        paris: { ownerId: "owner", buildingLevel: 2 },
      },
    },
    lastEvents: [
      { type: "TILE_LANDED", playerId: "payer", nodeId: "paris" },
      { type: "MONEY_PAID", playerId: "payer", creditorId: "owner", amount: 208, reason: "TOLL" },
    ],
  };

  const notice = createClassicTollNotice(state);
  assert.equal(notice.city, "파리");
  assert.equal(notice.ownerName, "플레이어 B");
  assert.equal(notice.ownerSeat, 1);
  assert.equal(notice.amount, 208);
  assert.match(notice.amountLabel, /208/);
  assert.match(notice.effect, /건물 2단계/);
  assert.equal(Object.hasOwn(notice, "purchasePrice"), false);
  assert.equal(Object.hasOwn(notice, "buildCost"), false);
});
