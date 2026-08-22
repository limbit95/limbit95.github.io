import { escapeHTML } from "../constants.js";
import { voteBallotDetails } from "./vote.js";

const playerList=(players=[],emptyMessage)=>players.length
 ? `<ul class="result-list">${players.map(player=>`<li>${escapeHTML(player.nickname)}</li>`).join("")}</ul>`
 : `<p class="notice">${emptyMessage}</p>`;
const resultSection=(title,content)=>`<div class="result-section"><h3>${title}</h3>${content}</div>`;

export function resultView(voteState,guessState,isHost){
 const citizenWon=voteState?.winner==="citizen";const revealed=voteState?.liars_revealed===true;
 const title=citizenWon?"🏆 시민 승리!":"🎭 라이어 승리!";
 const summary=citizenWon?"시민이 라이어를 찾아내고 제시어를 지켜냈습니다.":voteState?.capture_succeeded===false?"라이어를 정확히 찾아내지 못했습니다.":"라이어가 제시어를 맞혔습니다.";
 const answer=voteState?.answer_category&&voteState?.answer_word?resultSection("제시어",`<p class="result-category">${escapeHTML(voteState.answer_category)}</p><p class="result-answer">${escapeHTML(voteState.answer_word)}</p>`):"";
 const suspects=resultSection("최종 의심자",playerList(voteState?.final_suspects,"최종 의심자를 확인할 수 없습니다."));
 const ballots=voteBallotDetails(voteState);const ballotSection=ballots?`<div class="result-section">${ballots}</div>`:"";
 const actualLiars=revealed&&voteState?.actual_liars?.length?resultSection("실제 라이어",playerList(voteState.actual_liars,"실제 라이어를 확인할 수 없습니다.")):"";
 const guesses=Array.isArray(guessState?.guesses)?guessState.guesses:[];
 const guessHistory=guesses.length?resultSection("라이어 제시어 추측",`<ol class="result-guess-list">${guesses.map(guess=>`<li><strong>${Number(guess.attempt_no)}회차 · ${escapeHTML(guess.guesser)}</strong><blockquote>“${escapeHTML(guess.guess_text)}”</blockquote><span class="${guess.is_correct===true?"success":"error"}">${guess.is_correct===true?"정답":"오답"}</span></li>`).join("")}</ol>`):"";
 let next;if(!citizenWon&&!revealed)next=isHost?'<button data-action="reveal-result-liars">라이어 공개</button>':'<p class="muted">방장이 라이어를 공개할 때까지 기다려 주세요.</p>';else next=isHost?'<button data-action="restart-game">게임 다시 시작</button>':'<p class="muted">방장이 다음 게임을 준비할 때까지 기다려 주세요.</p>';
 return `<section class="card result-card ${citizenWon?"result-citizen":"result-liar"}"><header class="result-hero"><h2 class="result-title">${title}</h2><p>${summary}</p></header>${answer}${suspects}${ballotSection}${actualLiars}${guessHistory}<div class="result-actions">${next}</div></section>`;
}
