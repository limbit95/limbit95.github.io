import { supabase } from "./supabase.js";
import { requireSession } from "./sessionGuard.js";
import { getPlayerKey } from "./storage.js";

let pending=false;
async function mutate(name,params={}){if(pending)throw new Error("요청을 처리 중입니다.");pending=true;try{await requireSession();const {data,error}=await supabase.rpc(name,{p_player_key:getPlayerKey(),...params});if(error)throw error;return data;}finally{pending=false;}}
export const commands={
 createRoom:(nickname,settings)=>mutate("liar_create_room",{p_nickname:nickname,...settings}),
 joinRoom:(code,nickname)=>mutate("liar_join_room",{p_room_code:code,p_nickname:nickname}),
 resumeRoom:(roomId)=>mutate("liar_resume_room",{p_room_id:roomId}),
 leaveRoom:()=>mutate("liar_leave_room"), updateNickname:(nickname)=>mutate("liar_update_nickname",{p_nickname:nickname}),
 setReady:(ready)=>mutate("liar_set_ready",{p_ready:ready}), updateSettings:(settings,version)=>mutate("liar_update_game_settings",{...settings,p_expected_room_version:version}),
 startRound:(version)=>mutate("liar_start_round",{p_expected_room_version:version}), markRoleChecked:()=>mutate("liar_mark_role_checked"),
 startSpeaking:(version)=>mutate("liar_start_speaking",{p_expected_round_version:version}), moveSpeaker:(direction,version)=>mutate("liar_move_speaker",{p_direction:direction,p_expected_round_version:version}),
 finishSpeaking:(version)=>mutate("liar_finish_speaking",{p_expected_round_version:version}),
};
