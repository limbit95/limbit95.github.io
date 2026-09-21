import { listCategories } from "../../api/activities.js";
import {
  listCategoryManagerAssignments,
  listCategoryManagerCandidates,
  setCategoryManager,
} from "../../api/admin.js";
import { confirmDialog } from "../../components/modal.js";
import { showToast } from "../../components/toast.js";
import { el, formatDate, getErrorMessage, setBusy } from "../../ui.js";

const CANDIDATE_LIMIT = 20;

export async function renderManagers() {
  const [candidateRows, categoriesRows, managerRows] = await Promise.all([
    listCategoryManagerCandidates({ limit: CANDIDATE_LIMIT }),
    listCategories(),
    listCategoryManagerAssignments(),
  ]);
  const activeCategories = categoriesRows.filter((category) => category.is_active);
  const categoryMap = new Map(categoriesRows.map((category) => [Number(category.id), category]));
  const form = el("form", { className: "card form-grid form-grid--2" });
  const memberSearch = el("input", {
    type: "search",
    placeholder: "회원 검색",
    "aria-label": "담당자 회원 검색",
  });
  const memberSelect = el("select", {
    name: "user_id",
    required: true,
    "aria-label": "담당자 회원 선택",
  });
  const categorySelect = el("select", { name: "category_id", required: true }, activeCategories.map((category) => el("option", {
    value: category.id,
    text: `${category.icon} ${category.name}`,
  })));
  let candidateSequence = 0;
  let searchTimer = null;

  const renderCandidateOptions = (rows, emptyText = "검색 결과가 없습니다.") => {
    memberSelect.replaceChildren();
    if (!rows.length) {
      memberSelect.append(el("option", {
        value: "",
        text: emptyText,
        selected: true,
        disabled: true,
      }));
      memberSelect.disabled = true;
      return;
    }
    memberSelect.disabled = false;
    rows.forEach((member) => {
      memberSelect.append(el("option", {
        value: member.id,
        text: member.email
          ? `${member.display_name} (${member.email})`
          : member.display_name,
      }));
    });
  };

  const loadCandidates = async () => {
    const sequence = ++candidateSequence;
    memberSelect.disabled = true;
    memberSelect.replaceChildren(el("option", {
      value: "",
      text: "회원을 검색하는 중입니다…",
      selected: true,
      disabled: true,
    }));
    try {
      const rows = await listCategoryManagerCandidates({
        search: memberSearch.value,
        limit: CANDIDATE_LIMIT,
      });
      if (sequence !== candidateSequence) return;
      renderCandidateOptions(rows);
    } catch (error) {
      if (sequence !== candidateSequence) return;
      renderCandidateOptions([], getErrorMessage(error, "회원 검색에 실패했습니다."));
    }
  };

  renderCandidateOptions(candidateRows);
  memberSearch.addEventListener("input", () => {
    if (searchTimer) window.clearTimeout(searchTimer);
    searchTimer = window.setTimeout(loadCandidates, 250);
  });

  form.append(
    memberField(memberSearch, memberSelect),
    labeled("담당 카테고리", categorySelect),
    el("div", { className: "form-actions field--full" }, [
      el("button", { className: "button button--coral", type: "submit", text: "담당자 지정" }),
    ]),
  );
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!memberSelect.value || !categorySelect.value) return;
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
      const category = categoryMap.get(Number(manager.category_id));
      tableBody.append(el("tr", {}, [
        el("td", { text: manager.profile?.display_name ?? "회원" }),
        el("td", { text: `${category?.icon ?? "🌿"} ${category?.name ?? "카테고리"}` }),
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

function actionButton(text, className, handler) {
  return el("button", { className, type: "button", text, onClick: handler });
}

function memberField(search, select) {
  const id = `admin-${crypto.randomUUID()}`;
  search.id = id;
  return el("div", { className: "field" }, [
    el("label", { for: id, text: "회원" }),
    search,
    select,
    el("span", { className: "small subtle", text: "승인 회원을 검색해 선택하세요." }),
  ]);
}

function labeled(label, control) {
  const id = `admin-${crypto.randomUUID()}`;
  control.id = id;
  return el("div", { className: "field" }, [
    el("label", { for: id, text: label }),
    control,
  ]);
}
