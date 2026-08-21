import { escapeHTML } from "../constants.js";

const suspectList=(suspects=[])=>suspects.length
 ? `<ul>${suspects.map(suspect=>`<li>${escapeHTML(suspect.nickname)}</li>`).join("")}</ul>`
 : '<p class="notice">최종 의심자를 확인할 수 없습니다.</p>';

export function guessView(voteState){
 return `<section class="card stack"><h2>라이어 검거 성공</h2><div><h3>최종 의심자</h3>${suspectList(voteState?.final_suspects)}</div><p>라이어를 정확히 찾아냈습니다.</p><p>이제 라이어에게 제시어를 맞힐 기회가 주어집니다.</p><p class="notice">추측 기능은 다음 단계에서 진행됩니다.</p></section>`;
}
