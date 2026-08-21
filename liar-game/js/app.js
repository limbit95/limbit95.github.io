import { ERROR_MESSAGES, ROUND_STATUS } from "./constants.js";
import { initializeSession } from "./sessionGuard.js";
import { getNickname, getPlayerKey, setCurrentRoom, setNickname } from "./storage.js";
import { store } from "./store.js";
import { getMyActiveRooms, getMyBallot, getMyRoundRole, getRoomSnapshot, getVoteSnapshot } from "./api.js";
import { commands } from "./commands.js";
import { accessView } from "./views/access.js";
import { nicknameView } from "./views/nickname.js";
import { lobbyView } from "./views/lobby.js";
import { roomView } from "./views/room.js";
import { setupView } from "./views/setup.js";
import { roleRevealView } from "./views/roleReveal.js";
import { discussionView, speakingView } from "./views/speaking.js";
import { voteResultView, voteView } from "./views/vote.js";
import { guessView } from "./views/guess.js";
import { resultView } from "./views/result.js";
import { subscribeRoomRealtime, unsubscribeRoomRealtime } from "./realtime.js";

const root=document.querySelector("#app");
const errorCode=(error)=>Object.keys(ERROR_MESSAGES).find(code=>error?.message?.includes(code));
const messageFor=(error)=>ERROR_MESSAGES[errorCode(error)]||error?.message||"요청을 처리하지 못했습니다.";
let refreshInFlight=null;
let refreshQueued=false;
let realtimeDebounce=null;
let voteDraftStageId=null;
let voteDraftRoundId=null;
let voteDraftTargets=null;
function clearVoteDraft(){voteDraftStageId=null;voteDraftRoundId=null;voteDraftTargets=null;}
async function loadActiveRooms(){const activeRooms=await getMyActiveRooms();store.set({activeRooms});return activeRooms;}
async function refreshOnce(){try{const previous=store.get();const snapshot=await getRoomSnapshot();const roundId=snapshot.round?.id||null;let voteState=null;let myBallot=[];if([ROUND_STATUS.VOTING,ROUND_STATUS.RUNOFF_VOTING,ROUND_STATUS.VOTE_RESULT,ROUND_STATUS.LIAR_GUESS,ROUND_STATUS.ROUND_RESULT].includes(snapshot.round?.status)){voteState=await getVoteSnapshot();const isParticipant=snapshot.round_players.some(player=>player.player_id===snapshot.me?.player_id);if([ROUND_STATUS.VOTING,ROUND_STATUS.RUNOFF_VOTING].includes(snapshot.round.status)&&isParticipant){const ballot=await getMyBallot();const dbBallotTargets=Array.isArray(ballot?.target_round_player_ids)?ballot.target_round_player_ids:[];if(voteDraftStageId===voteState?.stage_id&&voteDraftRoundId===roundId&&Array.isArray(voteDraftTargets)){myBallot=voteDraftTargets;}else{clearVoteDraft();voteDraftStageId=voteState?.stage_id||null;voteDraftRoundId=roundId;voteDraftTargets=[...dbBallotTargets];myBallot=dbBallotTargets;}}else clearVoteDraft();}else clearVoteDraft();setCurrentRoom(snapshot.room.id);store.set({snapshot,voteState,myBallot,message:"",myRole:previous.myRoleRoundId===roundId?previous.myRole:null,myRoleRoundId:previous.myRoleRoundId===roundId?previous.myRoleRoundId:null});await subscribeRoomRealtime(snapshot.room.id,queueRealtimeRefresh,status=>store.set({realtimeStatus:status}));}catch(error){const code=errorCode(error);if(["NOT_ROOM_MEMBER","ROOM_EXPIRED"].includes(code)){clearVoteDraft();await unsubscribeRoomRealtime();setCurrentRoom("");store.set({snapshot:null,myRole:null,myRoleRoundId:null,voteState:null,myBallot:[],realtimeStatus:"closed"});const activeRooms=await loadActiveRooms();store.set({message:code==="NOT_ROOM_MEMBER"&&activeRooms.length?"":messageFor(error)});}else throw error;}}
function refresh(){refreshQueued=true;if(refreshInFlight)return refreshInFlight;refreshInFlight=(async()=>{do{refreshQueued=false;await refreshOnce();}while(refreshQueued);})().finally(()=>{refreshInFlight=null;});return refreshInFlight;}
function queueRealtimeRefresh(){refreshQueued=true;if(refreshInFlight)return;clearTimeout(realtimeDebounce);realtimeDebounce=setTimeout(()=>{realtimeDebounce=null;refresh().catch(error=>store.set({message:messageFor(error)}));},75);}
function render(state=store.get()){
 if(state.signedOut||!state.session){clearVoteDraft();root.innerHTML=accessView();return;}
 if(!state.nickname){root.innerHTML=nicknameView();return;}
 if(!state.snapshot){root.innerHTML=lobbyView(state.nickname,state.message,state.activeRooms);return;}
 const s=state.snapshot;const isHost=s.me?.is_host===true;let html=roomView(s,state.message,state.realtimeStatus);if(!s.round)html+=setupView(s,isHost);else if(s.round.status===ROUND_STATUS.ROLE_REVEAL)html+=roleRevealView(s,state.myRole,isHost);else if(s.round.status===ROUND_STATUS.SPEAKING)html+=speakingView(s,isHost);else if(s.round.status===ROUND_STATUS.DISCUSSION)html+=discussionView(s,isHost);else if([ROUND_STATUS.VOTING,ROUND_STATUS.RUNOFF_VOTING].includes(s.round.status))html+=voteView(s,state.voteState,state.myBallot,isHost);else if(s.round.status===ROUND_STATUS.VOTE_RESULT)html+=voteResultView(state.voteState,isHost);else if(s.round.status===ROUND_STATUS.LIAR_GUESS)html+=guessView(state.voteState);else if(s.round.status===ROUND_STATUS.ROUND_RESULT)html+=resultView(state.voteState);root.innerHTML=html;
}
store.subscribe(render);
async function perform(task,{reload=true,recoverRoom=false}={}){store.set({message:""});try{await task();if(reload)await refresh();}catch(error){
 if(recoverRoom&&errorCode(error)==="ALREADY_IN_ACTIVE_ROOM"){
  try{await loadActiveRooms();}catch{}
 }
 if(["NOT_ROOM_MEMBER","ROOM_EXPIRED"].includes(errorCode(error))&&store.get().snapshot){clearVoteDraft();await unsubscribeRoomRealtime();setCurrentRoom("");store.set({snapshot:null,myRole:null,myRoleRoundId:null,voteState:null,myBallot:[],realtimeStatus:"closed"});try{await loadActiveRooms();}catch{}}
 store.set({message:messageFor(error)});
}}
root.addEventListener("submit",async(event)=>{event.preventDefault();const form=event.target;const data=new FormData(form);
 if(form.dataset.action==="nickname"){const nickname=data.get("nickname").trim();if(!nickname||nickname.length>20)return;setNickname(nickname);store.set({nickname});await perform(()=>loadActiveRooms(),{reload:false});return;}
 if(form.dataset.action==="create")await perform(async()=>{const result=await commands.createRoom(store.get().nickname,{p_selected_categories:["음식","장소","직업","동물","물건","인물","기타"],p_difficulty:"all",p_liar_count:1,p_guess_limit:1});setCurrentRoom(result?.[0]?.room_id||"");},{recoverRoom:true});
 if(form.dataset.action==="join")await perform(async()=>{const result=await commands.joinRoom(String(data.get("code")).toUpperCase(),store.get().nickname);setCurrentRoom(result?.[0]?.room_id||"");},{recoverRoom:true});
 if(form.dataset.action==="settings"){const s=store.get().snapshot;await perform(()=>commands.updateSettings({p_selected_categories:data.getAll("category"),p_difficulty:data.get("difficulty"),p_liar_count:Number(data.get("liarCount")),p_guess_limit:Number(data.get("guessLimit"))},s.room.version));}
 if(form.dataset.action==="ballot"){const voteState=store.get().voteState;const targets=data.getAll("target");if(targets.length!==Number(voteState?.seats_to_fill)){store.set({message:ERROR_MESSAGES.INVALID_BALLOT_SELECTION_COUNT});return;}await perform(async()=>{await commands.submitBallot(targets);clearVoteDraft();});}
});
root.addEventListener("change",event=>{if(event.target.name!=="target")return;const form=event.target.closest('form[data-action="ballot"]');if(!form)return;const state=store.get();const limit=Number(state.voteState?.seats_to_fill||0);let checked=[...form.querySelectorAll('input[name="target"]:checked')];if(checked.length>limit){event.target.checked=false;checked=[...form.querySelectorAll('input[name="target"]:checked')];alert(`최대 ${limit}명까지 선택할 수 있습니다.`);}voteDraftStageId=state.voteState?.stage_id||null;voteDraftRoundId=state.snapshot?.round?.id||null;voteDraftTargets=checked.map(input=>input.value);form.querySelector("[data-vote-selected]").textContent=checked.length;form.querySelector("[data-ballot-submit]").disabled=checked.length!==limit;});
root.addEventListener("click",async(event)=>{const action=event.target.closest("[data-action]")?.dataset.action;if(!action)return;const s=store.get().snapshot;
 if(action==="change-nickname"){setNickname("");store.set({nickname:""});}
 if(action==="ready"){const mine=s.players.find(p=>p.id===s.me?.player_id);await perform(()=>commands.setReady(!mine?.ready));}
 if(action==="edit-nickname"){const value=prompt("새 닉네임 (1~20자)",store.get().nickname)?.trim();if(value&&value.length<=20)await perform(async()=>{await commands.updateNickname(value);setNickname(value);store.set({nickname:value});});}
 if(action==="resume-room"){const roomId=event.target.closest("[data-room-id]")?.dataset.roomId;await perform(async()=>{await commands.resumeRoom(roomId);setCurrentRoom(roomId);await refresh();},{reload:false});}
 const leaveMessage=s?.me?.is_host?"방장이 나가면 이 게임방이 종료되고 모든 참가자가 방에서 나가게 됩니다.\n정말 방을 종료하시겠습니까?":"방에서 나가시겠습니까?";
  if(action==="leave"&&confirm(leaveMessage))await perform(async()=>{await commands.leaveRoom();clearVoteDraft();await unsubscribeRoomRealtime();setCurrentRoom("");store.set({snapshot:null,activeRooms:[],myRole:null,myRoleRoundId:null,voteState:null,myBallot:[],realtimeStatus:"closed"});},{reload:false});
 if(action==="start-round")await perform(()=>commands.startRound(s.room.version));
 if(action==="show-role")await perform(async()=>store.set({myRole:await getMyRoundRole(),myRoleRoundId:s.round?.id||null}),{reload:false});
 if(action==="confirm-role")await perform(()=>commands.markRoleChecked());
 if(action==="start-speaking")await perform(()=>commands.startSpeaking(s.round.version));
 if(action==="speaker-next")await perform(()=>commands.moveSpeaker("NEXT",s.round.version));
 if(action==="speaker-prev")await perform(()=>commands.moveSpeaker("PREVIOUS",s.round.version));
 if(action==="finish-speaking")await perform(()=>commands.finishSpeaking(s.round.version));
 if(action==="start-vote")await perform(()=>commands.startVote(s.round.version));
 if(action==="close-vote")await perform(()=>commands.closeVote(s.round.version));
 if(action==="start-runoff")await perform(()=>commands.startRunoff(s.round.version));
});

async function hydrateCurrentUser(){getPlayerKey();const activeRooms=await loadActiveRooms();let nickname=getNickname();if(activeRooms.length){nickname=activeRooms[0].nickname;setNickname(nickname);}store.set({nickname});if(nickname)await refresh();}
window.addEventListener("liar:auth-user-changed",()=>{clearVoteDraft();hydrateCurrentUser().catch(error=>store.set({message:messageFor(error)}));});
async function boot(){try{const session=await initializeSession();if(!session)return;await hydrateCurrentUser();}catch(error){store.set({message:messageFor(error)});try{await loadActiveRooms();}catch{}}finally{render();}}
boot();
