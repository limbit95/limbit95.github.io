import { escapeHTML, GAME_MODE } from "../constants.js";
import { store } from "../store.js";
import { voteBallotDetails } from "./vote.js";
import { drawingPreviewView } from "./drawing.js";

const suspectList=(suspects=[])=>suspects.length
 ? `<ul class="guess-liar-list">${suspects.map(suspect=>`<li>🎭 ${escapeHTML(suspect.nickname)}</li>`).join("")}</ul>`
 : '<p class="notice guess-notice">최종 의심자를 확인할 수 없습니다.</p>';
const modeOf=mode=>mode||store.get().snapshot?.game?.game_mode||GAME_MODE.CLASSIC;

export function guessView(voteState,guessState,gameMode){
 const drawingMode=modeOf(gameMode)===GAME_MODE.DRAWING_SPY;
 const hiddenRoleName=drawingMode?"스파이":"라이어";
 const limit=Number(guessState?.guess_limit||0);const used=Number(guessState?.used_attempts||0);const remaining=Number(guessState?.remaining_attempts||0);
 const guesses=Array.isArray(guessState?.guesses)?guessState.guesses:[];
 const unlockAt=Date.parse(guessState?.guess_unlocked_at||"");
 const serverNow=Date.parse(guessState?.server_now||"");
 const unlockPending=Number.isFinite(unlockAt)&&Number.isFinite(serverNow)&&serverNow<unlockAt;
 const unlockSeconds=unlockPending?Math.max(1,Math.ceil((unlockAt-serverNow)/1000)):0;
 const history=guesses.length?`<section class="guess-section guess-history-section"><h3>기존 추측</h3><ol class="guess-history">${guesses.map(guess=>`<li data-guess-history-item><strong>${guess.attempt_no}회차 · ${escapeHTML(guess.guesser)}</strong><blockquote>“${escapeHTML(guess.guess_text)}”</blockquote><span class="${guess.is_correct===true?"success":"error"}">→ ${guess.is_correct===true?"정답":"오답"}</span></li>`).join("")}</ol></section>`:'<p class="muted guess-empty-history">아직 제출된 추측이 없습니다.</p>';
 const submit=unlockPending
   ? `<section class="guess-unlock-card" data-guess-unlock data-guess-unlock-at="${escapeHTML(guessState?.guess_unlocked_at||"")}" data-server-now="${escapeHTML(guessState?.server_now||"")}"><span>추측 시작까지</span><strong data-guess-unlock-count>${unlockSeconds}</strong><small>모든 참가자가 같은 공개 화면을 본 뒤 함께 시작합니다.</small></section>`
   :guessState?.can_submit===true
    ? `<form data-action="guess" class="guess-form"><label for="guess-word">제시어를 입력하세요</label><input id="guess-word" class="guess-input" name="guess" maxlength="100" required autocomplete="off"><button class="guess-submit" type="submit">정답 제출</button></form>`
    : `<div class="notice guess-notice">${hiddenRoleName}가 제시어를 추측 중입니다.</div>`;
 const drawing=drawingMode?drawingPreviewView(store.get().snapshot,{title:"🎨 최종 공동 그림",description:"스파이는 이 그림을 보고 마지막으로 제시어를 추측합니다.",className:"guess-drawing-preview"}):"";
 return `<section class="card guess-card">
  <header class="guess-hero"><h2 class="guess-title">🎭 ${hiddenRoleName}의 마지막 기회</h2><p class="guess-subtitle">제시어를 맞히면 ${hiddenRoleName}가 역전합니다.</p></header>
  ${drawing}
  <section class="guess-section guess-liars"><h3>이번 ${hiddenRoleName}</h3>${suspectList(voteState?.final_suspects)}</section>
  <section class="guess-section guess-attempts"><h3>추측 기회</h3><div class="guess-attempt-grid"><div class="guess-attempt-item"><span>사용 횟수</span><strong class="guess-attempt-number">${used} / ${limit}</strong></div><div class="guess-attempt-item"><span>남은 기회</span><strong class="guess-attempt-number guess-remaining">${remaining}회</strong></div></div></section>
  ${history}${submit}
  <aside class="guess-help"><p>💡 띄어쓰기는 제외하고 정확한 단어를 입력해 주세요.</p><p>추측 횟수는 ${hiddenRoleName} 팀 전체가 공유합니다.</p></aside>
 </section>`;
}

export function captureRevealView(voteState,isHost,gameMode){
 const hiddenRoleName=modeOf(gameMode)===GAME_MODE.DRAWING_SPY?"스파이":"라이어";
 const round=store.get().snapshot?.round;
 return `<section class="card stack capture-success-card" data-capture-success-card data-round-id="${escapeHTML(round?.id||"")}" data-round-version="${Number(round?.version||0)}" data-hidden-role-name="${hiddenRoleName}" data-is-host="${isHost?"true":"false"}"><h2>${hiddenRoleName} 검거 성공!</h2><p>${hiddenRoleName}를 정확히 찾아냈습니다. 잠시 후 자동으로 공개됩니다.</p>${voteBallotDetails(voteState)}</section>`;
}
