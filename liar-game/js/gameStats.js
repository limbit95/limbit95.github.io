import { getGameStats } from "./api.js?v=20260829-liar-v13-mvp1";
import { escapeHTML, GAME_MODE } from "./constants.js";
import { store } from "./store.js";

let requestKey="";
let requestToken=0;
let cachedKey="";
let cachedStats=null;

const hiddenRoleName=mode=>mode===GAME_MODE.DRAWING_SPY?"스파이":"라이어";
const playersOf=stat=>Array.isArray(stat?.players)?stat.players:[];
const namesOf=stat=>{
 const players=playersOf(stat);
 return players.length?players.map(player=>escapeHTML(player.nickname||"참가자")).join(" · "):"-";
};
const relationOf=(stat,separator)=>{
 const players=playersOf(stat);
 if(players.length<2)return namesOf(stat);
 return `${escapeHTML(players[0]?.nickname||"참가자")} ${separator} ${escapeHTML(players[1]?.nickname||"참가자")}`;
};
const shieldIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5 19 5v5.8c0 4.6-2.8 8.5-7 10.7-4.2-2.2-7-6.1-7-10.7V5l7-2.5Z" fill="currentColor"/><path d="m9.2 12 1.8 1.8 3.8-4" fill="none" stroke="white" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>';

function funStat(icon,title,stat,unit,empty,{iconClass="",relation="",allowZero=false}={}){
 const count=Number(stat?.count);
 const has=Number.isFinite(count)&&(allowZero?count>=0:count>0)&&playersOf(stat).length>0;
 const names=relation?relationOf(stat,relation):namesOf(stat);
 const result=has?`${names} <span class="game-fun-stat-count">(${count}${escapeHTML(unit)})</span>`:escapeHTML(empty);
 return `<article class="game-fun-stat ${has?"":"is-empty"}">
  <span class="game-fun-stat-icon ${iconClass}" aria-hidden="true">${icon}</span>
  <small class="game-fun-stat-title">${escapeHTML(title)}</small>
  <strong class="game-fun-stat-result">${result}</strong>
 </article>`;
}

function mvpGroup(title,description,content,{extraClass=""}={}){
 return `<section class="game-mvp-group ${extraClass}">
  <header class="game-mvp-group-heading"><strong>${escapeHTML(title)}</strong><small>${escapeHTML(description)}</small></header>
  <div class="game-fun-stats">${content}</div>
 </section>`;
}

function historyView(rounds,hidden){
 if(!rounds.length)return '<p class="game-history-empty">첫 라운드가 끝나면 기록이 쌓입니다.</p>';
 return `<div class="game-round-history" role="list" aria-label="라운드 승패 기록">${rounds.map(round=>{
  const citizen=round.winner==="citizen";
  const reason=round.result_reason==="GUESS_CORRECT"?"제시어 역전":round.result_reason==="CAPTURE_FAILED"?"검거 회피":"시민 방어";
  return `<article class="game-round-chip ${citizen?"is-citizen":"is-liar"}" role="listitem"><span>R${Number(round.round_no||0)}</span><strong>${citizen?"시민":escapeHTML(hidden)}</strong><small>${escapeHTML(round.word||"")} · ${escapeHTML(reason)}</small></article>`;
 }).join("")}</div>`;
}

