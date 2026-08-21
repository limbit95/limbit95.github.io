import { supabase } from "./supabase.js";

let roomId = null;
let roomChannel = null;

export function getSubscribedRoomId() {
  return roomId;
}

export async function unsubscribeRoomRealtime() {
  const channel = roomChannel;
  roomChannel = null;
  roomId = null;
  if (channel) await supabase.removeChannel(channel);
}

export async function subscribeRoomRealtime(targetRoomId, onStateChanged, onStatusChanged = () => {}) {
  if (!targetRoomId) {
    await unsubscribeRoomRealtime();
    onStatusChanged("closed");
    return;
  }
  if (roomChannel && roomId === targetRoomId) return;

  await unsubscribeRoomRealtime();
  await supabase.realtime.setAuth();

  const topic = `liar-room:${targetRoomId}`;
  const channel = supabase
    .channel(topic, { config: { private: true } })
    .on("broadcast", { event: "state_changed" }, () => onStateChanged());

  roomId = targetRoomId;
  roomChannel = channel;
  onStatusChanged("connecting");
  channel.subscribe((status) => {
    if (channel !== roomChannel) return;
    if (status === "SUBSCRIBED") onStatusChanged("subscribed");
    else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") onStatusChanged("error");
    else if (status === "CLOSED") onStatusChanged("closed");
  });
}

window.addEventListener("pagehide", () => {
  void unsubscribeRoomRealtime();
});
