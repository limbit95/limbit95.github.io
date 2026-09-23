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

test("No Thanks! shell exposes room and server-authoritative gameplay actions", () => {
  assert.match(runtime, /새 방 만들기/u);
  assert.match(runtime, /코드로 참가/u);
  assert.match(runtime, /준비 완료/u);
  assert.match(runtime, /게임 시작/u);
  assert.match(runtime, /createNoThanksGameplayAdapter/u);
  assert.match(runtime, /칩 1개 내기/u);
  assert.match(runtime, /카드를 눌러 가져오기/u);
  assert.match(runtime, /lobbyController\.refuseCard\(\)/u);
  assert.match(runtime, /lobbyController\.takeCard\(\)/u);
  assert.match(runtime, /결과방 나가기/u);
  assert.match(runtime, /GAME OVER/u);
  assert.match(runtime, /게임 규칙/u);
  assert.match(styles, /\.no-thanks-rules/u);
  assert.match(styles, /\.no-thanks-online-entry/u);
  assert.match(styles, /\.no-thanks-scoreboard/u);
  assert.match(runtime, /const boardMode = Boolean/u);
  assert.match(runtime, /actions: boardMode \? \[\] : lobbyActions/u);
  assert.match(runtime, /no-thanks-panel-tools/u);
  assert.match(styles, /\.no-thanks-shell--board \.game-platform-shell__actions:empty/u);
});


test("No Thanks! page carries a game-local environmental background identity", () => {
  assert.match(page, /theme-color" content="#1d3541"/u);
  assert.match(styles, /linear-gradient\(145deg, #294955 0%, #203b47 48%, #172f39 100%\)/u);
  assert.match(styles, /\.no-thanks-app::before/u);
  assert.match(styles, /content: "33"/u);
  assert.match(styles, /\.no-thanks-app::after/u);
  assert.match(styles, /content: "12"/u);
  assert.match(styles, /radial-gradient\(circle at center, #d94a3f/u);
  assert.match(styles, /@media \(max-width: 720px\)[\s\S]*\.no-thanks-app::after[\s\S]*display: none/u);
});

test("No Thanks! room header emphasizes game identity without duplicating the room code", () => {
  assert.match(runtime, /칩으로 버틸지, 카드와 칩을 가져갈지—한 번의 선택이 흐름을 바꾸는 심리전 카드 게임/u);
  assert.match(runtime, /roomLabel: view\?\.roomCode \? "LIVE ROOM" : null/u);
  assert.doesNotMatch(runtime, /roomLabel: view\?\.roomCode \? `방 \$\{view\.roomCode\}` : null/u);
  assert.match(runtime, /no-thanks-shell--in-room/u);
  assert.match(styles, /\.no-thanks-shell \.game-platform-shell__description/u);
  assert.match(styles, /\.no-thanks-shell \.game-platform-shell__room::before/u);
  assert.match(styles, /\.no-thanks-shell--in-room \.game-platform-status--success/u);
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


test("No Thanks! in-progress host termination requires confirmation", () => {
  assert.match(runtime, /진행 중인 게임을 종료할까요/u);
  assert.match(runtime, /점수와 승자는 계산하지 않습니다/u);
  assert.match(runtime, /lobbyController\.endGame\(\)/u);
  assert.match(runtime, /openGameEndConfirm/u);
});

test("No Thanks! terminal screen distinguishes a host-terminated game", () => {
  assert.match(runtime, /HOST_TERMINATED/u);
  assert.match(runtime, /방장이 게임을 종료했어요/u);
  assert.match(runtime, /결과방 나가기/u);
});


test("No Thanks! shell shows reconnect state without transferring host or turn authority", () => {
  assert.match(runtime, /createNoThanksPresenceAdapter/u);
  assert.match(runtime, /재접속 대기/u);
  assert.match(runtime, /방장 권한은 자동 위임되지 않고 게임도 자동 종료되지 않습니다/u);
  assert.match(runtime, /turn은 유지되며/u);
  assert.match(runtime, /GAME_CONNECTION_STATE\.OFFLINE/u);
  assert.match(styles, /\.no-thanks-connection-note/u);
});

test("No Thanks! rematch keeps the room and returns players to ready state", () => {
  assert.match(runtime, /재대결 준비/u);
  assert.match(runtime, /현재 방과 참가자는 유지/u);
  assert.match(runtime, /lobbyController\.prepareRematch\(\)/u);
  assert.match(runtime, /일반 플레이어가 다시 준비/u);
  assert.doesNotMatch(runtime, /새 방 코드로 다시 참가/u);
});
