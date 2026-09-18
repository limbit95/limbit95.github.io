import test from "node:test";
import assert from "node:assert/strict";

import {
  TRADE_STATUS,
  createTradeProposal,
  reduceTradeProposal,
} from "../js/core/trade.js";

function players(overrides = {}) {
  return ["a", "b", "c"].map((id, seat) => ({
    id,
    seat,
    money: 1500,
    bankrupt: false,
    ...(overrides[id] ?? {}),
  }));
}

function proposal(overrides = {}) {
  return createTradeProposal({
    offerId: "trade-1",
    proposerPlayerId: "a",
    recipientPlayerId: "b",
    terms: {
      offered: { propertyIds: ["singapore"] },
      requested: { propertyIds: ["seoul"] },
    },
    players: players(),
    ...overrides,
  });
}

test("trade proposal opens between two active players without interpreting asset semantics", () => {
  const trade = proposal();

  assert.equal(trade.type, "PLAYER_TRADE");
  assert.equal(trade.status, TRADE_STATUS.OPEN);
  assert.equal(trade.proposerPlayerId, "a");
  assert.equal(trade.recipientPlayerId, "b");
  assert.deepEqual(trade.terms, {
    offered: { propertyIds: ["singapore"] },
    requested: { propertyIds: ["seoul"] },
  });
  assert.equal(Object.isFrozen(trade), true);
  assert.equal(Object.isFrozen(trade.terms), true);
  assert.equal(Object.isFrozen(trade.terms.offered), true);
  assert.equal(Object.isFrozen(trade.terms.offered.propertyIds), true);
});

test("trade proposal rejects self trade, unknown players and bankrupt participants", () => {
  assert.throws(
    () => proposal({ recipientPlayerId: "a" }),
    /cannot trade with themselves/i,
  );
  assert.throws(
    () => proposal({ recipientPlayerId: "missing" }),
    /Unknown trade recipient/i,
  );
  assert.throws(
    () => proposal({ players: players({ b: { bankrupt: true } }) }),
    /Bankrupt players cannot be a trade recipient/i,
  );
});

test("trade proposal requires a non-empty opaque terms object", () => {
  assert.throws(
    () => proposal({ terms: {} }),
    /cannot be empty/i,
  );
  assert.throws(
    () => proposal({ terms: [] }),
    /must be an object/i,
  );
});

test("only the recipient can accept an open trade proposal", () => {
  const trade = proposal();

  assert.throws(
    () => reduceTradeProposal(trade, players(), { playerId: "a", accept: true }),
    /Only the trade recipient/i,
  );

  const result = reduceTradeProposal(trade, players(), { playerId: "b", accept: true });

  assert.equal(result.proposal.status, TRADE_STATUS.ACCEPTED);
  assert.equal(result.proposal.resolvedByPlayerId, "b");
  assert.deepEqual(result.events, [{
    type: "TRADE_ACCEPTED",
    offerId: "trade-1",
    proposerPlayerId: "a",
    recipientPlayerId: "b",
  }]);
});

test("recipient can reject an open trade proposal", () => {
  const result = reduceTradeProposal(proposal(), players(), { playerId: "b", reject: true });

  assert.equal(result.proposal.status, TRADE_STATUS.REJECTED);
  assert.equal(result.proposal.resolvedByPlayerId, "b");
  assert.equal(result.events[0].type, "TRADE_REJECTED");
});

test("trade response requires exactly one decision and cannot resolve twice", () => {
  const trade = proposal();

  assert.throws(
    () => reduceTradeProposal(trade, players(), { playerId: "b" }),
    /accept or reject exactly once/i,
  );
  assert.throws(
    () => reduceTradeProposal(trade, players(), { playerId: "b", accept: true, reject: true }),
    /accept or reject exactly once/i,
  );

  const accepted = reduceTradeProposal(trade, players(), { playerId: "b", accept: true }).proposal;
  assert.throws(
    () => reduceTradeProposal(accepted, players(), { playerId: "b", reject: true }),
    /already resolved/i,
  );
});

test("stale proposal cannot be accepted after either participant becomes bankrupt", () => {
  const trade = proposal();

  assert.throws(
    () => reduceTradeProposal(trade, players({ a: { bankrupt: true } }), { playerId: "b", accept: true }),
    /Bankrupt players cannot be a trade proposer/i,
  );
  assert.throws(
    () => reduceTradeProposal(trade, players({ b: { bankrupt: true } }), { playerId: "b", accept: true }),
    /Bankrupt players cannot be a trade recipient/i,
  );
});
