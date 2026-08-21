import { ERROR_MESSAGES, ROUND_STATUS } from "./constants.js";
import { initializeSession } from "./sessionGuard.js";
import { getNickname, getPlayerKey, setCurrentRoom, setNickname } from "./storage.js";
import { store } from "./store.js";
import { getMyActiveRooms, getMyRoundRole, getRoomSnapshot } from "./api.js";
import { commands } from "./commands.js";
import { accessView } from "./views/access.js";
import { nicknameView } from "./views/nickname.js";
import { lobbyView } from "./views/lobby.js";
import { roomView } from "./views/room.js";
import { setupView } from "./views/setup.js";
import { roleRevealView } from "./views/roleReveal.js";
import { discussionView, speakingView } from "./views/speaking.js";
import { subscribeRoomRealtime, unsubscribeRoomRealtime } from "./realtime.js";

const root=document.querySelector("#app");
const errorCode=(error)=>Object.keys(ERROR_MESSAGES).find(code=>error?.message?.includes(code));
const messageFor=(error)=>ERROR_MESSAGES[errorCode(error)]||error?.message||"요청을 처리하지 못했습니다.";
let refreshInFlight=null;
let refreshQueued=false;
let realtimeDebounce=null;
async function loadActiveRooms(){const activeRooms=await getMyActiveRooms();store.set({activeRooms});return activeRooms;}
async function refreshOnce(){try{const previous=store.get();const snapshot=await getRoomSnapshot();const roundId=snapshot.round?.id||null;setCurrentRoom(snapshot.room.id);store.set({snapshot,message:"",myRole:previous.myRoleRoundId===roundId?previous.myRole:null,myRoleRoundId:previous.myRoleRoundId===roundId?previous.myRoleRoundId:null});await subscribeRoomRealtime(snapshot.room.id,queueRealtimeRefresh,status=>store.set({realtimeStatus:status}));}catch(error){const code=errorCode(error);if(["NOT_ROOM_MEMBER","ROOM_EXPIRED"].includes(code)){await unsubscribeRoomRealtime();setCurrentRoom("");store.set({snapshot:null,myRole:null,myRoleRoundId:null,realtimeStatus:"closed"});const activeRooms=await loadActiveRooms();store.set({message:code==="NOT_ROOM_MEMBER"&&activeRooms.length?"":messageFor(error)});}else throw error;}}
function refresh(){refreshQueued=true;if(refreshInFlight)return refreshInFlight;refreshInFlight=(async()=>{do{refreshQueued=false;await refreshOnce();}while(refreshQueued);})().finally(()=>{refreshInFlight=null;});return refreshInFlight;}
function queueRealtimeRefresh(){refreshQueued=true;if(refreshInFlight)return;clearTimeout(realtimeDebounce);realtimeDebounce=setTimeout(()=>{realtimeDebounce=null;refresh().catch(error=>store.set({message:messageFor(error)}));},75);}
function render(state=store.get()){
 if(state.signedOut||!state.session){root.innerHTML=accessView();return;}
 if(!state.nickname){root.innerHTML=nicknameView();return;}
 if(!state.snapshot){root.innerHTML=lobbyView(state.nickname,state.message,state.activeRooms);return;}
 const s=state.snapshot;const isHost=s.me?.is_host===true;let html=roomView(s,state.message,state.realtimeStatus);if(!s.round)html+=setupView(s,isHost);else if(s.round.status===ROUND_STATUS.ROLE_REVEAL)html+=roleRevealView(s,state.myRole,isHost);else if(s.round.status===ROUND_STATUS.SPEAKING)html+=speakingView(s,isHost);else if(s.round.status===ROUND_STATUS.DISCUSSION)html+=discussionView();root.innerHTML=html;
}
store.subscribe(render);
async function perform(task,{reload=true,recoverRoom=false}={}){store.set({message:""});try{await task();if(reload)await refresh();}catch(error){
 if(recoverRoom&&errorCode(error)==="ALREADY_IN_ACTIVE_ROOM"){
  try{await loadActiveRooms();}catch{}
 }
 if(["NOT_ROOM_MEMBER","ROOM_EXPIRED"].includes(errorCode(error))&&store.get().snapshot){await unsubscribeRoomRealtime();setCurrentRoom("");store.set({snapshot:null,myRole:null,myRoleRoundId:null,realtimeStatus:"closed"});try{await loadActiveRooms();}catch{}}
 store.set({message:messageFor(error)});
}}
root.addEventListener("submit",async(event)=>{event.preventDefault();const form=event.target;const data=new FormData(form);
 if(form.dataset.action==="nickname"){const nickname=data.get("nickname").trim();if(!nickname||nickname.length>20)return;setNickname(nickname);store.set({nickname});await perform(()=>loadActiveRooms(),{reload:false});return;}
 if(form.dataset.action==="create")await perform(async()=>{const result=await commands.createRoom(store.get().nickname,{p_selected_categories:["음식","장소","직업","동물","물건","인물","기타"],p_difficulty:"all",p_liar_count:1,p_guess_limit:1});setCurrentRoom(result?.[0]?.room_id||"");},{recoverRoom:true});
 if(form.dataset.action==="join")await perform(async()=>{const result=await commands.joinRoom(String(data.get("code")).toUpperCase(),store.get().nickname);setCurrentRoom(result?.[0]?.room_id||"");},{recoverRoom:true});
 if(form.dataset.action==="settings"){const s=store.get().snapshot;await perform(()=>commands.updateSettings({p_selected_categories:data.getAll("category"),p_difficulty:data.get("difficulty"),p_liar_count:Number(data.get("liarCount")),p_guess_limit:Number(data.get("guessLimit"))},s.room.version));}
});
root.addEventListener("click",async(event)=>{const action=event.target.closest("[data-action]")?.dataset.action;if(!action)return;const s=store.get().snapshot;
 if(action==="change-nickname"){setNickname("");store.set({nickname:""});}
 if(action==="ready"){const mine=s.players.find(p=>p.id===s.me?.player_id);await perform(()=>commands.setReady(!mine?.ready));}
 if(action==="edit-nickname"){const value=prompt("새 닉네임 (1~20자)",store.get().nickname)?.trim();if(value&&value.length<=20)await perform(async()=>{await commands.updateNickname(value);setNickname(value);store.set({nickname:value});});}
 if(action==="resume-room"){const roomId=event.target.closest("[data-room-id]")?.dataset.roomId;await perform(async()=>{await commands.resumeRoom(roomId);setCurrentRoom(roomId);await refresh();},{reload:false});}
 const leaveMessage=s?.me?.is_host?"방장이 나가면 이 게임방이 종료되고 모든 참가자가 방에서 나가게 됩니다.\n정말 방을 종료하시겠습니까?":"방에서 나가시겠습니까?";
 if(action==="leave"&&confirm(leaveMessage))await perform(async()=>{await commands.leaveRoom();await unsubscribeRoomRealtime();setCurrentRoom("");store.set({snapshot:null,activeRooms:[],myRole:null,myRoleRoundId:null,realtimeStatus:"closed"});},{reload:false});
 if(action==="start-round")await perform(()=>commands.startRound(s.room.version));
 if(action==="show-role")await perform(async()=>store.set({myRole:await getMyRoundRole(),myRoleRoundId:s.round?.id||null}),{reload:false});
 if(action==="confirm-role")await perform(()=>commands.markRoleChecked());
 if(action==="start-speaking")await perform(()=>commands.startSpeaking(s.round.version));
 if(action==="speaker-next")await perform(()=>commands.moveSpeaker("NEXT",s.round.version));
 if(action==="speaker-prev")await perform(()=>commands.moveSpeaker("PREVIOUS",s.round.version));
 if(action==="finish-speaking")await perform(()=>commands.finishSpeaking(s.round.version));
});

async function boot(){try{const session=await initializeSession();if(!session)return;getPlayerKey();const activeRooms=await loadActiveRooms();let nickname=getNickname();if(!nickname&&activeRooms.length){nickname=activeRooms[0].nickname;setNickname(nickname);}store.set({nickname});if(nickname)await refresh();}catch(error){store.set({message:messageFor(error)});try{await loadActiveRooms();}catch{}}finally{render();}}
boot();
