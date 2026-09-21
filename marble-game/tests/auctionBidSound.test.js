import test from "node:test";
import assert from "node:assert/strict";

import { playAuctionBidSound } from "../js/auctionBidSound.js?v=20260922-r2";

function createFakeAudioContext() {
  const oscillators = [];
  const gains = [];

  return {
    state: "running",
    currentTime: 4,
    destination: { type: "destination" },
    oscillators,
    gains,
    createOscillator() {
      const record = {
        type: "",
        starts: [],
        stops: [],
        frequency: {
          setValueAtTime(value, at) {
            record.startFrequency = { value, at };
          },
          exponentialRampToValueAtTime(value, at) {
            record.endFrequency = { value, at };
          },
        },
        connect(node) {
          record.connectedTo = node;
        },
        start(at) {
          record.starts.push(at);
        },
        stop(at) {
          record.stops.push(at);
        },
      };
      oscillators.push(record);
      return record;
    },
    createGain() {
      const record = {
        gain: {
          setValueAtTime(value, at) {
            record.initialGain = { value, at };
          },
          exponentialRampToValueAtTime(value, at) {
            record.ramps ??= [];
            record.ramps.push({ value, at });
          },
        },
        connect(node) {
          record.connectedTo = node;
        },
      };
      gains.push(record);
      return record;
    },
  };
}

test("Auction bid sound synthesizes one compact gavel cue", () => {
  const context = createFakeAudioContext();

  assert.equal(playAuctionBidSound({ context }), true);
  assert.equal(context.oscillators.length, 2);
  assert.equal(context.gains.length, 2);
  assert.deepEqual(context.oscillators.map((oscillator) => oscillator.type), ["triangle", "square"]);
  assert.deepEqual(context.oscillators.map((oscillator) => oscillator.startFrequency.value), [210, 980]);
  assert.deepEqual(context.oscillators.map((oscillator) => oscillator.endFrequency.value), [92, 360]);
  assert.ok(context.oscillators.every((oscillator) => oscillator.starts[0] === 4.01));
  assert.ok(context.oscillators.every((oscillator) => oscillator.stops[0] > oscillator.starts[0]));
  assert.ok(context.gains.every((gain) => gain.connectedTo === context.destination));
});
