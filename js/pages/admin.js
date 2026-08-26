import { el, pageContainer } from "../ui.js";

export async function renderAdmin(route) {
  const section = route.path.split("/")[2] || "dashboard";
  const root = pageContainer(
    el("div", { className: "page-header" }, [
      el("div", {}, [
        el("p", { className: "eyebrow", text: "ADMIN" }),
        el("h1", { className: "page-title", text: adminTitle(section) }),
        el("p", { className: "page-description", text: "민감한 정보와 권한 변경은 관리자에게만 표시되며 RPC와 RLS에서 다시 검증됩니다." }),
      ]),
      section !== "dashboard" ? el("a", { className: "button button--ghost", href: "#/admin", text: "← 대시보드" }) : null,
    ]),
  );

  if (section === "dashboard") {
    const { renderAdminDashboard } = await import("./admin/dashboard.js");
    root.append(await renderAdminDashboard());
  } else if (section === "approvals") {
    const { renderApprovals } = await import("./admin/approvals.js");
    root.append(await renderApprovals(route));
  } else if (section === "members") {
    const { renderMembers } = await import("./admin/members.js");
    root.append(await renderMembers());
  } else if (section === "managers") {
    const { renderManagers } = await import("./admin/managers.js");
    root.append(await renderManagers());
  } else if (section === "categories") {
    const { renderCategories } = await import("./admin/categories.js");
    root.append(await renderCategories());
  }
  return root;
}

function adminTitle(section) {
  return {
    dashboard: "관리자 대시보드",
    approvals: "가입 신청 관리",
    members: "회원 관리",
    managers: "활동 담당자 관리",
    categories: "활동 카테고리 관리",
  }[section] ?? "관리자";
}