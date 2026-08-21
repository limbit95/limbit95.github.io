import { escapeHTML } from "../constants.js";

const suspectList=(suspects=[])=>suspects.length
 ? `<ul>${suspects.map(suspect=>`<li>${escapeHTML(suspect.nickname)}</li>`).join("")}</ul>`
 : '<p class="notice">최종 의심자를 확인할 수 없습니다.</p>';

export function resultView(voteState){
 return `<section class="card stack"><h2>라이어 승리</h2><div><h3>최종 의심자</h3>${suspectList(voteState?.final_suspects)}</div><p>라이어를 정확히 찾아내지 못했습니다.</p></section>`;
}
