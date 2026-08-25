import { supabase } from "./supabase.js";

let roomId = null;
let roomChannel = null;
let drawingRoomId = null;
let drawingChannel = null;
let drawingChannelStatus = "closed";
let drawingSubscribePromise = null;

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
    if (status === "SUBSCRIBED") { onStatusChanged("subscribed"); onStateChanged(); }
    else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") onStatusChanged("error");
    else if (status === "CLOSED") onStatusChanged("closed");
  });
}

export async function unsubscribeDrawingRealtime() {
  if (drawingSubscribePromise) {
    try{await drawingSubscribePromise;}catch{}
  }
  const channel = drawingChannel;
  drawingChannel = null;
  drawingRoomId = null;
  drawingChannelStatus = "closed";
  if (channel) await supabase.removeChannel(channel);
}

export async function subscribeDrawingRealtime(targetRoomId, onStroke, onStatusChanged = () => {}) {
  if (!targetRoomId) {
    await unsubscribeDrawingRealtime();
    onStatusChanged("closed");
    return;
  }
  if (drawingChannel && drawingRoomId === targetRoomId) return;
  if (drawingSubscribePromise) return drawingSubscribePromise;

  drawingSubscribePromise=(async()=>{
    if (drawingChannel && drawingRoomId !== targetRoomId) await unsubscribeDrawingRealtime();
    await supabase.realtime.setAuth();

    const topic = `liar-drawing:${targetRoomId}`;
    const channel = supabase
      .channel(topic, { config: { private: true, broadcast: { self: false, ack: false } } })
      .on("broadcast", { event: "stroke" }, ({ payload }) => onStroke?.(payload));

    drawingRoomId = targetRoomId;
    drawingChannel = channel;
    drawingChannelStatus = "connecting";
    onStatusChanged("connecting");
    channel.subscribe((status) => {
      if (channel !== drawingChannel) return;
      if (status === "SUBSCRIBED") drawingChannelStatus = "subscribed";
      else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") drawingChannelStatus = "error";
      else if (status === "CLOSED") drawingChannelStatus = "closed";
      onStatusChanged(drawingChannelStatus);
    });
  })();
  try{await drawingSubscribePromise;}finally{drawingSubscribePromise=null;}
}

export function broadcastDrawingStroke(payload) {
  if (!drawingChannel || drawingChannelStatus !== "subscribed") return Promise.resolve("not_subscribed");
  return drawingChannel.send({ type: "broadcast", event: "stroke", payload }).catch(() => "error");
}

window.addEventListener("pagehide", () => {
  void unsubscribeRoomRealtime();
  void unsubscribeDrawingRealtime();
});
