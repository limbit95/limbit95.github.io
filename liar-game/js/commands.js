import { supabase } from "./supabase.js";
import { assertAuthEpoch, getAuthEpoch, requireSession } from "./sessionGuard.js";
import { getPlayerKey, regeneratePlayerKey } from "./storage.js";

let pending=false;
async function mutate(name,params={}){if(pending)throw new Error("요청을 처리 중입니다.");pending=true;try{await requireSession();const epoch=getAuthEpoch();const {data,error}=await supabase.rpc(name,{p_player_key:getPlayerKey(),...params});assertAuthEpoch(epoch);if(error)throw error;return data;}finally{pending=false;}}
async function resumeRoom(roomId){if(pending)throw new Error("요청을 처리 중입니다.");pending=true;try{await requireSession();const epoch=getAuthEpoch();let playerKey=getPlayerKey();for(let attempt=0;attempt<2;attempt+=1){const {data,error}=await supabase.rpc("liar_resume_room",{p_player_key:playerKey,p_room_id:roomId});assertAuthEpoch(epoch);if(!error)return data;if(attempt===0&&error.message?.includes("PLAYER_KEY_CONFLICT")){playerKey=regeneratePlayerKey();continue;}throw error;}}finally{pending=false;}}
export const commands={
 createRoom:(nickname,settings)=>mutate("liar_create_room",{p_nickname:nickname,...settings}),
 joinRoom:(code,nickname)=>mutate("liar_join_room",{p_room_code:code,p_nickname:nickname}),
 resumeRoom,
 leaveRoom:()=>mutate("liar_leave_room"), updateNickname:(nickname)=>mutate("liar_update_nickname",{p_nickname:nickname}),
 setReady:(ready)=>mutate("liar_set_ready",{p_ready:ready}), updateSettings:(settings,version)=>mutate("liar_update_game_settings_v3",{...settings,p_expected_room_version:version}),
 updateSettingsV4:(settings,version)=>mutate("liar_update_game_settings_v4",{...settings,p_expected_room_version:version}),
 updateSettingsV5:(settings,version)=>mutate("liar_update_game_settings_v5",{...settings,p_expected_room_version:version}),
 saveWordPack:(packId,name,words)=>mutate("liar_save_my_word_pack",{p_pack_id:packId||null,p_name:name,p_words:words}),
 deleteWordPack:(packId)=>mutate("liar_delete_my_word_pack",{p_pack_id:packId}),
 purchaseHint:(hintType)=>mutate("liar_purchase_hint",{p_hint_type:hintType}),
 updateNextRoundDrawingSettings:(settings,version)=>mutate("liar_update_next_round_drawing_settings",{...settings,p_expected_room_version:version}),
 startRound:(version)=>mutate("liar_start_round",{p_expected_room_version:version}), prepareNextRound:(version)=>mutate("liar_prepare_next_round",{p_expected_round_version:version}), restartGame:(version)=>mutate("liar_restart_game",{p_expected_round_version:version}), markRoleChecked:()=>mutate("liar_mark_role_checked"),
 startSpeaking:(version)=>mutate("liar_start_speaking",{p_expected_round_version:version}),
 moveSpeaker:(direction,version)=>mutate("liar_move_speaker",{p_direction:direction,p_expected_round_version:version}),
 forceEndGame:(version)=>mutate("liar_force_end_game",{p_expected_room_version:version}),
 finishSpeaking:(version)=>mutate("liar_finish_speaking",{p_expected_round_version:version}),
 submitDrawingStroke:(points,version)=>mutate("liar_submit_drawing_stroke",{p_points:points,p_expected_round_version:version}),
 advanceDrawingTurn:(version)=>mutate("liar_advance_drawing_turn",{p_expected_round_version:version}),
 startVote:(version)=>mutate("liar_start_vote",{p_expected_round_version:version}),
 submitBallot:(targetRoundPlayerIds)=>mutate("liar_submit_ballot",{p_target_round_player_ids:targetRoundPlayerIds}),
 closeVote:(version)=>mutate("liar_close_vote",{p_expected_round_version:version}),
 startRunoff:(version)=>mutate("liar_start_runoff",{p_expected_round_version:version}),
 startRunoffSpeaking:(version)=>mutate("liar_start_runoff_speaking",{p_expected_round_version:version}),
 revealLiars:(version)=>mutate("liar_reveal_liars",{p_expected_round_version:version}),
 autoRevealResultLiars:(version)=>mutate("liar_auto_reveal_result_liars",{p_expected_round_version:version}),
 submitGuess:(text)=>mutate("liar_submit_guess",{p_guess_text:text}),
};