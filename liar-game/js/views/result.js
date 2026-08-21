import { escapeHTML } from "../constants.js";

const suspectList=(suspects=[])=>suspects.length
 ? `<ul>${suspects.map(suspect=>`<li>${escapeHTML(suspect.nickname)}</li>`).join("")}</ul>`
 : '<p class="notice">최종 의심자를 확인할 수 없습니다.</p>';

export function resultView(voteState,isHost){
 const citizenWon=voteState?.winner==="citizen";
 const title=citizenWon?"시민 승리":"라이어 승리";
 const summary=citizenWon?"시민이 라이어를 찾아내고 제시어를 지켜냈습니다.":"라이어를 정확히 찾아내지 못했습니다.";
 const next=isHost?'<button data-action="restart-game">게임 다시 시작</button>':'<p class="muted">방장이 다음 게임을 준비할 때까지 기다려 주세요.</p>';
 return `<section class="card stack"><h2>${title}</h2><div><h3>최종 의심자</h3>${suspectList(voteState?.final_suspects)}</div><p>${summary}</p>${next}</section>`;
}
