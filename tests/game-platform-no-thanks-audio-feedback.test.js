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

test("No Thanks! opening setup uses one coordinated tactile sound timeline", () => {
  assert.match(runtime, /playNoThanksOpeningSound\(\);[\s\S]*?Promise\.all\(\[/u);
  assert.match(sfx, /share one coordinated timeline/u);
  assert.match(sfx, /scheduleCardShuffleBeat/u);
  assert.match(sfx, /scheduleChipStackHit/u);
});

test("No Thanks! take sound uses a card slide followed by stacked chip impacts", () => {
  assert.equal(
    runtime.match(/playNoThanksTakeSound\(\{ chipCount: presentation\.chipCount \}\);/gu)?.length,
    2,
  );
  assert.match(sfx, /function scheduleCardSlide/u);
  assert.match(sfx, /cardstock sliding across a tabletop/u);
  assert.match(sfx, /const audibleChipCount = Math\.min\(8, safeChipCount\)/u);
  assert.match(sfx, /const landingAt = startAt \+ 0\.39/u);
  assert.doesNotMatch(sfx, /startFrequency: 760/u);
});

test("No Thanks! refusal chip sound lands with the authoritative chip animation", () => {
  assert.match(
    runtime,
    /chipFlight\.addEventListener\("animationend"[\s\S]*?effect\?\.soundPlayed !== true[\s\S]*?playNoThanksChipSound\(\)[\s\S]*?effect\.soundPlayed = true/u,
  );
  assert.match(sfx, /plastic chip[\s\S]*?"착"/u);
});
