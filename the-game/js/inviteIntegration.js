import { buildLoginHref, currentReturnTarget } from "../../js/auth-return.js";
import { createInviteClient } from "../../js/invites/inviteApi.js";
import { createInviteShareDialog } from "../../js/invites/inviteShare.js";

const INVITE_TYPE = "the_game_room";
const NICKNAME_STORAGE_KEY = "the-game-online-nickname";
const inviteToken = new URLSearchParams(window.location.search).get("invite")?.trim() ?? "";
let inviteAttempted = false;
let inviteClientPromise = null;
let shareSession = null;

async function getClients() {
  if (!inviteClientPromise) {
    inviteClientPromise = (async () => {
      const module = await import("./supabase.js");
      return { supabase: module.supabase, invite: createInviteClient(module.supabase) };
    })();
  }
  return inviteClientPromise;
}

function message(text) {
  const target = document.querySelector("[data-online-message]") || document.querySelector("[data-lobby-message]");
  if (target) target.textContent = text;
}

function setAuthReturnLink() {
  const link = document.querySelector("[data-auth-gate] a");
  if (link) link.href = buildLoginHref(currentReturnTarget());
}

function clearInviteQuery() {
  if (!inviteToken) return;
  const url = new URL(window.location.href);
  url.searchParams.delete("invite");
  window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
}

async function acceptInviteIfReady() {
  if (!inviteToken || inviteAttempted) return;
  const controls = document.querySelector("[data-online-controls]");
  if (!controls || controls.hidden) return;
  if (!/^[a-f0-9]{64}$/i.test(inviteToken)) {
    inviteAttempted = true;
    message("올바르지 않은 초대 링크예요.");
    return;
  }

  inviteAttempted = true;
  try {
    const { supabase, invite } = await getClients();
    const resolved = await invite.resolveInvite(inviteToken);
    if (resolved?.target_type !== INVITE_TYPE) throw new Error("INVITE_TARGET_MISMATCH");

    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    const { data: profile } = user
      ? await supabase.from("profiles").select("display_name,status").eq("id", user.id).maybeSingle()
      : { data: null };
    if (profile?.status && profile.status !== "approved") throw new Error("AUTH_REQUIRED");

    const nicknameInput = document.querySelector("#the-game-online-nickname");
    const roomCodeInput = document.querySelector("#the-game-room-code");
    const joinForm = document.querySelector("[data-join-room-form]");
    const nickname = localStorage.getItem(NICKNAME_STORAGE_KEY) || profile?.display_name || user?.email?.split("@")[0] || "";

    roomCodeInput.value = resolved.target_id;
    nicknameInput.value = nickname;
    if (!nickname) {
      message("초대받은 방 코드를 불러왔어요. 닉네임을 입력한 뒤 참가해 주세요.");
      return;
    }
    message("초대받은 방에 참가하고 있습니다…");
    joinForm.requestSubmit();
  } catch (error) {
    const text = error?.message ?? "";
    if (text.includes("INVITE_NOT_FOUND_OR_EXPIRED")) message("초대 링크가 만료되었거나 취소되었습니다.");
    else if (text.includes("AUTH_REQUIRED")) message("승인된 청파 같이 회원만 온라인 방에 참가할 수 있어요.");
    else if (text.includes("INVITE_TARGET_MISMATCH")) message("The Game 방 초대 링크가 아닙니다.");
    else message("초대 링크를 확인하지 못했습니다. 다시 시도해 주세요.");
  }
}

async function openShareDialog() {
  const code = document.querySelector("[data-room-code]")?.textContent?.trim();
  if (!code || code === "------") return;
  try {
    if (!shareSession || shareSession.roomCode !== code) {
      const { invite } = await getClients();
      const created = await invite.createInvite({
        targetType: INVITE_TYPE,
        targetId: code,
        expiresInMinutes: 360,
        metadata: { source: "the-game" },
      });
      shareSession?.dialog?.destroy?.();
      shareSession = {
        roomCode: code,
        dialog: createInviteShareDialog({
          token: created.token,
          title: "The Game 방 초대",
          description: "로그인 후 이 방으로 바로 연결됩니다.",
        }),
      };
    }
    await shareSession.dialog.open();
  } catch (error) {
    message((error?.message ?? "").includes("AUTH_REQUIRED")
      ? "승인된 회원만 초대 링크를 만들 수 있어요."
      : "초대 링크를 만들지 못했습니다. 잠시 후 다시 시도해 주세요.");
  }
}

function installShareButton() {
  const card = document.querySelector(".room-code-card");
  if (!card || card.querySelector("[data-room-invite]")) return;
  const button = document.createElement("button");
  button.type = "button";
  button.className = "ghost-button";
  button.dataset.roomInvite = "true";
  button.textContent = "초대 링크 · QR";
  button.addEventListener("click", openShareDialog);
  card.append(button);
}

function sync() {
  setAuthReturnLink();
  installShareButton();
  const lobby = document.querySelector("#lobby-screen");
  if (inviteToken && lobby && !lobby.hidden) clearInviteQuery();
  void acceptInviteIfReady();
}

const observer = new MutationObserver(sync);
observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ["hidden"] });

if (inviteToken) {
  requestAnimationFrame(() => document.querySelector("[data-online-mode]")?.click());
}
sync();
