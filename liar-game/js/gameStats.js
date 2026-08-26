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

function funStat(icon,title,stat,unit,empty){
 const has=Number(stat?.count||0)>0&&Array.isArray(stat?.players)&&stat.players.length;
 return `<article class="game-fun-stat ${has?"":"is-empty"}">
  <span class="game-fun-stat-icon" aria-hidden="true">${icon}</span>
  <div><small>${escapeHTML(title)}</small><strong>${has?namesOf(stat):escapeHTML(empty)}</strong>${has?`<em>${Number(stat.count)}${escapeHTML(unit)}</em>`:""}</div>
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
 return `<section class="game-stats-card ${compact?"is-compact":""}" aria-label="현재 Game 누적 기록">
  <header class="game-stats-heading"><div><span>GAME ${Number(stats?.game_no||1)} SCORE</span><h3>누적 승부</h3></div><small>${Number(score.rounds||0)}라운드 진행</small></header>
  <div class="game-scoreboard" aria-label="시민 ${Number(score.citizen||0)} 대 ${hidden} ${Number(score.liar||0)}">
   <div class="game-score-team is-citizen"><span>시민</span><strong>${Number(score.citizen||0)}</strong></div>
   <div class="game-score-vs">:</div>
   <div class="game-score-team is-liar"><strong>${Number(score.liar||0)}</strong><span>${escapeHTML(hidden)}</span></div>
  </div>
  <div class="game-fun-stats">
   ${funStat("👀","가장 많이 의심받음",stats?.most_suspected,"표","아직 투표 기록 없음")}
   ${funStat("🥷",`${hidden} 생존왕`,stats?.survival_leader,"승","아직 생존 승리 없음")}
   ${funStat("🎯","제시어 역전왕",stats?.comeback_leader,"회","아직 역전 성공 없음")}
  </div>
  <div class="game-history-section"><div class="game-history-heading"><strong>라운드 기록</strong><small>같은 Game 안에서 누적됩니다.</small></div>${historyView(rounds,hidden)}</div>
 </section>`;
}

function renderTargets(stats,key){
 document.querySelectorAll("[data-game-stats]").forEach(target=>{
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
  targets.forEach(target=>{target.innerHTML='<p class="muted game-stats-loading">게임 기록을 불러오지 못했습니다.</p>';});
 }finally{if(requestKey===key)requestKey="";}
}

const observer=new MutationObserver(()=>{void sync();});
observer.observe(document.querySelector("#app")||document.body,{childList:true,subtree:true});
void sync();
window.addEventListener("pagehide",()=>observer.disconnect(),{once:true});
