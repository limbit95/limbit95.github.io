import {
  listAllMembers,
  listCategories,
  listCategoryManagers,
  listEvents,
  listJoinRequests,
} from "../../api.js";
import { el, seoulDateString } from "../../ui.js";

export async function renderAdminDashboard() {
  const today = seoulDateString();
  const [requests, memberRows, events, categoryRows, managerRows] = await Promise.all([
    listJoinRequests("all"),
    listAllMembers(),
    listEvents({ fromDate: today, statuses: [], limit: 500 }),
    listCategories(),
    listCategoryManagers(),
  ]);
  const pending = requests.filter((item) => ["pending", "held"].includes(item.status)).length;
  const approved = memberRows.filter((item) => item.status === "approved").length;
  const suspended = memberRows.filter((item) => item.status === "suspended").length;
  return el("div", { className: "page-stack" }, [
    el("section", { className: "stat-grid" }, [
      stat("승인 확인 필요", pending),
      stat("승인 회원", approved),
      stat("이용 정지", suspended),
      stat("예정 활동", events.filter((item) => item.status === "scheduled").length),
    ]),
    pending ? el("div", { className: "notice-box notice-box--warning" }, [
      el("strong", { text: `확인이 필요한 가입 신청이 ${pending}건 있습니다.` }),
      el("a", { href: "#/admin/approvals", text: " 지금 확인하기 →", style: { fontWeight: "800" } }),
    ]) : null,
    el("section", { className: "admin-grid", "aria-label": "관리 메뉴" }, [
      adminMenu("👋", "가입 신청 관리", `${pending}건 확인 필요`, "#/admin/approvals"),
      adminMenu("👥", "회원 관리", `승인 ${approved}명`, "#/admin/members"),
      adminMenu("🧭", "활동 담당자 관리", `${managerRows.length}명 지정`, "#/admin/managers"),
      adminMenu("🌈", "활동 카테고리 관리", `${categoryRows.filter((item) => item.is_active).length}개 활성`, "#/admin/categories"),
    ]),
    el("section", { className: "card page-stack" }, [
      el("h2", { className: "section-title", text: "운영 현황" }),
      el("div", { className: "meta-list" }, [
        el("p", { text: `전체 계정 ${memberRows.length}명 · 관리자 ${memberRows.filter((item) => item.role === "admin").length}명` }),
        el("p", { text: `활성 카테고리 ${categoryRows.filter((item) => item.is_active).length}개 · 카테고리 담당 지정 ${managerRows.length}건` }),
        el("p", { text: `오늘 이후 등록 일정 ${events.length}개` }),
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
