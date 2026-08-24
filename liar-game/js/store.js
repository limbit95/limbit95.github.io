const state={session:null,signedOut:false,nickname:"",playerKey:"",snapshot:null,activeRooms:[],myRole:null,myRoleRoundId:null,roleModalOpen:false,roleModalLoading:false,voteState:null,guessState:null,myBallot:[],realtimeStatus:"closed",busy:false,message:""};
const listeners=new Set();
export const store={get:()=>state,set(patch){Object.assign(state,patch);listeners.forEach(fn=>fn(state));},subscribe(fn){listeners.add(fn);return()=>listeners.delete(fn);}};
