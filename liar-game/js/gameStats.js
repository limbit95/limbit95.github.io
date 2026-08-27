import { getGameStats } from "./api.js";
import { escapeHTML, GAME_MODE } from "./constants.js";
import { store } from "./store.js";

let requestKey="";
let requestToken=0;
let cachedKey="";
let cachedStats=null;

const hiddenRoleName=mode=>mode===GAME_MODE.DRAWING_SPY?"스파이":"라이어";
const namesOf=stat=>{
 const players=Array.isArray(stat?.players)?stat.players:[];
 return players.length?players.map(player=>escapeHTML(player.nickname||"참가자")).join(" · "):"-";
};
const shieldIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5 19 5v5.8c0 4.6-2.8 8.5-7 10.7-4.2-2.2-7-6.1-7-10.7V5l7-2.5Z" fill="currentColor"/><path d="m9.2 12 1.8 1.8 3.8-4" fill="none" stroke="white" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>';

function funStat(icon,title,stat,unit,empty,{iconClass=""}={}){
 const has=Number(stat?.count||0)>0&&Array.isArray(stat?.players)&&stat.players.length;
 const result=has?`${namesOf(stat)} <span class="game-fun-stat-count">(${Number(stat.count)}${escapeHTML(unit)})</span>`:escapeHTML(empty);
 return `<article class="game-fun-stat ${has?"":"is-empty"}">
  <span class="game-fun-stat-icon ${iconClass}" aria-hidden="true">${icon}</span>
  <small class="game-fun-stat-title">${escapeHTML(title)}</small>
  <strong class="game-fun-stat-result">${result}</strong>
 </article>`;
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
 return `<div class="game-stats-stack">
  <section class="game-stats-card ${compact?"is-compact":""}" aria-label="현재 게임 누적 기록">
   <div class="game-round-count" aria-label="${roundCount}라운드 진행"><span>ROUND</span><strong>${roundCount}</strong><small>라운드 진행</small></div>
   <div class="game-scoreboard" aria-label="시민 ${Number(score.citizen||0)} 대 ${hidden} ${Number(score.liar||0)}">
    <div class="game-score-team is-citizen"><span>시민</span><strong>${Number(score.citizen||0)}</strong></div>
    <div class="game-score-vs">:</div>
    <div class="game-score-team is-liar"><strong>${Number(score.liar||0)}</strong><span>${escapeHTML(hidden)}</span></div>
   </div>
   <div class="game-fun-stats">
    ${funStat("👀","가장 많이 의심받음",stats?.most_suspected,"표","아직 투표 기록 없음")}
    ${funStat(shieldIcon,`${hidden} 생존왕`,stats?.survival_leader,"승","아직 생존 승리 없음",{iconClass:"is-shield"})}
    ${funStat("🎯","제시어 역전왕",stats?.comeback_leader,"회","아직 역전 성공 없음")}
    ${funStat("🕵️",`${hidden} 헌터`,stats?.liar_hunter,"표","아직 적중 투표 없음")}
    ${funStat("🎭",`${hidden} 단골`,stats?.liar_regular,"회","아직 역할 기록 없음")}
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
