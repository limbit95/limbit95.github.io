import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "../config.js";
import { buildLoginHref, currentReturnTarget, rememberReturnTarget } from "../auth-return.js";
import { createInviteClient } from "./inviteApi.js";
import { dispatchInvite, registerInviteHandler } from "./inviteRegistry.js";

const root = document.querySelector("[data-invite-entry]");
const message = root?.querySelector("[data-invite-message]");

function setMessage(text, kind = "") {
  if (!message) return;
  message.textContent = text;
  message.dataset.kind = kind;
}

function friendlyError(error) {
  const text = error?.message ?? String(error ?? "");
  if (text.includes("AUTH_REQUIRED")) return "승인된 청파 같이 회원만 초대 링크를 사용할 수 있어요.";
  if (text.includes("INVITE_NOT_FOUND_OR_EXPIRED")) return "초대 링크가 만료되었거나 더 이상 사용할 수 없어요.";
  if (text.includes("UNSUPPORTED_INVITE_TARGET")) return "아직 지원하지 않는 초대 링크예요.";
  return "초대 링크를 확인하지 못했습니다. 다시 시도해 주세요.";
}

function createClient() {
  if (!window.supabase?.createClient || !SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) return null;
  return window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: "pkce" },
  });
}

registerInviteHandler("the_game_room", async (_invite, { token }) => {
  const target = new URL("/the-game/", window.location.origin);
  target.searchParams.set("invite", token);
  window.location.replace(target.href);
});

async function boot() {
  const token = new URLSearchParams(window.location.search).get("token")?.trim() ?? "";
  if (!/^[a-f0-9]{64}$/i.test(token)) {
    setMessage("올바르지 않은 초대 링크예요.", "error");
    return;
  }

  const supabase = createClient();
  if (!supabase) {
    setMessage("로그인 서비스를 불러오지 못했습니다. 네트워크 연결을 확인해 주세요.", "error");
    return;
  }

  setMessage("로그인 상태를 확인하고 있습니다…");
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    const target = rememberReturnTarget(currentReturnTarget());
    window.location.replace(buildLoginHref(target));
    return;
  }

  try {
    setMessage("초대 정보를 확인하고 있습니다…");
    const invite = await createInviteClient(supabase).resolveInvite(token);
    setMessage("초대받은 화면으로 이동하고 있습니다…");
    await dispatchInvite(invite, { token, supabase });
  } catch (inviteError) {
    setMessage(friendlyError(inviteError), "error");
  }
}

boot();
