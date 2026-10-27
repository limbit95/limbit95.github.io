import net from "node:net";

// TEST ONLY. Never imported by production. Plain local PG protocol relay:
// forwards original frames; changes only delivery of a simple COMMIT frame/reply.
// Requires separately authorized disposable execution; import opens no socket.
export async function startCommitFaultProxy({ port, mode }) {
  if (!["drop-before", "drop-reply", "stall"].includes(mode)) throw new TypeError("Fault mode required.");
  const sockets = new Set();
  let notify, backendPid;
  const intercepted = new Promise((resolve) => { notify = resolve; });
  const server = net.createServer((front) => {
    const back = net.connect({ host: "127.0.0.1", port });
    sockets.add(front); sockets.add(back);
    let initial = true, suppressed = false, bytes = Buffer.alloc(0), replies = Buffer.alloc(0);
    const close = () => { front.destroy(); back.destroy(); sockets.delete(front); sockets.delete(back); };
    front.on("error", close); back.on("error", close);
    front.on("close", close); back.on("close", close);
    back.on("data", (chunk) => {
      replies = Buffer.concat([replies, chunk]);
      while (replies.length >= 5) {
        const length = replies.readInt32BE(1) + 1;
        if (length < 5 || length > 1_048_576) { close(); return; }
        if (replies.length < length) break;
        if (replies[0] === 75 && length >= 13) backendPid = replies.readInt32BE(5);
        replies = replies.subarray(length);
      }
      if (!suppressed) front.write(chunk);
    });
    front.on("data", (chunk) => {
      if (suppressed) return;
      bytes = Buffer.concat([bytes, chunk]);
      while (bytes.length >= (initial ? 4 : 5)) {
        const length = bytes.readInt32BE(initial ? 0 : 1) + (initial ? 0 : 1);
        if (length < (initial ? 8 : 5) || length > 1_048_576) { close(); return; }
        if (bytes.length < length) return;
        const frame = bytes.subarray(0, length); bytes = bytes.subarray(length);
        if (initial) { initial = false; back.write(frame); continue; }
        if (frame[0] === 81 && frame.subarray(5).toString() === "COMMIT\0") {
          suppressed = true;
          if (mode === "drop-reply") back.write(frame); // real DB receives COMMIT
          if (mode === "drop-before") close(); // DB receives no COMMIT
          notify({ mode, forwarded: mode === "drop-reply", observedAt: performance.now() });
          return;
        }
        back.write(frame);
      }
    });
  });
  await new Promise((resolve, reject) => { server.once("error", reject); server.listen(0, "127.0.0.1", resolve); });
  return { port: server.address().port, intercepted, backendPid: () => backendPid,
    close: () => new Promise((resolve) => { for (const socket of sockets) socket.destroy(); server.close(resolve); }) };
}
