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
  assert.match(sfx, /peakGain: 0\.084/u);
  assert.match(sfx, /peakGain: 0\.044/u);
  assert.match(sfx, /const landingAt = startAt \+ 0\.39/u);
  assert.match(sfx, /weight: 1\.44 \+ \(\(index % 2\) \* 0\.16\)/u);
  assert.doesNotMatch(sfx, /startFrequency: 760/u);
});

test("No Thanks! refusal chip sound follows the authoritative chip flight and landing", () => {
  assert.match(
    runtime,
    /playNoThanksChipSound\(\{ travelMs: 620 \}\)[\s\S]*?chipFlight\.classList\.add\("is-motion-ready"\)/u,
  );
  assert.match(
    runtime,
    /prefersReducedMotion\(\)[\s\S]*?playNoThanksChipSound\(\{ travelMs: 0 \}\)/u,
  );
  assert.match(sfx, /"스윽 → 착"/u);
  assert.match(sfx, /durationMs: Math\.max\(120, safeTravelMs - 90\)/u);
  assert.match(sfx, /Math\.max\(0, safeTravelMs - 30\) \/ 1000/u);
  assert.match(sfx, /scheduleChipStackHit\(context, landingAt/u);
});
