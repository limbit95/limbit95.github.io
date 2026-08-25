import { createCategory, listCategories, updateCategory } from "../../api.js";
import { confirmDialog } from "../../components/modal.js";
import { showToast } from "../../components/toast.js";
import { el, getErrorMessage, setBusy } from "../../ui.js";

export async function renderCategories() {
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

function actionButton(text, className, handler) {
  return el("button", { className, type: "button", text, onClick: handler });
}

function input(name, label, type, attributes) {
  const id = `admin-${name}-${crypto.randomUUID()}`;
  return el("div", { className: "field" }, [
    el("label", { for: id, text: label }),
    el("input", { id, name, type, ...attributes }),
  ]);
}
