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
import { createProfileAvatarTrigger } from "../components/profilePopover.js";
import { showToast } from "../components/toast.js";
import { el, formatDateTime, getErrorMessage, pageContainer, relativeTime, setBusy } from "../ui.js";

const PRAYER_REACTION_TEXT = "__PRAYER_TOGETHER__";

export async function renderPostDetail(route, boardType) {
  const auth = getAuthState();
  const isPrayer = boardType === "free";
  const viewedCount = await incrementPostView(route.params.id).catch(() => null);
  const post = await getPost(route.params.id);
  if (post.board_type !== boardType) throw new Error("게시글을 찾을 수 없습니다.");
  const comments = isPrayer ? await listComments("post", post.id) : [];
  const reactionComments = isPrayer ? comments.filter((comment) => comment.content === PRAYER_REACTION_TEXT) : [];
  const visibleComments = isPrayer ? comments.filter((comment) => comment.content !== PRAYER_REACTION_TEXT) : [];
  const base = boardType === "notice" ? "notice" : "prayer";
  const mine = post.author_id === auth.user.id;
  const root = pageContainer();
  const authorAvatar = await getSignedAvatarUrl(post.author?.avatar_path);
  const authorProfile = post.author
    ? createProfileAvatarTrigger(post.author, { avatarUrl: authorAvatar })
    : el("img", { className: "avatar", src: authorAvatar, alt: "", width: "44", height: "44" });
  const article = el("article", { className: "card post-detail" }, [
    el("div", { className: "post-head" }, [
      el("div", { className: "chip-list" }, [
        post.is_pinned ? el("span", { className: "status-badge", text: "📌 상단 고정" }) : null,
        post.is_important ? el("span", { className: "status-badge status-badge--danger", text: "❗ 중요" }) : null,
        isPrayer ? el("span", { className: "status-badge", text: "🙏 기도 제목" }) : null,
      ]),
      el("h1", { className: "page-title", text: post.title }),
      el("div", { className: "member-row" }, [
        authorProfile,
        el("div", { className: "member-row__body" }, [
          el("span", { className: "member-row__name", text: post.author?.display_name ?? (boardType === "notice" ? "관리자" : "회원") }),
          el("span", { className: "small subtle", text: `${formatDateTime(post.created_at)} · 조회 ${viewedCount ?? post.view_count}`, style: { display: "block" } }),
        ]),
      ]),
    ]),
    el("div", { className: "prose", text: post.content }),
    isPrayer ? createPrayerReaction(post, reactionComments, auth) : null,
    (auth.isAdmin || (mine && isPrayer))
      ? el("div", { className: "button-row" }, [
          el("a", { className: "button button--secondary", href: `#/${base}/${post.id}/edit`, text: "수정" }),
          el("button", {
            className: "button button--ghost",
            type: "button",
            text: "삭제",
            onClick: () => handleDeletePost(post, base, isPrayer),
          }),
        ])
      : null,
  ]);
  root.append(
    el("a", { className: "button button--ghost", href: `#/${base}`, text: "← 목록으로", style: { justifySelf: "start" } }),
    article,
  );
  if (isPrayer) root.append(createCommentSection(post, visibleComments, auth, true));
  return root;
}

function createPrayerReaction(post, reactionComments, auth) {
  let myReaction = reactionComments.find((comment) => comment.author_id === auth.user.id) ?? null;
  const button = el("button", { type: "button" });
  const description = el("span", { className: "small subtle" });
  const wrapper = el("div", { className: "notice-box page-stack" }, [
    el("strong", { text: "이 기도 제목을 위해 함께 기도해 주세요" }),
    button,
    description,
  ]);

  const refresh = () => {
    const count = new Set(reactionComments.map((comment) => comment.author_id)).size;
    button.className = `button ${myReaction ? "button--yellow" : "button--secondary"}`;
    button.textContent = myReaction
      ? `🙏 함께 기도하는 중 · ${count}명`
      : `🙏 함께 기도해요 · ${count}명`;
    description.textContent = myReaction
      ? "함께 기도하고 있다는 마음을 전했어요. 다시 누르면 반응을 취소할 수 있어요."
      : count
        ? `${count}명이 이 기도 제목을 함께 품고 기도하고 있어요.`
        : "첫 번째로 함께 기도하는 마음을 전해 보세요.";
  };

  button.addEventListener("click", async () => {
    setBusy(button, true, myReaction ? "취소 중…" : "전하는 중…");
    try {
      if (myReaction) {
        await deleteComment(myReaction.id);
        const index = reactionComments.findIndex((comment) => comment.id === myReaction.id);
        if (index >= 0) reactionComments.splice(index, 1);
        myReaction = null;
        showToast("함께 기도해요 반응을 취소했습니다.", "success");
      } else {
        const created = await createComment({
          target_type: "post",
          target_id: post.id,
          author_id: auth.user.id,
          content: PRAYER_REACTION_TEXT,
          status: "published",
        });
        reactionComments.push(created);
        myReaction = created;
        showToast("함께 기도하는 마음을 전했습니다.", "success");
      }
    } catch (error) {
      showToast(getErrorMessage(error, "기도 반응을 처리하지 못했습니다."), "error");
    } finally {
      setBusy(button, false);
      refresh();
    }
  });

  refresh();
  return wrapper;
}

