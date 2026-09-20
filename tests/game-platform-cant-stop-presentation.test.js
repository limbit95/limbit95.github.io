import assert from "node:assert/strict";
import { test } from "node:test";

import {
  CANT_STOP_PRESENTATION_TIMINGS,
  createCantStopPresentationCoordinator,
} from "../games/cant-stop/presentation.js";

function state({
  version,
  busy = false,
  busyAction = null,
  phase = "TURN_ROLL",
  activePlayerId = "alice",
  effect = null,
} = {}) {
  return {
    view: "playing",
    busy,
    busyAction,
    effect,
    snapshot: {
      version,
      room: { id: "room-1", status: "playing" },
      game: {
        phase,
        activePlayerId,
      },
    },
  };
}

function fakeClock() {
  let current = 0;
  let nextId = 1;
  const timers = new Map();

  return {
    now: () => current,
    schedule(callback, delay) {
      const id = nextId++;
      timers.set(id, { at: current + delay, callback });
      return id;
    },
    cancel(id) {
      timers.delete(id);
    },
    advance(ms) {
      const target = current + ms;
      while (true) {
        const due = [...timers.entries()]
          .filter(([, timer]) => timer.at <= target)
          .sort((a, b) => a[1].at - b[1].at)[0];
        if (!due) break;
        const [id, timer] = due;
        timers.delete(id);
        current = timer.at;
        timer.callback();
      }
      current = target;
    },
  };
}

test("Can't Stop presentation keeps the rolling snapshot mounted until a full dice cycle finishes", () => {
  const clock = fakeClock();
  const presented = [];
  const coordinator = createCantStopPresentationCoordinator({
    onPresent: (next) => presented.push(next),
    now: clock.now,
    schedule: clock.schedule,
    cancel: clock.cancel,
  });

  coordinator.receive(state({
    version: 10,
    busy: true,
    busyAction: "rollDice",
  }));
  clock.advance(240);
  coordinator.receive(state({
    version: 11,
    busy: true,
    busyAction: "rollDice",
    phase: "PAIRING_SELECTION",
  }));
  coordinator.receive(state({
    version: 11,
    busy: false,
    phase: "PAIRING_SELECTION",
  }));

  assert.equal(presented.length, 1);
  assert.equal(presented[0].snapshot.version, 10);
  assert.equal(presented[0].busyAction, "rollDice");

  clock.advance(CANT_STOP_PRESENTATION_TIMINGS.rollCycleMs - 240 - 1);
  assert.equal(presented.length, 1);

  clock.advance(1);
  assert.equal(presented.length, 2);
  assert.equal(presented[1].snapshot.version, 11);
  assert.equal(presented[1].busy, false);
});

test("Can't Stop presentation completes the dice cycle, then plays bust on the previous board before applying the next turn", () => {
  const clock = fakeClock();
  const presented = [];
  const coordinator = createCantStopPresentationCoordinator({
    onPresent: (next) => presented.push(next),
    now: clock.now,
    schedule: clock.schedule,
    cancel: clock.cancel,
  });

  coordinator.receive(state({
    version: 20,
    busy: true,
    busyAction: "rollDice",
    activePlayerId: "alice",
  }));
  clock.advance(300);
  coordinator.receive(state({
    version: 21,
    busy: false,
    activePlayerId: "bob",
    effect: { type: "bust", playerId: "alice", version: 21 },
  }));

  clock.advance(600);
  assert.equal(presented.length, 2);
  assert.equal(presented[1].snapshot.version, 20);
  assert.equal(presented[1].effect.type, "bust");

  clock.advance(CANT_STOP_PRESENTATION_TIMINGS.bustMs - 1);
  assert.equal(presented.at(-1).snapshot.version, 20);

  clock.advance(1);
  assert.equal(presented.at(-1).snapshot.version, 21);
  assert.equal(presented.at(-1).effect, null);
});

test("Can't Stop presentation stages a remote bust on the currently displayed board", () => {
  const clock = fakeClock();
  const presented = [];
  const coordinator = createCantStopPresentationCoordinator({
    onPresent: (next) => presented.push(next),
    now: clock.now,
    schedule: clock.schedule,
    cancel: clock.cancel,
  });

  coordinator.receive(state({ version: 30, activePlayerId: "alice" }));
  coordinator.receive(state({
    version: 31,
    activePlayerId: "bob",
    effect: { type: "bust", playerId: "alice", version: 31 },
  }));

  assert.equal(presented.at(-1).snapshot.version, 30);
  assert.equal(presented.at(-1).effect.type, "bust");

  clock.advance(CANT_STOP_PRESENTATION_TIMINGS.bustMs);
  assert.equal(presented.at(-1).snapshot.version, 31);
  assert.equal(presented.at(-1).effect, null);
});


test("Can't Stop presentation keeps local bust feedback when a same-version realtime refresh drops the effect", () => {
  const clock = fakeClock();
  const presented = [];
  const coordinator = createCantStopPresentationCoordinator({
    onPresent: (next) => presented.push(next),
    now: clock.now,
    schedule: clock.schedule,
    cancel: clock.cancel,
  });

  coordinator.receive(state({
    version: 40,
    busy: true,
    busyAction: "rollDice",
    activePlayerId: "alice",
  }));

  clock.advance(240);
  coordinator.receive(state({
    version: 41,
    busy: true,
    busyAction: "rollDice",
    activePlayerId: "bob",
    effect: { type: "bust", playerId: "alice", version: 41 },
  }));

  coordinator.receive(state({
    version: 41,
    busy: false,
    activePlayerId: "bob",
    effect: null,
  }));

  clock.advance(CANT_STOP_PRESENTATION_TIMINGS.rollCycleMs - 240);

  assert.equal(presented.at(-1).snapshot.version, 40);
  assert.equal(presented.at(-1).effect?.type, "bust");
  assert.equal(presented.at(-1).effect?.playerId, "alice");

  coordinator.receive(state({
    version: 41,
    busy: false,
    activePlayerId: "bob",
    effect: null,
  }));

  clock.advance(CANT_STOP_PRESENTATION_TIMINGS.bustMs - 1);
  assert.equal(presented.at(-1).snapshot.version, 40);
  assert.equal(presented.at(-1).effect?.type, "bust");

  clock.advance(1);
  assert.equal(presented.at(-1).snapshot.version, 41);
  assert.equal(presented.at(-1).effect, null);
});


test("Can't Stop bust notice timing is five seconds", () => {
  assert.equal(CANT_STOP_PRESENTATION_TIMINGS.bustMs, 5000);
});
