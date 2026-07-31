import {
  approveJoinRequest,
  createCategory,
  listCategories,
  listCategoryManagers,
  listEvents,
  listJoinRequests,
  listMembers,
  reviewJoinRequest,
  setCategoryManager,
  setMemberRole,
  setMemberStatus,
  updateCategory,
} from "../api.js";
import { getAuthState } from "../auth.js";
import { confirmDialog } from "../components/modal.js";
import { showToast } from "../components/toast.js";
import {
  JOIN_REQUEST_STATUS_LABEL,
  PROFILE_STATUS_LABEL,
} from "../constants.js";
import {
  el,
  formatDate,
  formatDateTime,
  getErrorMessage,
  pageContainer,
  seoulDateString,
  setBusy,
} from "../ui.js";

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
  if (section === "dashboard") root.append(await dashboard());
  else if (section === "approvals") root.append(await approvals(route));
  else if (section === "members") root.append(await members());
  else if (section === "managers") root.append(await managers());
  else if (section === "categories") root.append(await categories());
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

async function dashboard() {
  const today = seoulDateString();
  const [requests, memberRows, events, categoryRows, managerRows] = await Promise.all([
    listJoinRequests("all"),
    listMembers(),
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

async function approvals(route) {
  const status = ["pending", "held", "rejected", "approved", "all"].includes(route.query.get("status"))
    ? route.query.get("status")
    : "pending";
  const rows = await listJoinRequests(status);
  const wrapper = el("div", { className: "page-stack" });
  wrapper.append(el("div", { className: "tabs", role: "tablist", "aria-label": "가입 신청 상태 필터" }, [
    approvalTab("pending", "승인 대기", status),
    approvalTab("held", "보류", status),
    approvalTab("rejected", "거절", status),
    approvalTab("approved", "승인 완료", status),
    approvalTab("all", "전체", status),
  ]));
  if (!rows.length) {
    wrapper.append(el("div", { className: "state-box" }, [
      el("h2", { className: "section-title", text: "해당 상태의 가입 신청이 없습니다." }),
      el("p", { className: "subtle", text: "새 신청이 접수되면 이곳에 표시됩니다." }),
    ]));
    return wrapper;
  }
  rows.forEach((request) => {
    const note = el("textarea", {
      "aria-label": `${request.real_name} 관리자 안내`,
      maxlength: "1000",
      placeholder: "신청자에게 전달할 안내나 내부 확인 내용을 입력하세요.",
      text: request.admin_note ?? "",
      style: { minHeight: "90px" },
    });
    const card = el("article", { className: "card page-stack" }, [
      el("div", { className: "page-header" }, [
        el("div", {}, [
          el("h2", { className: "section-title", text: request.real_name }),
          el("p", { className: "small subtle", text: `${request.email} · ${request.church_group}` }),
        ]),
        requestBadge(request.status),
      ]),
      el("div", { className: "notice-box", text: request.request_message }),
      el("dl", { className: "meta-list small" }, [
        keyValue("표시 이름", request.profile?.display_name ?? "-"),
        keyValue("신청일", formatDateTime(request.requested_at)),
        keyValue("개인정보 동의", `${formatDateTime(request.privacy_consent_at)} · ${request.privacy_policy_version}`),
      ]),
      ["pending", "held"].includes(request.status)
        ? el("div", { className: "field" }, [
            el("label", { text: "관리자 안내" }),
            note,
          ])
        : request.admin_note
          ? el("div", { className: "notice-box notice-box--warning", text: `처리 메모: ${request.admin_note}` })
          : null,
    ]);
    if (["pending", "held"].includes(request.status)) {
      const actions = el("div", { className: "button-row" }, [
        actionButton("승인", "button", () => processRequest(card, request, "approve", note.value)),
        actionButton("보류", "button button--secondary", () => processRequest(card, request, "held", note.value)),
        actionButton("거절", "button button--ghost", () => processRequest(card, request, "rejected", note.value)),
      ]);
      card.append(actions);
    }
    wrapper.append(card);
  });
  return wrapper;
}

async function processRequest(card, request, decision, note) {
  const labels = { approve: "승인", held: "보류", rejected: "거절" };
  const confirmed = await confirmDialog({
    title: `가입 신청을 ${labels[decision]}할까요?`,
    message: decision === "approve"
      ? `${request.real_name} 회원이 즉시 일반 서비스 데이터를 이용할 수 있게 됩니다.`
      : `${request.real_name} 회원의 신청을 ${labels[decision]} 상태로 변경합니다.`,
    confirmText: labels[decision],
    danger: decision === "rejected",
  });
  if (!confirmed) return;
  card.querySelectorAll("button").forEach((button) => { button.disabled = true; });
  try {
    if (decision === "approve") await approveJoinRequest(request.user_id, note.trim() || null);
    else await reviewJoinRequest(request.user_id, decision, note.trim() || null);
    showToast(`가입 신청을 ${labels[decision]} 처리했습니다.`, "success");
    card.replaceWith(el("div", { className: "notice-box", text: `${request.real_name}님의 신청을 ${labels[decision]} 처리했습니다.` }));
  } catch (error) {
    showToast(getErrorMessage(error, "가입 신청 처리에 실패했습니다."), "error");
    card.querySelectorAll("button").forEach((button) => { button.disabled = false; });
  }
}

async function members() {
  const auth = getAuthState();
  const rows = await listMembers();
  const wrapper = el("div", { className: "page-stack" });
  const search = el("input", { type: "search", placeholder: "이름 또는 이메일 검색", "aria-label": "회원 검색" });
  const tableBody = el("tbody");
  const renderRows = () => {
    const keyword = search.value.trim().toLowerCase();
    const filtered = rows.filter((member) => [
      member.display_name,
      member.join_request?.real_name,
      member.join_request?.email,
    ].some((value) => value?.toLowerCase().includes(keyword)));
    tableBody.replaceChildren();
    if (!filtered.length) {
      tableBody.append(el("tr", {}, el("td", { colspan: "5", text: "검색 결과가 없습니다." })));
      return;
    }
    filtered.forEach((member) => tableBody.append(memberRow(member, auth)));
  };
  search.addEventListener("input", renderRows);
  const table = el("div", { className: "table-wrap" }, el("table", {}, [
    el("thead", {}, el("tr", {}, [
      el("th", { text: "회원" }),
      el("th", { text: "상태" }),
      el("th", { text: "권한" }),
      el("th", { text: "가입일" }),
      el("th", { text: "관리" }),
    ])),
    tableBody,
  ]));
  renderRows();
  wrapper.append(el("div", { className: "card search-bar" }, [
    search,
    el("span", { className: "chip", text: `전체 ${rows.length}명` }),
  ]), table);
  return wrapper;
}

function memberRow(member, auth) {
  const roleSelect = el("select", { "aria-label": `${member.display_name} 권한` }, [
    el("option", { value: "member", text: "일반 회원", selected: member.role === "member" }),
    el("option", { value: "admin", text: "관리자", selected: member.role === "admin" }),
  ]);
  if (member.status !== "approved") roleSelect.disabled = true;
  roleSelect.addEventListener("change", async () => {
    const nextRole = roleSelect.value;
    const confirmed = await confirmDialog({
      title: "회원 권한을 변경할까요?",
      message: `${member.display_name}님의 권한을 ${nextRole === "admin" ? "관리자" : "일반 회원"}로 변경합니다.`,
      confirmText: "권한 변경",
      danger: member.role === "admin" && nextRole === "member",
    });
    if (!confirmed) {
      roleSelect.value = member.role;
      return;
    }
    roleSelect.disabled = true;
    try {
      await setMemberRole(member.id, nextRole);
      member.role = nextRole;
      showToast("회원 권한을 변경했습니다.", "success");
    } catch (error) {
      roleSelect.value = member.role;
      showToast(getErrorMessage(error), "error");
    } finally {
      roleSelect.disabled = false;
    }
  });
  const action = member.status === "approved"
    ? actionButton("이용 정지", "button button--ghost", () => changeMemberStatus(member, "suspended"))
    : member.status === "suspended"
      ? actionButton("정지 해제", "button button--secondary", () => changeMemberStatus(member, "approved"))
      : el("span", { className: "small subtle", text: "가입 신청에서 처리" });
  if (member.id === auth.user.id) action.disabled = true;
  return el("tr", {}, [
    el("td", {}, [
      el("strong", { text: member.display_name }),
      el("span", { className: "small subtle", text: member.join_request?.email ?? "", style: { display: "block" } }),
    ]),
    el("td", {}, requestBadge(member.status)),
    el("td", {}, roleSelect),
    el("td", { text: formatDate(member.created_at, { weekday: false }) }),
    el("td", {}, action),
  ]);
}

async function changeMemberStatus(member, status) {
  const suspend = status === "suspended";
  const confirmed = await confirmDialog({
    title: suspend ? "회원 이용을 정지할까요?" : "이용 정지를 해제할까요?",
    message: suspend
      ? `${member.display_name} 회원은 즉시 일반 서비스 데이터에 접근할 수 없게 됩니다.`
      : `${member.display_name} 회원이 서비스를 다시 이용할 수 있게 됩니다.`,
    confirmText: suspend ? "이용 정지" : "정지 해제",
    danger: suspend,
  });
  if (!confirmed) return;
  try {
    await setMemberStatus(member.id, status);
    showToast(suspend ? "회원 이용을 정지했습니다." : "이용 정지를 해제했습니다.", "success");
    window.location.reload();
  } catch (error) {
    showToast(getErrorMessage(error, "회원 상태 변경에 실패했습니다."), "error");
  }
}

async function managers() {
  const [membersRows, categoriesRows, managerRows] = await Promise.all([
    listMembers(),
    listCategories({ activeOnly: true }),
    listCategoryManagers(),
  ]);
  const approvedMembers = membersRows.filter((member) => member.status === "approved");
  const form = el("form", { className: "card form-grid form-grid--2" });
  const memberSelect = el("select", { name: "user_id", required: true }, approvedMembers.map((member) => el("option", {
    value: member.id,
    text: `${member.display_name} (${member.join_request?.email ?? "이메일 없음"})`,
  })));
  const categorySelect = el("select", { name: "category_id", required: true }, categoriesRows.map((category) => el("option", {
    value: category.id,
    text: `${category.icon} ${category.name}`,
  })));
  form.append(
    labeled("회원", memberSelect),
    labeled("담당 카테고리", categorySelect),
    el("div", { className: "form-actions field--full" }, [
      el("button", { className: "button button--coral", type: "submit", text: "담당자 지정" }),
    ]),
  );
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    setBusy(form, true, "지정 중…");
    try {
      await setCategoryManager(memberSelect.value, categorySelect.value, true);
      showToast("카테고리 담당자를 지정했습니다.", "success");
      window.location.reload();
    } catch (error) {
      showToast(getErrorMessage(error, "담당자 지정에 실패했습니다."), "error");
    } finally {
      setBusy(form, false);
    }
  });
  const wrapper = el("div", { className: "page-stack" }, [
    el("div", { className: "notice-box", text: "카테고리 담당자는 지정된 카테고리의 활동과 날짜 투표만 등록·관리할 수 있습니다." }),
    form,
  ]);
  if (!managerRows.length) {
    wrapper.append(el("div", { className: "state-box" }, [
      el("p", { text: "지정된 활동 담당자가 없습니다." }),
    ]));
  } else {
    const tableBody = el("tbody");
    managerRows.forEach((manager) => {
      tableBody.append(el("tr", {}, [
        el("td", { text: manager.profile?.display_name ?? "회원" }),
        el("td", { text: `${manager.category?.icon ?? "🌿"} ${manager.category?.name ?? "카테고리"}` }),
        el("td", { text: formatDate(manager.created_at, { weekday: false }) }),
        el("td", {}, actionButton("지정 해제", "button button--ghost", async () => {
          const confirmed = await confirmDialog({
            title: "담당자 지정을 해제할까요?",
            message: `${manager.profile?.display_name ?? "회원"}님은 이 카테고리의 새 활동을 등록할 수 없게 됩니다.`,
            confirmText: "지정 해제",
            danger: true,
          });
          if (!confirmed) return;
          try {
            await setCategoryManager(manager.user_id, manager.category_id, false);
            showToast("담당자 지정을 해제했습니다.", "success");
            window.location.reload();
          } catch (error) {
            showToast(getErrorMessage(error), "error");
          }
        })),
      ]));
    });
    wrapper.append(el("div", { className: "table-wrap" }, el("table", {}, [
      el("thead", {}, el("tr", {}, [
        el("th", { text: "담당자" }),
        el("th", { text: "카테고리" }),
        el("th", { text: "지정일" }),
        el("th", { text: "관리" }),
      ])),
      tableBody,
    ])));
  }
  return wrapper;
}

async function categories() {
  const rows = await listCategories();
  const form = categoryForm();
  const wrapper = el("div", { className: "page-stack" }, [
    el("div", { className: "notice-box", text: "사용 중인 카테고리는 삭제하지 않고 비활성화하여 기존 활동 기록을 보존합니다." }),
    form,
  ]);
  const list = el("div", { className: "content-grid content-grid--2" });
  rows.forEach((category) => list.append(categoryCard(category)));
  wrapper.append(list);
  return wrapper;
}

function categoryForm() {
  const form = el("form", { className: "card form-grid form-grid--2" }, [
    el("h2", { className: "section-title field--full", text: "새 카테고리 등록" }),
    input("name", "카테고리 이름", "text", { maxlength: "50", required: true }),
    input("icon", "아이콘", "text", { maxlength: "50", required: true, placeholder: "예: 🏃" }),
    input("color", "대표 색상", "color", { value: "#2F6B4F", required: true }),
    el("div", { className: "field field--full" }, [
      el("label", { for: "new-category-description", text: "설명" }),
      el("textarea", { id: "new-category-description", name: "description", maxlength: "500" }),
    ]),
    el("div", { className: "form-actions field--full" }, [
      el("button", { className: "button button--coral", type: "submit", text: "카테고리 등록" }),
    ]),
  ]);
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    setBusy(form, true, "등록 중…");
    try {
      await createCategory({
        name: form.name.value.trim(),
        icon: form.icon.value.trim(),
        color: form.color.value.toUpperCase(),
        description: form.description.value.trim(),
        is_active: true,
      });
      showToast("활동 카테고리를 등록했습니다.", "success");
      window.location.reload();
    } catch (error) {
      showToast(getErrorMessage(error, "카테고리 등록에 실패했습니다."), "error");
    } finally {
      setBusy(form, false);
    }
  });
  return form;
}