async function handleDeletePost(post, base, isPrayer = false) {
  const confirmed = await confirmDialog({
    title: isPrayer ? "기도 제목을 삭제할까요?" : "게시글을 삭제할까요?",
    message: isPrayer
      ? "삭제한 기도 제목과 연결된 반응·메시지는 다시 확인할 수 없습니다."
      : "삭제한 게시글과 연결된 댓글은 다시 확인할 수 없습니다.",
    confirmText: "삭제",
    danger: true,
  });
  if (!confirmed) return;
  try {
    await deletePost(post.id);
    showToast(isPrayer ? "기도 제목을 삭제했습니다." : "게시글을 삭제했습니다.", "success");
    window.location.hash = `#/${base}`;
  } catch (error) {
    showToast(getErrorMessage(error, isPrayer ? "기도 제목 삭제에 실패했습니다." : "게시글 삭제에 실패했습니다."), "error");
  }
}

function createCommentSection(post, comments, auth, isPrayer = false) {
  const section = el("section", { className: "card page-stack", "aria-labelledby": "comments-title" });
  const title = el("h2", {
    id: "comments-title",
    className: "section-title",
    text: isPrayer ? `응원과 기도 나눔 ${comments.length}개` : `댓글 ${comments.length}개`,
  });
  const form = el("form", { className: "form-grid" }, [
    el("div", { className: "field" }, [
      el("label", { for: "comment-content", text: isPrayer ? "응원 메시지" : "댓글 작성" }),
      el("textarea", {
        id: "comment-content",
        name: "content",
        maxlength: "3000",
        required: true,
        placeholder: isPrayer
          ? "함께 기도하며 전하고 싶은 응원이나 마음을 남겨 주세요."
          : "서로를 배려하는 댓글을 남겨 주세요.",
        style: { minHeight: "100px" },
      }),
    ]),
    el("button", {
      className: "button",
      type: "submit",
      text: isPrayer ? "메시지 남기기" : "댓글 등록",
      style: { justifySelf: "end" },
    }),
  ]);
  const list = el("div", { className: "comment-list" });
  renderCommentList(list, comments, auth, isPrayer);
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const content = form.content.value.trim();
    if (!content) {
      showToast(isPrayer ? "응원 메시지를 입력해 주세요." : "댓글 내용을 입력해 주세요.", "error");
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
      showToast(isPrayer ? "응원과 기도의 마음을 남겼습니다." : "댓글을 등록했습니다.", "success");
      const refreshedAll = await listComments("post", post.id);
      const refreshed = isPrayer
        ? refreshedAll.filter((item) => item.content !== PRAYER_REACTION_TEXT)
        : refreshedAll;
      renderCommentList(list, refreshed, auth, isPrayer);
      title.textContent = isPrayer ? `응원과 기도 나눔 ${refreshed.length}개` : `댓글 ${refreshed.length}개`;
      form.reset();
    } catch (error) {
      showToast(getErrorMessage(error, isPrayer ? "메시지 등록에 실패했습니다." : "댓글 등록에 실패했습니다."), "error");
    } finally {
      setBusy(form, false);
    }
  });
  section.append(title, form, el("hr", { className: "divider" }), list);
  return section;
}

function renderCommentList(list, comments, auth, isPrayer) {
  list.replaceChildren();
  if (!comments.length) {
    list.append(el("p", {
      className: "subtle",
      text: isPrayer
        ? "아직 응원 메시지가 없습니다. 함께 기도하는 마음을 먼저 남겨 보세요."
        : "아직 댓글이 없습니다. 첫 댓글을 남겨 보세요.",
    }));
    return;
  }
  comments.forEach((comment) => list.append(commentNode(comment, auth, isPrayer)));
}

function commentNode(comment, auth, isPrayer = false) {
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
          onClick: () => startCommentEdit(node, content, comment, isPrayer),
        }),
        el("button", {
          className: "button button--ghost",
          type: "button",
          text: "삭제",
          onClick: () => handleDeleteComment(node, comment.id, isPrayer),
        }),
      ]) : null,
    ]),
    content,
  ]);
  return node;
}

function startCommentEdit(node, contentNode, comment, isPrayer = false) {
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
      showToast(isPrayer ? "메시지를 수정했습니다." : "댓글을 수정했습니다.", "success");
    } catch (error) {
      showToast(getErrorMessage(error, isPrayer ? "메시지 수정에 실패했습니다." : "댓글 수정에 실패했습니다."), "error");
      setBusy(form, false);
    }
  });
  contentNode.replaceWith(form);
  form.content.focus();
}

async function handleDeleteComment(node, commentId, isPrayer = false) {
  const confirmed = await confirmDialog({
    title: isPrayer ? "메시지를 삭제할까요?" : "댓글을 삭제할까요?",
    message: isPrayer ? "삭제한 메시지는 복구할 수 없습니다." : "삭제한 댓글은 복구할 수 없습니다.",
    confirmText: "삭제",
    danger: true,
  });
  if (!confirmed) return;
  try {
    await deleteComment(commentId);
    node.remove();
    showToast(isPrayer ? "메시지를 삭제했습니다." : "댓글을 삭제했습니다.", "success");
  } catch (error) {
    showToast(getErrorMessage(error, isPrayer ? "메시지 삭제에 실패했습니다." : "댓글 삭제에 실패했습니다."), "error");
  }
}
