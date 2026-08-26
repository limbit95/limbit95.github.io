import { getAuthState, initializeAuth, signOut } from "./auth.js";
import { isSupabaseClientReady, isSupabaseConfigured } from "./supabaseClient.js";
import { registerRoute, setBeforeRoute, setNotFound, startRouter, navigate, resolveRoute } from "./router.js";
import { SITE_NAME } from "./config.js";
import { accessDeniedState, el, getErrorMessage, loadingState } from "./ui.js";
import { createHeader } from "./components/header.js";
import { createBottomNav } from "./components/bottomNav.js";
import { confirmDialog } from "./components/modal.js";
import { showToast } from "./components/toast.js";

const lazyRenderer = (loader, exportName) => async (...args) => {
  const module = await loader();
  const renderer = module[exportName];
  if (typeof renderer !== "function") {
    throw new Error(`Lazy renderer export not found: ${exportName}`);
  }
  return renderer(...args);
};

const renderLogin = lazyRenderer(() => import("./pages/login.js"), "renderLogin");
const renderSignup = lazyRenderer(() => import("./pages/signup.js"), "renderSignup");
const renderAuthConfirm = lazyRenderer(() => import("./pages/authConfirm.js"), "renderAuthConfirm");
const renderForgotPassword = lazyRenderer(() => import("./pages/passwordReset.js"), "renderForgotPassword");
const renderPasswordUpdate = lazyRenderer(() => import("./pages/passwordReset.js"), "renderPasswordUpdate");
const renderPending = lazyRenderer(() => import("./pages/pending.js"), "renderPending");
const renderSuspended = lazyRenderer(() => import("./pages/pending.js"), "renderSuspended");
const renderHome = lazyRenderer(() => import("./pages/home.js"), "renderHome");
const renderGames = lazyRenderer(() => import("./pages/games.js"), "renderGames");
const renderActivities = lazyRenderer(() => import("./pages/activities.js"), "renderActivities");
const renderActivityDetail = lazyRenderer(() => import("./pages/activityDetail.js"), "renderActivityDetail");
const renderMyPage = lazyRenderer(() => import("./pages/mypage.js"), "renderMyPage");
const renderProfileEdit = lazyRenderer(() => import("./pages/mypage.js"), "renderProfileEdit");
const renderAdmin = lazyRenderer(() => import("./pages/admin.js"), "renderAdmin");

const app = document.getElementById("app");
let renderSequence = 0;
let shellState = null;

document.getElementById("skip-link")?.addEventListener("click", () => {
  document.getElementById("main-content")?.focus();
});

function authDestination(auth = getAuthState()) {
  if (!auth.user) return "/login";
  if (auth.profile?.status === "approved") return "/";
  if (auth.profile?.status === "suspended") return "/suspended";
  return "/pending";
}

function shellIdentity(auth) {
  return [
    auth.user?.id ?? "guest",
    auth.profile?.status ?? "none",
    auth.isAdmin ? "admin" : "member",
  ].join(":");
}