function categoryCard(category) {
  const card = el("article", {
    className: "card page-stack",
    style: { borderTop: `6px solid ${category.color}` },
  });
  const content = el("div", { className: "page-stack" }, [
    el("div", { className: "page-header" }, [
      el("h2", { className: "section-title", text: `${category.icon} ${category.name}` }),
      el("span", {
        className: `status-badge ${category.is_active ? "" : "status-badge--muted"}`,
        text: category.is_active ? "● 활성" : "■ 비활성",
      }),
    ]),
    el("p", { className: "subtle", text: category.description || "설명이 없습니다." }),
    el("div", { className: "button-row" }, [
      actionButton("수정", "button button--secondary", () => showCategoryEdit(card, content, category)),
      actionButton(category.is_active ? "비활성화" : "활성화", "button button--ghost", () => toggleCategory(category)),
    ]),
  ]);
  card.append(content);
  return card;
}

function showCategoryEdit(card, content, category) {
  const form = el("form", { className: "form-grid" }, [
    input("name", "카테고리 이름", "text", { maxlength: "50", required: true, value: category.name }),
    input("icon", "아이콘", "text", { maxlength: "50", required: true, value: category.icon }),
    input("color", "대표 색상", "color", { required: true, value: category.color }),
    el("div", { className: "field" }, [
      el("label", { text: "설명" }),
      el("textarea", { name: "description", maxlength: "500", text: category.description }),
    ]),
    el("div", { className: "button-row" }, [
      actionButton("취소", "button button--ghost", () => form.replaceWith(content)),
      el("button", { className: "button", type: "submit", text: "수정 저장" }),
    ]),
  ]);
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    setBusy(form, true, "저장 중…");
    try {
      await updateCategory(category.id, {
        name: form.name.value.trim(),
        icon: form.icon.value.trim(),
        color: form.color.value.toUpperCase(),
        description: form.description.value.trim(),
      });
      showToast("카테고리를 수정했습니다.", "success");
      window.location.reload();
    } catch (error) {
      showToast(getErrorMessage(error, "카테고리 수정에 실패했습니다."), "error");
      setBusy(form, false);
    }
  });
  content.replaceWith(form);
  form.name.focus();
}

