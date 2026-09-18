import test from "node:test";
import assert from "node:assert/strict";

import {
  createTradeProposal,
  reduceTradeProposal,
} from "../js/core/trade.js";
import {
  normalizeTradeSettlementTerms,
  settleAcceptedTrade,
} from "../js/core/tradeSettlement.js";

function players(overrides = {}) {
  return ["a", "b", "c"].map((id, seat) => ({
    id,
    seat,
    money: 1500,
    bankrupt: false,
    ...(overrides[id] ?? {}),
  }));
}

function boardState(overrides = {}) {
  return {
    properties: {
      singapore: { ownerId: "a", buildingLevel: 0 },
      seoul: { ownerId: "b", buildingLevel: 0 },
      tokyo: { ownerId: "a", buildingLevel: 1 },
      ...(overrides.properties ?? {}),
    },
  };
}

function acceptedProposal({
  terms = {
    offered: { propertyIds: ["singapore"], gold: 100 },
    requested: { propertyIds: ["seoul"], gold: 50 },
  },
  participantState = players(),
} = {}) {
  const proposal = createTradeProposal({
    offerId: "trade-1",
    proposerPlayerId: "a",
    recipientPlayerId: "b",
    terms,
    players: participantState,
  });
  return reduceTradeProposal(proposal, participantState, {
    playerId: "b",
    accept: true,
  }).proposal;
}

test("trade settlement terms normalize property ids and gold", () => {
  const terms = normalizeTradeSettlementTerms({
    offered: { propertyIds: ["singapore"], gold: 100 },
    requested: { propertyIds: ["seoul"] },
  });

  assert.deepEqual(terms, {
    offered: { propertyIds: ["singapore"], gold: 100 },
    requested: { propertyIds: ["seoul"], gold: 0 },
  });
  assert.equal(Object.isFrozen(terms), true);
  assert.equal(Object.isFrozen(terms.offered.propertyIds), true);
});

test("trade settlement rejects empty, invalid and overlapping assets", () => {
  assert.throws(
    () => normalizeTradeSettlementTerms({ offered: {}, requested: {} }),
    /exchange at least one asset/i,
  );
  assert.throws(
    () => normalizeTradeSettlementTerms({ offered: { gold: -1 } }),
    /non-negative integer/i,
  );
  assert.throws(
    () => normalizeTradeSettlementTerms({ offered: { propertyIds: ["singapore", "singapore"] } }),
    /must be unique/i,
  );
  assert.throws(
    () => normalizeTradeSettlementTerms({
      offered: { propertyIds: ["singapore"] },
      requested: { propertyIds: ["singapore"] },
    }),
    /cannot be offered and requested/i,
  );
});

test("accepted trade atomically exchanges property ownership and gold", () => {
  const result = settleAcceptedTrade({
    proposal: acceptedProposal(),
    players: players(),
    boardState: boardState(),
  });

  assert.equal(result.players.find((player) => player.id === "a").money, 1450);
  assert.equal(result.players.find((player) => player.id === "b").money, 1550);
  assert.equal(result.boardState.properties.singapore.ownerId, "b");
  assert.equal(result.boardState.properties.seoul.ownerId, "a");
  assert.equal(result.boardState.properties.singapore.buildingLevel, 0);
  assert.equal(result.events[0].type, "TRADE_SETTLED");
  assert.equal(result.events[0].offerId, "trade-1");
});

test("settlement requires accepted proposal and current ownership", () => {
  const openProposal = createTradeProposal({
    offerId: "trade-1",
    proposerPlayerId: "a",
    recipientPlayerId: "b",
    terms: { offered: { propertyIds: ["singapore"] } },
    players: players(),
  });

  assert.throws(
    () => settleAcceptedTrade({
      proposal: openProposal,
      players: players(),
      boardState: boardState(),
    }),
    /must be accepted/i,
  );

  assert.throws(
    () => settleAcceptedTrade({
      proposal: acceptedProposal({
        terms: { offered: { propertyIds: ["singapore"] } },
      }),
      players: players(),
      boardState: boardState({
        properties: { singapore: { ownerId: "c", buildingLevel: 0 } },
      }),
    }),
    /does not own property/i,
  );
});

test("settlement revalidates both players gold balances at acceptance time", () => {
  assert.throws(
    () => settleAcceptedTrade({
      proposal: acceptedProposal({
        terms: { offered: { gold: 1200 }, requested: { propertyIds: ["seoul"] } },
      }),
      players: players({ a: { money: 1000 } }),
      boardState: boardState(),
    }),
    /proposer cannot afford offered gold/i,
  );

  assert.throws(
    () => settleAcceptedTrade({
      proposal: acceptedProposal({
        terms: { offered: { propertyIds: ["singapore"] }, requested: { gold: 1200 } },
      }),
      players: players({ b: { money: 1000 } }),
      boardState: boardState(),
    }),
    /recipient cannot afford requested gold/i,
  );
});

test("settlement rejects bankrupt participants that became stale after proposal creation", () => {
  const proposal = acceptedProposal({
    terms: { offered: { propertyIds: ["singapore"] } },
  });

  assert.throws(
    () => settleAcceptedTrade({
      proposal,
      players: players({ a: { bankrupt: true } }),
      boardState: boardState(),
    }),
    /Bankrupt trade proposer/i,
  );
  assert.throws(
    () => settleAcceptedTrade({
      proposal,
      players: players({ b: { bankrupt: true } }),
      boardState: boardState(),
    }),
    /Bankrupt trade recipient/i,
  );
});

test("improved properties remain blocked until their product rule is decided", () => {
  const proposal = acceptedProposal({
    terms: { offered: { propertyIds: ["tokyo"] } },
  });

  assert.throws(
    () => settleAcceptedTrade({
      proposal,
      players: players(),
      boardState: boardState(),
    }),
    /Improved property cannot be traded yet/i,
  );
});

test("settlement does not mutate the original players or board state", () => {
  const originalPlayers = players();
  const originalBoard = boardState();

  settleAcceptedTrade({
    proposal: acceptedProposal(),
    players: originalPlayers,
    boardState: originalBoard,
  });

  assert.equal(originalPlayers[0].money, 1500);
  assert.equal(originalPlayers[1].money, 1500);
  assert.equal(originalBoard.properties.singapore.ownerId, "a");
  assert.equal(originalBoard.properties.seoul.ownerId, "b");
});
