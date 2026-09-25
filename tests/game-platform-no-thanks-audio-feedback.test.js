import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const runtime = readFileSync(
  new URL("../games/no-thanks/main.js", import.meta.url),
  "utf8",
);
const sfx = readFileSync(
  new URL("../games/no-thanks/sfx.js", import.meta.url),
  "utf8",
);

test("No Thanks! rules identify zero chips as the player's own chip supply", () => {
  assert.match(
    runtime,
    /플레이어 본인이 보유한 칩이 0개라면 거절할 수 없습니다\. 중앙 카드 위에 쌓인 칩 수와는 관계없습니다\./u,
  );
});

test("No Thanks! opening setup uses one coordinated sound timeline", () => {
  assert.match(runtime, /playNoThanksOpeningSound\(\);[\s\S]*?Promise\.all\(\[/u);
  assert.match(sfx, /share one coordinated timeline/u);
  assert.match(sfx, /scheduleCardShuffleBeat/u);
  assert.match(sfx, /scheduleCoinHit/u);
});

test("No Thanks! take sound combines card movement with collected chips", () => {
  assert.equal(
    runtime.match(/playNoThanksTakeSound\(\{ chipCount: presentation\.chipCount \}\);/gu)?.length,
    2,
  );
  assert.match(sfx, /const audibleChipCount = Math\.min\(7, safeChipCount\)/u);
});

test("No Thanks! refusal chip sound waits for the authoritative chip transition", () => {
  assert.match(
    runtime,
    /effect\?\.chipFromPlayerId[\s\S]*?effect\.soundPlayed !== true[\s\S]*?playNoThanksChipSound\(\)[\s\S]*?effect\.soundPlayed = true/u,
  );
});
