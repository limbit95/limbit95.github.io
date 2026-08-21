import { escapeHTML } from "../constants.js";

const playerList=(players=[],emptyMessage)=>players.length
 ? `<ul>${players.map(player=>`<li>${escapeHTML(player.nickname)}</li>`).join("")}</ul>`
 : `<p class="notice">${emptyMessage}</p>`;

export function resultView(voteState,isHost){
 const citizenWon=voteState?.winner==="citizen";
 const revealed=voteState?.liars_revealed===true;
 const title=citizenWon?"시민 승리":"라이어 승리";
 const summary=citizenWon?"시민이 라이어를 찾아내고 제시어를 지켜냈습니다.":voteState?.capture_succeeded===false?"라이어를 정확히 찾아내지 못했습니다.":"라이어가 승리했습니다.";
 const actualLiars=revealed&&voteState?.actual_liars?.length?`<div><h3>실제 라이어</h3>${playerList(voteState.actual_liars,"실제 라이어를 확인할 수 없습니다.")}</div>`:"";
 let next;
 if(!citizenWon&&!revealed)next=isHost?'<button data-action="reveal-result-liars">라이어 공개</button>':'<p class="muted">방장이 라이어를 공개할 때까지 기다려 주세요.</p>';
 else next=isHost?'<button data-action="restart-game">게임 다시 시작</button>':'<p class="muted">방장이 다음 게임을 준비할 때까지 기다려 주세요.</p>';
 return `<section class="card stack"><h2>${title}</h2><div><h3>최종 의심자</h3>${playerList(voteState?.final_suspects,"최종 의심자를 확인할 수 없습니다.")}</div><p>${summary}</p>${actualLiars}${next}</section>`;
}
