import { GAME_MODE } from "./constants.js";

let activeGameId="";
let draft=null;

function fromSnapshot(snapshot){
 const game=snapshot?.game||{};
 return {
  selectedCategories:Array.isArray(game.selected_categories)?[...game.selected_categories]:[],
  difficulty:String(game.difficulty||"all"),
  liarCount:Number(game.liar_count||1),
  guessLimit:Number(game.guess_limit||1),
  showCategoryToLiar:game.show_category_to_liar===true,
  gameMode:String(game.game_mode||GAME_MODE.CLASSIC),
  drawingTimeLimit:Number(game.drawing_time_limit||15),
  drawingStrokeLimit:Number(game.drawing_stroke_limit||3),
  drawingStrokeUnlimited:game.drawing_stroke_unlimited===true,
  speakingTimeLimit:Number(game.speaking_time_limit??30),
  discussionTimeLimit:Number(game.discussion_time_limit??90),
  liarsKnowEachOther:game.liars_know_each_other===true,
  wordSourceMode:["builtin","custom","mixed"].includes(game.word_source_mode)?game.word_source_mode:"builtin",
  customWordPackId:game.custom_word_pack_id?String(game.custom_word_pack_id):null,
 };
}

export function getSetupDraft(snapshot){
 const gameId=String(snapshot?.game?.id||"");
 if(!gameId)return null;
 if(activeGameId!==gameId||!draft){activeGameId=gameId;draft=fromSnapshot(snapshot);}
 return draft;
}

export function patchSetupDraft(snapshot,patch={}){
 const current=getSetupDraft(snapshot);
 if(!current)return null;
 Object.assign(current,patch);
 return current;
}

export function clearSetupDraft(){activeGameId="";draft=null;}
