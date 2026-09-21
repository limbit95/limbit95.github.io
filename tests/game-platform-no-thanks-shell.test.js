import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const page = readFileSync(
  new URL("../games/no-thanks/index.html", import.meta.url),
  "utf8",
);
const runtime = readFileSync(
  new URL("../games/no-thanks/main.js", import.meta.url),
  "utf8",
);
const styles = readFileSync(
  new URL("../games/no-thanks/styles.css", import.meta.url),
  "utf8",
);

test("No Thanks! entry loads Supabase before the shared Game Shell runtime", () => {
  assert.match(page, /\.\.\/shared\/game-shell\.css/u);
  assert.match(page, /@supabase\/supabase-js@2/u);
  assert.match(page, /\.\/main\.js/u);
  assert.ok(
    page.indexOf("@supabase/supabase-js@2") < page.indexOf("./main.js"),
    "Supabase browser client must load before the module runtime",
  );
  assert.match(runtime, /createGameShell/u);
  assert.match(runtime, /GAME_CONNECTION_STATE/u);
});

test("No Thanks! entry is protected by the approved-member Access Gate", () => {
  assert.match(runtime, /createGameAccessGate/u);
  assert.match(runtime, /initializeAuth/u);
  assert.match(runtime, /getAuthState/u);
  assert.match(runtime, /subscribeAuth/u);
  assert.match(runtime, /GAME_ACCESS_REASON\.AUTHENTICATION_REQUIRED/u);
  assert.match(runtime, /GAME_ACCESS_REASON\.APPROVAL_REQUIRED/u);
});

test("No Thanks! entry uses the site profile name without game-local nickname authority", () => {
  assert.match(runtime, /profile\?\.display_name/u);
  assert.match(runtime, /createNoThanksRoomLobbyAdapter/u);
  assert.doesNotMatch(runtime, /prompt\s*\(/u);
  assert.doesNotMatch(runtime, /name:\s*"nickname"|p_nickname/iu);
  assert.doesNotMatch(runtime, /닉네임 입력|이름 입력/iu);
});

test("No Thanks! shell exposes room flow while keeping gameplay actions deferred", () => {
  assert.match(runtime, /새 방 만들기/u);
  assert.match(runtime, /코드로 참가/u);
  assert.match(runtime, /준비 완료/u);
  assert.match(runtime, /게임 시작/u);
  assert.match(runtime, /거절\/가져오기 동작은 다음 gameplay RPC 단계/u);
  assert.match(runtime, /게임 규칙/u);
  assert.match(styles, /\.no-thanks-rules/u);
  assert.match(styles, /\.no-thanks-online-entry/u);
  assert.match(styles, /\.no-thanks-waiting/u);
});


test("No Thanks! host waiting-room exit requires an explicit destructive confirmation", () => {
  assert.match(runtime, /대기실을 닫을까요/u);
  assert.match(runtime, /참가자 모두가 방에서 나가게 됩니다/u);
  assert.match(runtime, /view\.isHost \? "방 닫기" : "방 나가기"/u);
  assert.match(runtime, /hostLeaveDialog\?\.showModal/u);
});

test("No Thanks! page does not render a literal newline escape between scripts", () => {
  assert.doesNotMatch(page, /<\/script>\\\\n\s*<script/u);
});
