import test from "node:test";
import assert from "node:assert/strict";

import { buildRotationPlan, enumerateDates, normalizePeople } from "./rotation.js";

function seededRandom(seed = 1) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 2 ** 32;
  };
}

test("기간의 시작일과 종료일을 모두 포함한다", () => {
  assert.deepEqual(
    enumerateDates("2026-09-20", "2026-09-22"),
    ["2026-09-20", "2026-09-21", "2026-09-22"],
  );
});

test("중복과 빈 이름을 제거한다", () => {
  assert.deepEqual(normalizePeople(["민수", " ", "지수", "민수"]), ["민수", "지수"]);
});

test("배정 횟수 차이는 최대 1회이며 연속 담당자를 피한다", () => {
  const plan = buildRotationPlan({
    startDate: "2026-09-20",
    endDate: "2026-10-03",
    people: ["민수", "지수", "하늘"],
    random: seededRandom(42),
  });

  const counts = Object.values(plan.counts);
  assert.equal(plan.assignments.length, 14);
  assert.ok(Math.max(...counts) - Math.min(...counts) <= 1);

  for (let index = 1; index < plan.assignments.length; index += 1) {
    assert.notEqual(plan.assignments[index - 1].person, plan.assignments[index].person);
  }
});

test("종료일이 시작일보다 빠르면 생성하지 않는다", () => {
  assert.throws(
    () => buildRotationPlan({
      startDate: "2026-09-21",
      endDate: "2026-09-20",
      people: ["민수"],
    }),
    /종료일/,
  );
});

test("366일을 초과하는 기간은 날짜 배열 생성 전에 거절한다", () => {
  assert.throws(
    () => buildRotationPlan({
      startDate: "1000-01-01",
      endDate: "9999-12-31",
      people: ["민수", "지수"],
    }),
    /최대 366일/,
  );
});
