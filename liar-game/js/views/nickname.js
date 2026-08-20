import { escapeHTML } from "../constants.js";
export const nicknameView=(nickname="")=>`<h1 class="brand">🎭 LIAR GAME</h1><form class="card stack" data-action="nickname"><h2>게임 닉네임</h2><label for="nickname">게임에서 사용할 닉네임</label><input id="nickname" name="nickname" maxlength="20" required value="${escapeHTML(nickname)}"><button>시작하기</button></form>`;
