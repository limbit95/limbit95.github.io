import { getAuthState, initializeAuth, signOut } from "./auth.js";
import { isSupabaseClientReady, isSupabaseConfigured } from "./supabaseClient.js";
import { registerRoute, setBeforeRoute, setNotFound, startRouter, navigate, resolveRoute } from "./router.js";
import { SITE_NAME } from "./config.js";
import { accessDeniedState, el, getErrorMessage, loadingState } from "./ui.js";
import { createHeader } from "./components/header.js";
import { createBottomNav } from "./components/bottomNav.js";
import { confirmDialog } from "./components/modal.js";
import { showToast } from "./components/toast.js";
import { renderLogin } from "./pages/login.js";
import { renderSignup } from "./pages/signup.js";
import { renderAuthConfirm } from "./pages/authConfirm.js";
import { renderForgotPassword, renderPasswordUpdate } from "./pages/passwordReset.js";
import { renderPending, renderSuspended } from "./pages/pending.js";
import { renderHome } from "./pages/home.js";
import { renderGames } from "./pages/games.js";
import { renderActivities } from "./pages/activities.js";
import { renderActivityDetail } from "./pages/activityDetail.js";
import { renderActivityForm } from "./pages/activityForm.js";
import { renderBoard } from "./pages/board.js";
import { renderPostDetail } from "./pages/postDetail.js";
import { renderPostForm } from "./pages/postForm.js";
import { renderMyPage, renderProfileEdit } from "./pages/mypage.js";
import { renderAdmin } from "./pages/admin.js";

const app = document.getElementById("app");
let renderSequence = 0;

document.getElementById("skip-link")?.addEventListener("click", () => {
  document.getElementById("main-content")?.focus();
});

function authDestination(auth = getAuthState()) {
  if (!auth.user) return "/login";
  if (auth.profile?.status === "approved") return "/";
  if (auth.profile?.status === "suspended") return "/suspended";
  return "/pending";
}

async function handleLogout() {
  const confirmed = await confirmDialog({
    title: "로그아웃할까요?",
    message: "이 기기에서 로그인 세션을 종료합니다.",
    confirmText: "로그아웃",
  });
  if (!confirmed) return;
  try {
    await signOut();
    app.replaceChildren(el("main", { id: "main-content", className: "auth-layout" }, loadingState("로그아웃 중…")));
    showToast("로그아웃했습니다.", "success");
    navigate("/login");
  } catch (error) {
    showToast(getErrorMessage(error), "error");
  }
}

function createShell(route, content) {
  const auth = getAuthState();
  const fragment = document.createDocumentFragment();
  fragment.append(
    createHeader({ auth, currentPath: route.path, onLogout: handleLogout }),
    el("main", { id: "main-content", className: "main-content", tabindex: "-1" }, content),
    createBottomNav({ auth, currentPath: route.path }),
  );
  return fragment;
}

async function renderPage(route, renderer, { shell = true } = {}) {
  const sequence = ++renderSequence;
  document.title = `${route.meta.title ?? "페이지"} | ${SITE_NAME}`;
  if (shell) app.replaceChildren(createShell(route, el("div", { className: "page-container" }, loadingState())));
  try {
    const content = await renderer(route);
    if (sequence !== renderSequence) return;
    app.replaceChildren(shell ? createShell(route, content) : content);
    requestAnimationFrame(() => document.getElementById("main-content")?.focus({ preventScroll: true }));
    window.scrollTo({ top: 0, behavior: "auto" });
  } catch (error) {
    if (sequence !== renderSequence) return;
    const state = el("div", { className: "page-container" }, [
      el("div", { className: "state-box", role: "alert" }, [
        el("div", { className: "status-page__icon", text: "⚠️", "aria-hidden": "true" }),
        el("h1", { className: "section-title", text: "화면을 불러오지 못했어요" }),
        el("p", { className: "subtle", text: getErrorMessage(error) }),
        el("button", { className: "button", type: "button", text: "다시 시도", onClick: resolveRoute }),
      ]),
    ]);
    app.replaceChildren(shell ? createShell(route, state) : el("main", { id: "main-content", className: "auth-layout" }, state));
  }
}

function route(pattern, title, auth, renderer, options = {}) {
  registerRoute(pattern, (currentRoute) => renderPage(currentRoute, renderer, options), { title, auth });
}

