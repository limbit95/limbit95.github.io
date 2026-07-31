import { getAuthState } from "../auth.js";
import { createPost, getPost, updatePost } from "../api.js";
import { showToast } from "../components/toast.js";
import { accessDeniedState, el, getErrorMessage, pageContainer, setBusy } from "../ui.js";
import { clearFieldErrors, setFieldError, validateRequiredFields, valueInRange } from "../validators.js";

export async function renderPostForm(route, boardType, mode) {
  const auth = getAuthState();
  const editing = mode === "edit";
  const post = editing ? await getPost(route.params.id) : null;
  if (post && post.board_type !== boardType) throw new Error("게시글을 찾을 수 없습니다.");
  if (editing && !auth.isAdmin && post.author_id !== auth.user.id) {
    return pageContainer(accessDeniedState("본인이 작성한 게시글만 수정할 수 있습니다."));
  }
  if (boardType === "notice" && !auth.isAdmin) {
    return pageContainer(accessDeniedState("공지사항은 관리자만 작성할 수 있습니다."));
  }
  const base = boardType === "notice" ? "notice" : "community";
  const form = el("form", { className: "card form-grid", novalidate: true }, [
    el("div", { className: "field" }, [
      el("label", { className: "required", for: "post-title", text: "제목" }),
      el("input", { id: "post-title", name: "title", type: "text", maxlength: "200", required: true, value: post?.title ?? "" }),
      el("p", { className: "field-error", dataset: { errorFor: "title" }, "aria-live": "polite" }),
    ]),
    el("div", { className: "field" }, [
      el("label", { className: "required", for: "post-content", text: "내용" }),
      el("textarea", { id: "post-content", name: "content", maxlength: "20000", required: true, text: post?.content ?? "", style: { minHeight: "340px" } }),
      el("p", { className: "field-help", text: "입력한 내용은 서식 없는 안전한 텍스트로 표시됩니다." }),
      el("p", { className: "field-error", dataset: { errorFor: "content" }, "aria-live": "polite" }),
    ]),
    auth.isAdmin ? el("div", { className: "chip-list" }, [
      el("label", { className: "checkbox chip" }, [
        el("input", { type: "checkbox", name: "is_pinned", checked: post?.is_pinned ?? false }),
        el("span", { text: "📌 상단 고정" }),
      ]),
      el("label", { className: "checkbox chip" }, [
        el("input", { type: "checkbox", name: "is_important", checked: post?.is_important ?? false }),
        el("span", { text: "❗ 중요 공지" }),
      ]),
    ]) : null,
    el("div", { className: "form-actions" }, [
      el("a", { className: "button button--ghost", href: post ? `#/${base}/${post.id}` : `#/${base}`, text: "취소" }),
      el("button", { className: "button button--coral", type: "submit", text: editing ? "변경사항 저장" : "게시글 등록" }),
    ]),
  ]);
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearFieldErrors(form);
    let valid = validateRequiredFields(form, ["title", "content"]);
    if (!valueInRange(form.title.value, 1, 200)) {
      setFieldError(form, "title", "제목은 1~200자로 입력해 주세요.");
      valid = false;
    }
    if (!valueInRange(form.content.value, 1, 20000)) {
      setFieldError(form, "content", "내용은 1~20,000자로 입력해 주세요.");
      valid = false;
    }
    if (!valid) return;
    setBusy(form, true, "저장 중…");
    try {
      const payload = {
        title: form.title.value.trim(),
        content: form.content.value.trim(),
        is_pinned: auth.isAdmin ? form.is_pinned.checked : false,
        is_important: auth.isAdmin ? form.is_important.checked : false,
      };
      const saved = editing
        ? await updatePost(post.id, payload)
        : await createPost({
            ...payload,
            board_type: boardType,
            author_id: auth.user.id,
            status: "published",
          });
      showToast(editing ? "게시글을 수정했습니다." : "게시글을 등록했습니다.", "success");
      window.location.hash = `#/${base}/${saved.id}`;
    } catch (error) {
      showToast(getErrorMessage(error, "게시글 저장에 실패했습니다."), "error");
    } finally {
      setBusy(form, false);
    }
  });
  return pageContainer(
    el("div", { className: "page-header" }, [
      el("div", {}, [
        el("p", { className: "eyebrow", text: boardType === "notice" ? "NOTICE" : "COMMUNITY" }),
        el("h1", { className: "page-title", text: editing ? "게시글 수정" : boardType === "notice" ? "공지사항 작성" : "새 글 작성" }),
      ]),
    ]),
    form,
  );
}
