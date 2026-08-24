import { supabase } from "./supabase.js";
import { store } from "./store.js";
import { unsubscribeRoomRealtime } from "./realtime.js";
import { setStorageUser } from "./storage.js";

function clearRoomState(session = null) {
  store.set({session,signedOut:!session,snapshot:null,activeRooms:[],nickname:"",myRole:null,myRoleRoundId:null,roleModalOpen:false,roleModalLoading:false,voteState:null,guessState:null,resultState:null,myBallot:[],realtimeStatus:"closed"});
}

export async function initializeSession() {
  const {data,error} = await supabase.auth.getSession();
  if (error) throw error;
  const initialSession = data.session;
  setStorageUser(initialSession?.user?.id);
  store.set({session:initialSession,signedOut:!initialSession});
  supabase.auth.onAuthStateChange((event, session) => {
    const previousUserId = store.get().session?.user?.id || null;
    const nextUserId = session?.user?.id || null;
    const userChanged = previousUserId !== nextUserId;
    setStorageUser(nextUserId);
    if (event === "SIGNED_OUT" || !session || userChanged) {
      void unsubscribeRoomRealtime();
      clearRoomState(session);
      if (session && userChanged) window.dispatchEvent(new CustomEvent("liar:auth-user-changed"));
    } else store.set({session,signedOut:false});
  });
  return initialSession;
}

export async function requireSession() {
  if (store.get().signedOut) throw new Error("AUTH_REQUIRED");
  const {data,error} = await supabase.auth.getSession();
  if (error || !data.session) {
    setStorageUser(null);
    void unsubscribeRoomRealtime();
    clearRoomState();
    throw new Error("AUTH_REQUIRED");
  }
  setStorageUser(data.session.user.id);
  store.set({session:data.session,signedOut:false});
  return data.session;
}