function updateNavigationState(root, currentPath) {
  root?.querySelectorAll("a[href^='#/']").forEach((link) => {
    const href = link.getAttribute("href") ?? "";
    const path = href.slice(1).split("?")[0] || "/";
    const active = path === "/"
      ? currentPath === "/"
      : currentPath.startsWith(path);
    if (active) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
}

function resetShellTransientUi(header) {
  const notificationPanel = header?.querySelector("#notification-panel");
  if (notificationPanel) notificationPanel.hidden = true;
  header
    ?.querySelector("[aria-controls='notification-panel']")
    ?.setAttribute("aria-expanded", "false");
}

function ensureShell(route) {
  const auth = getAuthState();
  const identity = shellIdentity(auth);
  const canReuse = shellState
    && shellState.identity === identity
    && shellState.main.isConnected
    && shellState.header.isConnected
    && shellState.bottomNav.isConnected;

  if (!canReuse) {
    const header = createHeader({ auth, currentPath: route.path, onLogout: handleLogout });
    const main = el("main", { id: "main-content", className: "main-content", tabindex: "-1" });
    const bottomNav = createBottomNav({ auth, currentPath: route.path });
    app.replaceChildren(header, main, bottomNav);
    shellState = { identity, header, main, bottomNav };
  }

  resetShellTransientUi(shellState.header);
  updateNavigationState(shellState.header, route.path);
  updateNavigationState(shellState.bottomNav, route.path);
  return shellState.main;
}

function renderShellContent(route, content) {
  const main = ensureShell(route);
  main.replaceChildren(content);
  return main;
}

function renderStandalone(content) {
  shellState = null;
  app.replaceChildren(content);
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
    renderStandalone(el("main", { id: "main-content", className: "auth-layout" }, loadingState("로그아웃 중…")));
    showToast("로그아웃했습니다.", "success");
    navigate("/login");
  } catch (error) {
    showToast(getErrorMessage(error), "error");
  }
}

async function renderPage(route, renderer, { shell = true } = {}) {
  const sequence = ++renderSequence;
  document.title = `${route.meta.title ?? "페이지"} | ${SITE_NAME}`;
  if (shell) {
    renderShellContent(route, el("div", { className: "page-container" }, loadingState()));
  }
  try {
    const content = await renderer(route);
    if (sequence !== renderSequence) return;
    if (shell) renderShellContent(route, content);
    else renderStandalone(content);
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
    if (shell) renderShellContent(route, state);
    else renderStandalone(el("main", { id: "main-content", className: "auth-layout" }, state));
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
route("/activities/new", "활동 등록", "manager", async (currentRoute) => {
  const { renderActivityForm } = await import("./pages/activityForm.js");
  return renderActivityForm(currentRoute, "create");
});
route("/activities/:id/edit", "활동 수정", "manager", async (currentRoute) => {
  const { renderActivityForm } = await import("./pages/activityForm.js");
  return renderActivityForm(currentRoute, "edit");
});
route("/activities/:id", "활동 상세", "approved", renderActivityDetail);
route("/notice", "공지사항", "approved", async (currentRoute) => {
  const { renderBoard } = await import("./pages/board.js");
  return renderBoard(currentRoute, "notice");
});
route("/notice/new", "공지사항 작성", "admin", async (currentRoute) => {
  const { renderPostForm } = await import("./pages/postForm.js");
  return renderPostForm(currentRoute, "notice", "create");
});
route("/notice/:id/edit", "공지사항 수정", "admin", async (currentRoute) => {
  const { renderPostForm } = await import("./pages/postForm.js");
  return renderPostForm(currentRoute, "notice", "edit");
});
route("/notice/:id", "공지사항 상세", "approved", async (currentRoute) => {
  const { renderPostDetail } = await import("./pages/postDetail.js");
  return renderPostDetail(currentRoute, "notice");
});
route("/prayer", "기도 제목", "approved", async (currentRoute) => {
  const { renderBoard } = await import("./pages/board.js");
  return renderBoard(currentRoute, "free");
});
route("/prayer/new", "기도 제목 나누기", "approved", async (currentRoute) => {
  const { renderPostForm } = await import("./pages/postForm.js");
  return renderPostForm(currentRoute, "free", "create");
});
route("/prayer/:id/edit", "기도 제목 수정", "approved", async (currentRoute) => {
  const { renderPostForm } = await import("./pages/postForm.js");
  return renderPostForm(currentRoute, "free", "edit");
});
route("/prayer/:id", "기도 제목 상세", "approved", async (currentRoute) => {
  const { renderPostDetail } = await import("./pages/postDetail.js");
  return renderPostDetail(currentRoute, "free");
});
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
    renderShellContent(routeInfo, el("div", { className: "page-container" }, accessDeniedState("관리자만 이용할 수 있는 화면입니다.")));
    return false;
  }
  if (requirement === "manager" && !auth.isAdmin && auth.managerCategoryIds.size === 0) {
    renderShellContent(routeInfo, el("div", { className: "page-container" }, accessDeniedState("활동 관리자 또는 카테고리 담당자만 이용할 수 있습니다.")));
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
  if (event.detail?.event === "SIGNED_IN" && event.detail.sameUser) return;
  if (current === "/login" || current === "/signup" || auth.profile?.status !== "approved") {
    const destination = authDestination(auth);
    renderStandalone(el("main", { id: "main-content", className: "auth-layout" }, loadingState("접근 상태 확인 중…")));
    if (current === destination) resolveRoute();
    else navigate(destination, { replace: true });
  } else {
    resolveRoute();
  }
});
window.addEventListener("app:error", (event) => showToast(getErrorMessage(event.detail), "error"));

async function boot() {
  if (!isSupabaseConfigured()) {
    renderStandalone(el("main", { id: "main-content", className: "config-error" }, [
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
    renderStandalone(el("main", { id: "main-content", className: "config-error" }, [
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
    renderStandalone(el("main", { id: "main-content", className: "config-error" }, [
      el("section", { className: "card page-stack", role: "alert" }, [
        el("h1", { className: "page-title", text: "Supabase에 연결하지 못했어요" }),
        el("p", { text: getErrorMessage(error) }),
        el("button", { className: "button", type: "button", text: "다시 시도", onClick: () => window.location.reload() }),
      ]),
    ]));
  }
}

boot();