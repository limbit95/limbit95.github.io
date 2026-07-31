import { getAuthState } from "../auth.js";
import {
  createComment,
  deleteComment,
  deletePost,
  getPost,
  getSignedAvatarUrl,
  incrementPostView,
  listComments,
  updateComment,
} from "../api.js";
import { confirmDialog } from "../components/modal.js";
import { showToast } from "../components/toast.js";
import { el, formatDateTime, getErrorMessage, pageContainer, relativeTime, setBusy } from "../ui.js";

export async function renderPostDetail(route, boardType) {
  const auth = getAuthState();
  const viewedCount = await incrementPostView(route.params.id).catch(() => null);
  const post = await getPost(route.params.id);
  if (post.board_type !== boardType) throw new Error("게시글을 찾을 수 없습니다.");
  const comments = boardType === "free" ? await listComments("post", post.id) : [];
  const base = boardType === "notice" ? "notice" : "community";
  const mine = post.author_id === auth.user.id;
  const root = pageContainer();
  const authorAvatar = await getSignedAvatarUrl(post.author?.avatar_path);
  const article = el("article", { className: "card post-detail" }, [
    el("div", { className: "post-head" }, [
      el("div", { className: "chip-list" }, [
        post.is_pinned ? el("span", { className: "status-badge", text: "📌 상단 고정" }) : null,
        post.is_important ? el("span", { className: "status-badge status-badge--danger", text: "❗ 중요" }) : null,
      ]),
      el("h1", { className: "page-title", text: post.title }),
      el("div", { className: "member-row" }, [
        el("img", { className: "avatar", src: authorAvatar, alt: "", width: "44", height: "44" }),
        el("div", { className: "member-row__body" }, [
          el("span", { className: "member-row__name", text: post.author?.display_name ?? (boardType === "notice" ? "관리자" : "회원") }),
          el("span", { className: "small subtle", text: `${formatDateTime(post.created_at)} · 조회 ${viewedCount ?? post.view_count}`, style: { display: "block" } }),
        ]),
      ]),
    ]),
    el("div", { className: "prose", text: post.content }),
    (auth.isAdmin || (mine && boardType === "free"))
      ? el("div", { className: "button-row" }, [
          el("a", { className: "button button--secondary", href: `#/${base}/${post.id}/edit`, text: "수정" }),
          el("button", {
            className: "button button--ghost",
            type: "button",
            text: "삭제",
            onClick: () => handleDeletePost(post, base),
          }),
        ])
      : null,
  ]);
  root.append(
    el("a", { className: "button button--ghost", href: `#/${base}`, text: "← 목록으로", style: { justifySelf: "start" } }),
    article,
  );
  if (boardType === "free") root.append(createCommentSection(post, comments, auth));
  return root;
}

async function handleDeletePost(post, base) {
  const confirmed = await confirmDialog({
    title: "게시글을 삭제할까요?",
    message: "삭제한 게시글과 연결된 댓글은 다시 확인할 수 없습니다.",
    confirmText: "삭제",
    danger: true,
  });
  if (!confirmed) return;
  try {
    await deletePost(post.id);
    showToast("게시글을 삭제했습니다.", "success");
    window.location.hash = `#/${base}`;
  } catch (error) {
    showToast(getErrorMessage(error, "게시글 삭제에 실패했습니다."), "error");
  }
}

function createCommentSection(post, comments, auth) {
  const section = el("section", { className: "card page-stack", "aria-labelledby": "comments-title" });
  const title = el("h2", { id: "comments-title", className: "section-title", text: `댓글 ${comments.length}개` });
  const form = el("form", { className: "form-grid" }, [
    el("div", { className: "field" }, [
      el("label", { for: "comment-content", text: "댓글 작성" }),
      el("textarea", { id: "comment-content", name: "content", maxlength: "3000", required: true, placeholder: "서로를 배려하는 댓글을 남겨 주세요.", style: { minHeight: "100px" } }),
    ]),
    el("button", { className: "button", type: "submit", text: "댓글 등록", style: { justifySelf: "end" } }),
  ]);
  const list = el("div", { className: "comment-list" });
  if (!comments.length) {
    list.append(el("p", { className: "subtle", text: "아직 댓글이 없습니다. 첫 댓글을 남겨 보세요." }));
  } else {
    comments.forEach((comment) => list.append(commentNode(comment, auth)));
  }
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const content = form.content.value.trim();
    if (!content) {
      showToast("댓글 내용을 입력해 주세요.", "error");
      return;
    }
    setBusy(form, true, "등록 중…");
    try {
      await createComment({
        target_type: "post",
        target_id: post.id,
        author_id: auth.user.id,
        content,
        status: "published",
      });
      showToast("댓글을 등록했습니다.", "success");
      const refreshed = await listComments("post", post.id);
      list.replaceChildren(...refreshed.map((item) => commentNode(item, auth)));
      title.textContent = `댓글 ${refreshed.length}개`;
      form.reset();
    } catch (error) {
      showToast(getErrorMessage(error, "댓글 등록에 실패했습니다."), "error");
    } finally {
      setBusy(form, false);
    }
  });
  section.append(title, form, el("hr", { className: "divider" }), list);
  return section;
}

function commentNode(comment, auth) {
  const canEdit = auth.isAdmin || comment.author_id === auth.user.id;
  const content = el("p", { className: "prose", text: comment.content });
  const node = el("article", { className: "comment" }, [
    el("div", { className: "comment__head" }, [
      el("div", {}, [
        el("strong", { text: comment.author?.display_name ?? "회원" }),
        el("span", { className: "small subtle", text: ` · ${relativeTime(comment.created_at)}` }),
      ]),
      canEdit ? el("div", { className: "comment__actions" }, [
        el("button", {
          className: "button button--ghost",
          type: "button",
          text: "수정",
          onClick: () => startCommentEdit(node, content, comment),
        }),
        el("button", {
          className: "button button--ghost",
          type: "button",
          text: "삭제",
          onClick: () => handleDeleteComment(node, comment.id),
        }),
      ]) : null,
    ]),
    content,
  ]);
  return node;
}

function startCommentEdit(node, contentNode, comment) {
  if (node.querySelector("form")) return;
  const form = el("form", { className: "form-grid" }, [
    el("textarea", { name: "content", maxlength: "3000", required: true, text: comment.content, style: { minHeight: "100px" } }),
    el("div", { className: "button-row" }, [
      el("button", { className: "button button--ghost", type: "button", text: "취소", onClick: () => form.replaceWith(contentNode) }),
      el("button", { className: "button", type: "submit", text: "수정 저장" }),
    ]),
  ]);
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const value = form.content.value.trim();
    if (!value) return;
    setBusy(form, true, "저장 중…");
    try {
      await updateComment(comment.id, value);
      comment.content = value;
      contentNode.textContent = value;
      form.replaceWith(contentNode);
      showToast("댓글을 수정했습니다.", "success");
    } catch (error) {
      showToast(getErrorMessage(error, "댓글 수정에 실패했습니다."), "error");
      setBusy(form, false);
    }
  });
  contentNode.replaceWith(form);
  form.content.focus();
}

async function handleDeleteComment(node, commentId) {
  const confirmed = await confirmDialog({
    title: "댓글을 삭제할까요?",
    message: "삭제한 댓글은 복구할 수 없습니다.",
    confirmText: "삭제",
    danger: true,
  });
  if (!confirmed) return;
  try {
    await deleteComment(commentId);
    node.remove();
    showToast("댓글을 삭제했습니다.", "success");
  } catch (error) {
    showToast(getErrorMessage(error, "댓글 삭제에 실패했습니다."), "error");
  }
}
