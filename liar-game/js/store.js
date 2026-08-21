const state={session:null,signedOut:false,nickname:"",playerKey:"",snapshot:null,myRole:null,myRoleRoundId:null,realtimeStatus:"closed",busy:false,message:""};
const listeners=new Set();
export const store={get:()=>state,set(patch){Object.assign(state,patch);listeners.forEach(fn=>fn(state));},subscribe(fn){listeners.add(fn);return()=>listeners.delete(fn);}};