function statsHTML(stats,context){
 const mode=stats?.game_mode||GAME_MODE.CLASSIC;
 const hidden=hiddenRoleName(mode);
 const score=stats?.score||{};
 const rounds=Array.isArray(stats?.round_history)?stats.round_history:[];
 const compact=context==="waiting";
 const roundCount=Number(score.rounds||0);
 const coreMvp=[
  funStat("👀","가장 많이 의심받음",stats?.most_suspected,"표","아직 투표 기록 없음"),
  funStat(shieldIcon,`${hidden} 생존왕`,stats?.survival_leader,"승","아직 생존 승리 없음",{iconClass:"is-shield"}),
  funStat("🎯","제시어 역전왕",stats?.comeback_leader,"회","아직 역전 성공 없음"),
  funStat("🕵️",`${hidden} 헌터`,stats?.liar_hunter,"표","아직 적중 투표 없음"),
  funStat("🎭",`${hidden} 단골`,stats?.liar_regular,"회","아직 역할 기록 없음")
 ].join("");
 const playMvp=[
  funStat("🤝","운명의 라이벌",stats?.rival_pair,"표","아직 라이벌 기록 없음",{relation:"↔"}),
  funStat("🔄","갈대왕",stats?.swing_leader,"회","아직 선택 변경 없음"),
  funStat("📌","한우물만 판다",stats?.focus_pair,"표","아직 집중 투표 없음",{relation:"→"}),
  funStat("🧱","고집왕",stats?.stubborn_leader,"회","아직 선택 유지 없음"),
  funStat("🌊","대세를 따르는 자",stats?.crowd_follower,"표","아직 대세 투표 없음"),
  funStat("💸","힌트 플렉스",stats?.hint_spender,"P","아직 힌트 사용 없음"),
  funStat("🏦","존버왕",stats?.hint_saver,"%","아직 획득 코인 없음",{allowZero:true}),
  funStat("🎨","폭풍 드로잉",stats?.drawing_storm,"획","아직 그림 기록 없음"),
  funStat("⏰","시간 순삭",stats?.drawing_miss_leader,"회","아직 미제출 기록 없음")
 ].join("");
 return `<div class="game-stats-stack">
  <section class="game-stats-card ${compact?"is-compact":""}" aria-label="현재 게임 누적 기록">
   <div class="game-round-count" aria-label="${roundCount}라운드 진행"><span>ROUND</span><strong>${roundCount}</strong><small>라운드 진행</small></div>
   <div class="game-scoreboard" aria-label="시민 ${Number(score.citizen||0)} 대 ${hidden} ${Number(score.liar||0)}">
    <div class="game-score-team is-citizen"><span>시민</span><strong>${Number(score.citizen||0)}</strong></div>
    <div class="game-score-vs">:</div>
    <div class="game-score-team is-liar"><strong>${Number(score.liar||0)}</strong><span>${escapeHTML(hidden)}</span></div>
   </div>
   <div class="game-mvp-groups">
    ${mvpGroup("핵심 MVP","승패와 역할 성과를 기준으로 집계합니다.",coreMvp)}
    ${mvpGroup("플레이 스타일 MVP","투표 습관, 관계, 힌트와 그림 기록을 기준으로 집계합니다.",playMvp,{extraClass:"is-play-style"})}
   </div>
  </section>
  <section class="game-history-card" aria-label="라운드 기록">
   <header class="game-history-heading"><strong>라운드 기록</strong><small>같은 게임 안에서 쌓인 라운드를 한눈에 확인할 수 있습니다.</small></header>
   ${historyView(rounds,hidden)}
  </section>
 </div>`;
}

function renderTargets(stats,key){
 document.querySelectorAll("[data-game-stats]").forEach(target=>{
  if(target.dataset.statsKey===key)return;
  target.innerHTML=statsHTML(stats,target.dataset.gameStatsContext||"result");
  target.dataset.statsKey=key;
 });
}

async function sync(){
 const targets=[...document.querySelectorAll("[data-game-stats]")];
 if(!targets.length)return;
 const snapshot=store.get().snapshot;
 if(!snapshot?.game?.id||!snapshot?.room?.id)return;
 const key=`${snapshot.game.id}:${snapshot.room.version||0}`;
 if(cachedKey===key&&cachedStats){renderTargets(cachedStats,key);return;}
 if(requestKey===key)return;
 requestKey=key;
 const token=++requestToken;
 try{
  const stats=await getGameStats();
  if(token!==requestToken)return;
  const latest=store.get().snapshot;
  if(!latest?.game?.id||String(latest.game.id)!==String(snapshot.game.id))return;
  cachedKey=key;cachedStats=stats;
  renderTargets(stats,key);
 }catch{
  if(token!==requestToken)return;
  targets.forEach(target=>{if(target.dataset.statsKey!==`error:${key}`){target.innerHTML='<p class="muted game-stats-loading">게임 기록을 불러오지 못했습니다.</p>';target.dataset.statsKey=`error:${key}`;}});
 }finally{if(requestKey===key)requestKey="";}
}

const observer=new MutationObserver(()=>{void sync();});
observer.observe(document.querySelector("#app")||document.body,{childList:true,subtree:true});
void sync();
window.addEventListener("pagehide",()=>observer.disconnect(),{once:true});
