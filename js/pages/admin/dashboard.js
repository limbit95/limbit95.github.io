import { getAdminDashboardStats } from "../../api/admin.js";
import { countRecentClientErrors } from "../../api/observability.js";
import { el, seoulDateString } from "../../ui.js";
import { getAuthState } from "../../auth.js";
import { ADMIN_PERMISSION, hasAdminPermission } from "../../permissions.js";

const EMPTY_DASHBOARD_STATS = {
  pendingJoinRequests: 0,
  approvedMembers: 0,
  suspendedMembers: 0,
  totalAccounts: 0,
  adminAccounts: 0,
  upcomingEvents: 0,
  upcomingScheduledEvents: 0,
  activeCategories: 0,
  categoryManagerAssignments: 0,
};

export async function renderAdminDashboard() {
  const today = seoulDateString();
  const auth = getAuthState();
  const canMembers = hasAdminPermission(auth, ADMIN_PERMISSION.MEMBERS);
  const canOperations = hasAdminPermission(auth, ADMIN_PERMISSION.OPERATIONS);
  const canContent = hasAdminPermission(auth, ADMIN_PERMISSION.CONTENT);
  const canLoadStats = canMembers || canOperations || canContent;
  const [stats, recentErrors] = await Promise.all([
    canLoadStats ? getAdminDashboardStats(today) : EMPTY_DASHBOARD_STATS,
    canOperations ? countRecentClientErrors(24).catch(() => null) : null,
  ]);
  const pending = stats.pendingJoinRequests;
  const approved = stats.approvedMembers;
  const suspended = stats.suspendedMembers;
  return el("div", { className: "page-stack" }, [
    el("section", { className: "stat-grid" }, [
      stat("승인 확인 필요", pending),
      stat("승인 회원", approved),
      stat("이용 정지", suspended),
      stat("예정 활동", stats.upcomingScheduledEvents),
    ]),
    pending ? el("div", { className: "notice-box notice-box--warning" }, [
      el("strong", { text: `확인이 필요한 가입 신청이 ${pending}건 있습니다.` }),
      el("a", { href: "#/admin/approvals", text: " 지금 확인하기 →", style: { fontWeight: "800" } }),
    ]) : null,
    el("section", { className: "admin-grid", "aria-label": "관리 메뉴" }, [
      canMembers ? adminMenu("👋", "가입 신청 관리", `${pending}건 확인 필요`, "#/admin/approvals") : null,
      canMembers ? adminMenu("👥", "회원 관리", `승인 ${approved}명`, "#/admin/members") : null,
      canOperations ? adminMenu("🧭", "활동 담당자 관리", `${stats.categoryManagerAssignments}명 지정`, "#/admin/managers") : null,
      canOperations ? adminMenu("📜", "활동 주최자 변경 이력", "최초 지정·변경 기록 조회", "#/admin/managers?view=organizer-history") : null,
      canContent ? adminMenu("🌈", "활동 카테고리 관리", `${stats.activeCategories}개 활성`, "#/admin/categories") : null,
      auth.isSystemAdmin ? adminMenu("🔐", "관리자 권한 설정", "영역별 접근 관리", "#/admin/permissions") : null,
      canOperations ? adminMenu("🛠️", "오류 로그", recentErrors == null ? "조회 준비 중" : `최근 24시간 ${recentErrors}건`, "#/admin/errors") : null,
    ]),
    el("section", { className: "card page-stack" }, [
      el("h2", { className: "section-title", text: "운영 현황" }),
      el("div", { className: "meta-list" }, [
        el("p", { text: `전체 계정 ${stats.totalAccounts}명 · 관리자 ${stats.adminAccounts}명` }),
        el("p", { text: `활성 카테고리 ${stats.activeCategories}개 · 카테고리 담당 지정 ${stats.categoryManagerAssignments}건` }),
        el("p", { text: `오늘 이후 등록 일정 ${stats.upcomingEvents}개` }),
      ]),
    ]),
  ]);
}

function stat(label, value) {
  return el("div", { className: "stat-card" }, [
    el("strong", { text: value }),
    el("span", { className: "small subtle", text: label }),
  ]);
}

function adminMenu(icon, title, detail, href) {
  return el("a", { className: "admin-menu-card", href }, [
    el("span", { text: icon, style: { fontSize: "1.8rem" }, "aria-hidden": "true" }),
    el("span", {}, [
      el("strong", { text: title }),
      el("span", { className: "small subtle", text: detail, style: { display: "block" } }),
    ]),
  ]);
}