async function toggleCategory(category) {
  const next = !category.is_active;
  const confirmed = await confirmDialog({
    title: `카테고리를 ${next ? "활성화" : "비활성화"}할까요?`,
    message: next
      ? "새 활동 등록 화면에 다시 표시됩니다."
      : "기존 활동은 유지되지만 새 활동 등록 선택지에서 숨겨집니다.",
    confirmText: next ? "활성화" : "비활성화",
    danger: !next,
  });
  if (!confirmed) return;
  try {
    await updateCategory(category.id, { is_active: next });
    showToast(`카테고리를 ${next ? "활성화" : "비활성화"}했습니다.`, "success");
    window.location.reload();
  } catch (error) {
    showToast(getErrorMessage(error), "error");
  }
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

function approvalTab(value, label, current) {
  return el("a", {
    className: "tab",
    role: "tab",
    href: `#/admin/approvals?status=${value}`,
    "aria-selected": String(value === current),
    text: label,
  });
}

function requestBadge(status) {
  const label = JOIN_REQUEST_STATUS_LABEL[status] ?? PROFILE_STATUS_LABEL[status] ?? status;
  const variant = ["rejected", "suspended"].includes(status)
    ? "status-badge--danger"
    : ["pending", "held"].includes(status)
      ? "status-badge--warning"
      : "";
  const icon = ["approved"].includes(status) ? "✓" : ["rejected", "suspended"].includes(status) ? "✕" : "●";
  return el("span", { className: `status-badge ${variant}`, text: `${icon} ${label}` });
}

function keyValue(key, value) {
  return el("div", { className: "meta-item" }, [
    el("dt", { text: key, style: { fontWeight: "800", minWidth: "7rem" } }),
    el("dd", { text: value }),
  ]);
}

function actionButton(text, className, handler) {
  return el("button", { className, type: "button", text, onClick: handler });
}

function labeled(label, control) {
  const id = `admin-${crypto.randomUUID()}`;
  control.id = id;
  return el("div", { className: "field" }, [
    el("label", { for: id, text: label }),
    control,
  ]);
}

function input(name, label, type, attributes) {
  const id = `admin-${name}-${crypto.randomUUID()}`;
  return el("div", { className: "field" }, [
    el("label", { for: id, text: label }),
    el("input", { id, name, type, ...attributes }),
  ]);
}