function redirectLegacyCommunity(routeInfo) {
  const suffix = routeInfo.path.slice("/community".length);
  const query = routeInfo.query.toString();
  navigate(`/prayer${suffix}${query ? `?${query}` : ""}`, { replace: true });
}

route("/login", "로그인", "guest", renderLogin, { shell: false });
route("/signup", "회원가입", "guest", renderSignup, { shell: false });
route("/auth/confirm", "이메일 인증", null, renderAuthConfirm, { shell: false });
route("/password/forgot", "비밀번호 찾기", null, renderForgotPassword, { shell: false });
route("/forgot-password", "비밀번호 찾기", null, renderForgotPassword, { shell: false });
route("/password/update", "새 비밀번호 설정", null, renderPasswordUpdate, { shell: false });
route("/reset-password", "새 비밀번호 설정", null, renderPasswordUpdate, { shell: false });
route("/update-password", "새 비밀번호 설정", null, renderPasswordUpdate, { shell: false });
route("/pending", "가입 승인 대기", "signed", renderPending, { shell: false });
route("/suspended", "이용 정지 안내", "signed", renderSuspended, { shell: false });
route("/", "홈", "approved", renderHome);
route("/games", "게임", "approved", renderGames);
route("/activities", "활동", "approved", renderActivities);
route("/activities/new", "활동 등록", "manager", (currentRoute) => renderActivityForm(currentRoute, "create"));
route("/activities/:id/edit", "활동 수정", "manager", (currentRoute) => renderActivityForm(currentRoute, "edit"));
route("/activities/:id", "활동 상세", "approved", renderActivityDetail);
route("/notice", "공지사항", "approved", (currentRoute) => renderBoard(currentRoute, "notice"));
route("/notice/new", "공지사항 작성", "admin", (currentRoute) => renderPostForm(currentRoute, "notice", "create"));
route("/notice/:id/edit", "공지사항 수정", "admin", (currentRoute) => renderPostForm(currentRoute, "notice", "edit"));
route("/notice/:id", "공지사항 상세", "approved", (currentRoute) => renderPostDetail(currentRoute, "notice"));
route("/prayer", "기도 제목", "approved", (currentRoute) => renderBoard(currentRoute, "free"));
route("/prayer/new", "기도 제목 나누기", "approved", (currentRoute) => renderPostForm(currentRoute, "free", "create"));
route("/prayer/:id/edit", "기도 제목 수정", "approved", (currentRoute) => renderPostForm(currentRoute, "free", "edit"));
route("/prayer/:id", "기도 제목 상세", "approved", (currentRoute) => renderPostDetail(currentRoute, "free"));
registerRoute("/community", redirectLegacyCommunity, { title: "기도 제목", auth: "approved" });
registerRoute("/community/new", redirectLegacyCommunity, { title: "기도 제목", auth: "approved" });
registerRoute("/community/:id/edit", redirectLegacyCommunity, { title: "기도 제목", auth: "approved" });
registerRoute("/community/:id", redirectLegacyCommunity, { title: "기도 제목", auth: "approved" });
route("/mypage", "마이페이지", "approved", renderMyPage);
route("/mypage/edit", "프로필 수정", "approved", renderProfileEdit);
route("/admin", "관리자 대시보드", "admin", renderAdmin);
route("/admin/approvals", "가입 신청 관리", "admin", renderAdmin);
route("/admin/members", "회원 관리", "admin", renderAdmin);
route("/admin/managers", "활동 담당자 관리", "admin", renderAdmin);
route("/admin/categories", "활동 카테고리 관리", "admin", renderAdmin);

