import { supabase } from "./supabase.js";
import { getPlayerKey } from "./storage.js";
import { assertAuthEpoch, getAuthEpoch } from "./sessionGuard.js";
async function read(name,params={}){const epoch=getAuthEpoch();const {data,error}=await supabase.rpc(name,params);assertAuthEpoch(epoch);if(error)throw error;return data;}
export async function getRoomSnapshot(){return read("liar_get_room_snapshot",{p_player_key:getPlayerKey()});}
export async function getMyActiveRooms(){const data=await read("liar_get_my_active_rooms");return Array.isArray(data)?data:[];}
export async function getMyRoundRole(){const data=await read("liar_get_my_round_role",{p_player_key:getPlayerKey()});return Array.isArray(data)?data[0]:data;}
export async function getVoteSnapshot(){return read("liar_get_vote_snapshot",{p_player_key:getPlayerKey()});}
export async function getGuessSnapshot(){return read("liar_get_guess_snapshot",{p_player_key:getPlayerKey()});}
export async function getRoundResult(){return read("liar_get_round_result",{p_player_key:getPlayerKey()});}
export async function getMyBallot(){return read("liar_get_my_ballot",{p_player_key:getPlayerKey()});}