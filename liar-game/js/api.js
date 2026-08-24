import { supabase } from "./supabase.js";
import { getPlayerKey } from "./storage.js";
export async function getRoomSnapshot(){const {data,error}=await supabase.rpc("liar_get_room_snapshot",{p_player_key:getPlayerKey()});if(error)throw error;return data;}
export async function getMyActiveRooms(){const {data,error}=await supabase.rpc("liar_get_my_active_rooms");if(error)throw error;return Array.isArray(data)?data:[];}
export async function getMyRoundRole(){const {data,error}=await supabase.rpc("liar_get_my_round_role",{p_player_key:getPlayerKey()});if(error)throw error;return Array.isArray(data)?data[0]:data;}
export async function getVoteSnapshot(){const {data,error}=await supabase.rpc("liar_get_vote_snapshot",{p_player_key:getPlayerKey()});if(error)throw error;return data;}
export async function getGuessSnapshot(){const {data,error}=await supabase.rpc("liar_get_guess_snapshot",{p_player_key:getPlayerKey()});if(error)throw error;return data;}
export async function getRoundResult(){const {data,error}=await supabase.rpc("liar_get_round_result",{p_player_key:getPlayerKey()});if(error)throw error;return data;}
export async function getMyBallot(){const {data,error}=await supabase.rpc("liar_get_my_ballot",{p_player_key:getPlayerKey()});if(error)throw error;return data;}