setBeforeRoute(async (routeInfo) => {
  const auth = getAuthState();
  const requirement = routeInfo.meta?.auth;
  if (requirement === "guest") {
    if (auth.user) {
      navigate(authDestination(auth), { replace: true });
      return false;
    }
    return true;
  }
  if (requirement && !auth.user) {
    navigate("/login", { replace: true });
    return false;
  }
  if (requirement === "signed") {
    if (routeInfo.path === "/suspended" && auth.profile?.status !== "suspended") {
      navigate(authDestination(auth), { replace: true });
      return false;
    }
    if (
      routeInfo.path === "/pending"
      && auth.profile
      && !["pending", "rejected"].includes(auth.profile.status)
    ) {
      navigate(authDestination(auth), { replace: true });
      return false;
    }
    return true;
  }
  if (requirement && auth.profile?.status !== "approved") {
    navigate(authDestination(auth), { replace: true });
    return false;
  }
  if (requirement === "admin" && !auth.isAdmin) {
    app.replaceChildren(createShell(routeInfo, el("div", { className: "page-container" }, accessDeniedState("관리자만 이용할 수 있는 화면입니다."))));
    return false;
  }
  if (requirement === "manager" && !auth.isAdmin && auth.managerCategoryIds.size === 0) {
    app.replaceChildren(createShell(routeInfo, el("div", { className: "page-container" }, accessDeniedState("활동 관리자 또는 카테고리 담당자만 이용할 수 있습니다."))));
    return false;
  }
  return true;
});

setNotFound((routeInfo) => renderPage(routeInfo, async () => el("div", { className: "page-container" }, [
  el("div", { className: "state-box" }, [
    el("div", { className: "status-page__icon", text: "🧭", "aria-hidden": "true" }),
    el("h1", { className: "page-title", text: "페이지를 찾을 수 없어요" }),
    el("p", { className: "subtle", text: "주소를 확인하거나 홈으로 이동해 주세요." }),
    el("a", { className: "button", href: "#/", text: "홈으로" }),
  ]),
])));

window.addEventListener("app:auth-changed", (event) => {
  const auth = getAuthState();
  const current = window.location.hash.replace(/^#/, "").split("?")[0] || "/";
  if (["/auth/confirm", "/password/update", "/reset-password", "/update-password"].includes(current)) return;
  // Returning to a background tab may make Supabase repeat SIGNED_IN for the
  // same account. The access context was refreshed, but rerendering here would
  // replace an in-progress form and discard all of its DOM-held values.
  if (event.detail?.event === "SIGNED_IN" && event.detail.sameUser) return;
  if (current === "/login" || current === "/signup" || auth.profile?.status !== "approved") {
    const destination = authDestination(auth);
    app.replaceChildren(el("main", { id: "main-content", className: "auth-layout" }, loadingState("접근 상태 확인 중…")));
    if (current === destination) resolveRoute();
    else navigate(destination, { replace: true });
  } else {
    resolveRoute();
  }
});
window.addEventListener("app:error", (event) => showToast(getErrorMessage(event.detail), "error"));

async function boot() {
  if (!isSupabaseConfigured()) {
    app.replaceChildren(el("main", { id: "main-content", className: "config-error" }, [
      el("section", { className: "card page-stack" }, [
        el("img", { src: "./assets/images/logo.svg", alt: "", width: "64", height: "64" }),
        el("h1", { className: "page-title", text: "Supabase 연결 설정이 필요해요" }),
        el("p", { text: "js/config.js에서 SUPABASE_URL과 SUPABASE_PUBLISHABLE_KEY를 설정하면 바로 실행할 수 있습니다." }),
        el("div", { className: "notice-box notice-box--warning", text: "브라우저에는 publishable key 또는 anon key만 넣고 service_role key는 절대 넣지 마세요." }),
        el("a", { className: "button", href: "./README.md", text: "설치 안내 보기" }),
      ]),
    ]));
    return;
  }
  if (!isSupabaseClientReady()) {
    app.replaceChildren(el("main", { id: "main-content", className: "config-error" }, [
      el("section", { className: "card page-stack", role: "alert" }, [
        el("h1", { className: "page-title", text: "Supabase 라이브러리를 불러오지 못했어요" }),
        el("p", { text: "네트워크 연결을 확인한 뒤 다시 시도해 주세요." }),
        el("button", { className: "button", type: "button", text: "다시 시도", onClick: () => window.location.reload() }),
      ]),
    ]));
    return;
  }
  try {
    await initializeAuth();
    if (!window.location.hash) navigate(authDestination(), { replace: true });
    startRouter();
  } catch (error) {
    app.replaceChildren(el("main", { id: "main-content", className: "config-error" }, [
      el("section", { className: "card page-stack", role: "alert" }, [
        el("h1", { className: "page-title", text: "Supabase에 연결하지 못했어요" }),
        el("p", { text: getErrorMessage(error) }),
        el("button", { className: "button", type: "button", text: "다시 시도", onClick: () => window.location.reload() }),
      ]),
    ]));
  }
}

boot();
