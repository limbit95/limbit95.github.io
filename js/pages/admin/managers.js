import { listCategories, listCategoryManagers, listMembers, setCategoryManager } from "../../api.js";
import { confirmDialog } from "../../components/modal.js";
import { showToast } from "../../components/toast.js";
import { el, formatDate, getErrorMessage, setBusy } from "../../ui.js";

export async function renderManagers() {
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
