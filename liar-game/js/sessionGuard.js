import { supabase } from "./supabase.js";
import { store } from "./store.js";

export async function initializeSession(){const {data,error}=await supabase.auth.getSession();if(error)throw error;store.set({session:data.session,signedOut:!data.session});supabase.auth.onAuthStateChange((event,session)=>{store.set({session,signedOut:event==="SIGNED_OUT"||!session,snapshot:event==="SIGNED_OUT"?null:store.get().snapshot});});return data.session;}
export async function requireSession(){if(store.get().signedOut)throw new Error("AUTH_REQUIRED");const {data,error}=await supabase.auth.getSession();if(error||!data.session){store.set({session:null,signedOut:true,snapshot:null});throw new Error("AUTH_REQUIRED");}store.set({session:data.session});return data.session;}
