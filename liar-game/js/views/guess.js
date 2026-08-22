import { escapeHTML } from "../constants.js";
import { voteBallotDetails } from "./vote.js";

const suspectList=(suspects=[])=>suspects.length
 ? `<ul>${suspects.map(suspect=>`<li>${escapeHTML(suspect.nickname)}</li>`).join("")}</ul>`
 : '<p class="notice">최종 의심자를 확인할 수 없습니다.</p>';

export function guessView(voteState,guessState){
 const limit=Number(guessState?.guess_limit||0);const used=Number(guessState?.used_attempts||0);const remaining=Number(guessState?.remaining_attempts||0);
 const guesses=Array.isArray(guessState?.guesses)?guessState.guesses:[];
 const history=guesses.length?`<div><h3>기존 추측</h3><ol class="guess-history">${guesses.map(guess=>`<li><strong>${guess.attempt_no}회차 · ${escapeHTML(guess.guesser)}</strong><blockquote>“${escapeHTML(guess.guess_text)}”</blockquote><span class="${guess.is_correct===true?"success":"error"}">→ ${guess.is_correct===true?"정답":"오답"}</span></li>`).join("")}</ol></div>`:'<p class="muted">아직 제출된 추측이 없습니다.</p>';
 const submit=guessState?.can_submit===true
  ? `<form data-action="guess" class="stack"><label>제시어 추측<input name="guess" maxlength="100" required autocomplete="off"></label><button type="submit">정답 제출</button></form>`
  : '<p class="notice">라이어가 제시어를 추측 중입니다.</p>';
 return `<section class="card stack"><h2>🎭 라이어의 마지막 기회</h2><div><h3>이번 라이어</h3>${suspectList(voteState?.final_suspects)}</div><div><h3>팀 전체 추측 기회</h3><p>사용 <strong>${used} / ${limit}</strong></p><p>남은 기회 <strong>${remaining}회</strong></p></div>${history}${submit}<p class="muted">띄어쓰기는 제외하고 정확한 단어를 입력해 주세요.</p><p class="muted">추측 횟수는 라이어 팀 전체가 공유합니다.</p></section>`;
}

export function captureRevealView(voteState,isHost){
 return `<section class="card stack"><h2>라이어 검거 성공!</h2><p>라이어를 정확히 찾아냈습니다.</p>${voteBallotDetails(voteState)}${isHost?'<button data-action="reveal-liars">라이어 공개</button>':'<p class="notice">방장이 라이어를 공개할 때까지 기다려 주세요.</p>'}</section>`;
}
