import { el, pageContainer } from "../ui.js";
import { getAuthState } from "../auth.js";
import { ADMIN_PERMISSION, hasAdminPermission } from "../permissions.js";

export async function renderAdmin(route) {
  const section = route.path.split("/")[2] || "dashboard";
  const auth = getAuthState();
  const requiredPermission = {
    approvals: ADMIN_PERMISSION.MEMBERS,
    members: ADMIN_PERMISSION.MEMBERS,
    managers: ADMIN_PERMISSION.OPERATIONS,
    categories: ADMIN_PERMISSION.CONTENT,
    errors: ADMIN_PERMISSION.OPERATIONS,
    permissions: ADMIN_PERMISSION.PERMISSIONS,
  }[section];
  if (requiredPermission && !hasAdminPermission(auth, requiredPermission)) {
    return pageContainer(el("div", { className: "state-box" }, [
      el("h1", { text: "접근 권한이 없습니다." }),
      el("p", { className: "subtle", text: "이 관리자 영역에 필요한 권한이 부여되지 않았습니다." }),
      el("a", { className: "button", href: "#/admin", text: "관리자 대시보드" }),
    ]));
  }
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
  } else if (section === "errors") {
    const { renderErrors } = await import("./admin/errors.js");
    root.append(await renderErrors());
  } else if (section === "permissions") {
    const { renderPermissions } = await import("./admin/permissions.js");
    root.append(await renderPermissions());
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
    errors: "오류 로그",
    permissions: "관리자 권한 설정",
  }[section] ?? "관리자";
}
