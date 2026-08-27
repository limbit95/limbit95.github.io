import { getAuthState } from "../auth.js";
import { getSignedAvatarUrl } from "../api/profiles.js";
import {
  createComment,
  deleteComment,
  deletePost,
  getCommentReactionSummary,
  getPost,
  incrementPostView,
  listCommentsPage,
  updateComment,
} from "../api/boards.js";
import { confirmDialog } from "../components/modal.js";
import { createProfileAvatarTrigger } from "../components/profilePopover.js";
import { showToast } from "../components/toast.js";
import { el, formatDateTime, getErrorMessage, pageContainer, relativeTime, setBusy } from "../ui.js";

const PRAYER_REACTION_TEXT = "__PRAYER_TOGETHER__";
const COMMENT_PAGE_SIZE = 10;

export async function renderPostDetail(route, boardType) {
  const auth = getAuthState();
  const isPrayer = boardType === "free";
  const viewedCount = await incrementPostView(route.params.id).catch(() => null);
  const post = await getPost(route.params.id);
  if (post.board_type !== boardType) throw new Error("게시글을 찾을 수 없습니다.");
  const [commentPage, reactionSummary] = isPrayer
    ? await Promise.all([
        listCommentsPage("post", post.id, {
          limit: COMMENT_PAGE_SIZE,
          excludeContent: PRAYER_REACTION_TEXT,
          withCount: true,
        }),
        getCommentReactionSummary("post", post.id, auth.user.id, PRAYER_REACTION_TEXT),
      ])
    : [{ rows: [], count: 0, hasMore: false, nextBeforeId: null }, { count: 0, myReaction: null }];
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
    isPrayer ? createPrayerReaction(post, reactionSummary, auth) : null,
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
  if (isPrayer) root.append(createCommentSection(post, commentPage, auth, true));
  return root;
}

function createPrayerReaction(post, initialSummary, auth) {
  let myReaction = initialSummary?.myReaction ?? null;
  let reactionCount = Number(initialSummary?.count ?? 0);
  const button = el("button", { type: "button" });
  const description = el("span", { className: "small subtle" });
  const wrapper = el("div", { className: "notice-box page-stack" }, [
    el("strong", { text: "이 기도 제목을 위해 함께 기도해 주세요" }),
    button,
    description,
  ]);

  const refresh = () => {
    button.className = `button ${myReaction ? "button--yellow" : "button--secondary"}`;
    button.textContent = myReaction
      ? `🙏 함께 기도하는 중 · ${reactionCount}명`
      : `🙏 함께 기도해요 · ${reactionCount}명`;
    description.textContent = myReaction
      ? "함께 기도하고 있다는 마음을 전했어요. 다시 누르면 반응을 취소할 수 있어요."
      : reactionCount
        ? `${reactionCount}명이 이 기도 제목을 함께 품고 기도하고 있어요.`
        : "첫 번째로 함께 기도하는 마음을 전해 보세요.";
  };

  button.addEventListener("click", async () => {
    setBusy(button, true, myReaction ? "취소 중…" : "전하는 중…");
    try {
      if (myReaction) {
        await deleteComment(myReaction.id);
        reactionCount = Math.max(0, reactionCount - 1);
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
        reactionCount += 1;
        myReaction = created;
        showToast("함께 기도하는 마음을 전했습니다.", "success");
      }
    } catch (error) {
      const latest = await getCommentReactionSummary("post", post.id, auth.user.id, PRAYER_REACTION_TEXT).catch(() => null);
      if (latest) {
        reactionCount = Number(latest.count ?? reactionCount);
        myReaction = latest.myReaction ?? null;
      }
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
      ? "삭제한 기도 제목과 연결된 반응·응원 메시지는 다시 확인할 수 없습니다."
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

function createCommentSection(post, initialPage, auth, isPrayer = false) {
  let comments = [...(initialPage?.rows ?? [])];
  let totalCount = Number(initialPage?.count ?? comments.length);
  let hasMore = Boolean(initialPage?.hasMore);
  let beforeId = initialPage?.nextBeforeId ?? null;
  const section = el("section", {
    className: isPrayer ? "card page-stack prayer-comment-section" : "card page-stack",
    "aria-labelledby": "comments-title",
  });
  const title = el("h2", {
    id: "comments-title",
    className: "section-title",
  });

  const form = isPrayer
    ? el("form", { className: "prayer-comment-form" }, [
        el("textarea", {
          id: "comment-content",
          name: "content",
          maxlength: "3000",
          required: true,
          "aria-label": "응원 메시지",
          placeholder: "따뜻한 응원 메시지를 남겨 주세요.",
        }),
        el("button", {
          className: "button prayer-comment-form__submit",
          type: "submit",
          text: "등록",
        }),
      ])
    : el("form", { className: "form-grid" }, [
        el("div", { className: "field" }, [
          el("label", { for: "comment-content", text: "댓글 작성" }),
          el("textarea", {
            id: "comment-content",
            name: "content",
            maxlength: "3000",
            required: true,
            placeholder: "서로를 배려하는 댓글을 남겨 주세요.",
            style: { minHeight: "100px" },
          }),
        ]),
        el("button", {
          className: "button",
          type: "submit",
          text: "댓글 등록",
          style: { justifySelf: "end" },
        }),
      ]);

  const loadMoreButton = el("button", {
    className: "button button--ghost",
    type: "button",
    text: isPrayer ? "이전 응원 메시지 더 보기" : "이전 댓글 더 보기",
  });
  const loadMoreRow = el("div", { className: "button-row" }, [loadMoreButton]);
  const list = el("div", { className: isPrayer ? "comment-list prayer-comment-list" : "comment-list" });

  const updateTitle = () => {
    title.textContent = isPrayer ? `응원 메시지 ${totalCount}개` : `댓글 ${totalCount}개`;
  };
  const updateLoadMore = () => {
    loadMoreRow.hidden = !hasMore;
  };
  const renderCurrent = () => {
    renderCommentList(list, comments, auth, isPrayer, refreshLatest);
    updateTitle();
    updateLoadMore();
  };
  async function refreshLatest() {
    const refreshed = await listCommentsPage("post", post.id, {
      limit: COMMENT_PAGE_SIZE,
      excludeContent: isPrayer ? PRAYER_REACTION_TEXT : null,
      withCount: true,
    });
    comments = [...refreshed.rows];
    totalCount = Number(refreshed.count ?? comments.length);
    hasMore = Boolean(refreshed.hasMore);
    beforeId = refreshed.nextBeforeId ?? null;
    renderCurrent();
  }

  loadMoreButton.addEventListener("click", async () => {
    if (!hasMore || beforeId === null) return;
    setBusy(loadMoreButton, true, "불러오는 중…");
    try {
      const olderPage = await listCommentsPage("post", post.id, {
        limit: COMMENT_PAGE_SIZE,
        beforeId,
        excludeContent: isPrayer ? PRAYER_REACTION_TEXT : null,
      });
      comments = [...olderPage.rows, ...comments];
      hasMore = Boolean(olderPage.hasMore);
      beforeId = olderPage.nextBeforeId ?? null;
      renderCurrent();
    } catch (error) {
      showToast(getErrorMessage(error, isPrayer ? "이전 응원 메시지를 불러오지 못했습니다." : "이전 댓글을 불러오지 못했습니다."), "error");
    } finally {
      setBusy(loadMoreButton, false);
    }
  });

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
      await refreshLatest();
      form.reset();
      showToast(isPrayer ? "응원 메시지를 남겼습니다." : "댓글을 등록했습니다.", "success");
    } catch (error) {
      showToast(getErrorMessage(error, isPrayer ? "응원 메시지 등록에 실패했습니다." : "댓글 등록에 실패했습니다."), "error");
    } finally {
      setBusy(form, false);
    }
  });

  renderCurrent();
  section.append(title, form, el("hr", { className: "divider" }), loadMoreRow, list);
  return section;
}

function renderCommentList(list, comments, auth, isPrayer, onDeleted = null) {
  list.replaceChildren();
  if (!comments.length) {
    list.append(el("p", {
      className: isPrayer ? "subtle prayer-comment-empty" : "subtle",
      text: isPrayer
        ? "아직 응원 메시지가 없습니다. 따뜻한 응원을 먼저 남겨 보세요."
        : "아직 댓글이 없습니다. 첫 댓글을 남겨 보세요.",
    }));
    return;
  }
  comments.forEach((comment) => list.append(commentNode(comment, auth, isPrayer, onDeleted)));
}

function commentNode(comment, auth, isPrayer = false, onDeleted = null) {
  const canEdit = auth.isAdmin || comment.author_id === auth.user.id;
  const authorName = comment.author?.display_name ?? "회원";
  const authorAvatar = comment.author
    ? createProfileAvatarTrigger(comment.author, {
        avatarUrl: "./assets/images/default-avatar.svg",
        size: 34,
        alt: "",
      })
    : el("span", {
        className: "prayer-comment__author-mark",
        text: authorName.slice(0, 1),
        "aria-hidden": "true",
      });

  if (comment.author) {
    getSignedAvatarUrl(comment.author.avatar_path)
      .then((avatarUrl) => {
        const image = authorAvatar.querySelector("img");
        if (image) image.src = avatarUrl;
      })
      .catch(() => {});
  }

  const content = el("p", {
    className: isPrayer ? "prose prayer-comment__content" : "prose",
    text: comment.content,
  });
  const authorBlock = isPrayer
    ? el("div", { className: "prayer-comment__author" }, [
        authorAvatar,
        el("div", { className: "prayer-comment__author-meta" }, [
          el("strong", { className: "prayer-comment__author-name", text: authorName }),
          el("span", { className: "small subtle prayer-comment__time", text: relativeTime(comment.created_at) }),
        ]),
      ])
    : el("div", { className: "prayer-comment__author" }, [
        authorAvatar,
        el("div", { className: "prayer-comment__author-meta" }, [
          el("strong", { text: authorName }),
          el("span", { className: "small subtle", text: relativeTime(comment.created_at) }),
        ]),
      ]);

  const node = el("article", {
    className: isPrayer ? "comment prayer-comment" : "comment",
    style: { overflow: "visible" },
  }, [
    el("div", { className: isPrayer ? "comment__head prayer-comment__head" : "comment__head" }, [
      authorBlock,
      canEdit ? el("div", { className: "comment__actions" }, [
        el("button", {
          className: isPrayer ? "button button--ghost prayer-comment__action" : "button button--ghost",
          type: "button",
          text: "수정",
          onClick: () => startCommentEdit(node, content, comment, isPrayer),
        }),
        el("button", {
          className: isPrayer ? "button button--ghost prayer-comment__action prayer-comment__action--delete" : "button button--ghost",
          type: "button",
          text: "삭제",
          onClick: () => handleDeleteComment(node, comment.id, isPrayer, onDeleted),
        }),
      ]) : null,
    ]),
    content,
  ]);
  return node;
}

function startCommentEdit(node, contentNode, comment, isPrayer = false) {
  if (node.querySelector("form")) return;
  const form = el("form", { className: isPrayer ? "form-grid prayer-comment-edit" : "form-grid" }, [
    el("textarea", { name: "content", maxlength: "3000", required: true, text: comment.content, style: { minHeight: "100px" } }),
    el("div", { className: "button-row" }, [
      el("button", { className: "button button--ghost", type: "button", text: "취소", onClick: () => form.replaceWith(contentNode) }),
      el("button", { className: "button", type: "submit", text: isPrayer ? "수정 완료" : "수정 저장" }),
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
      showToast(isPrayer ? "응원 메시지를 수정했습니다." : "댓글을 수정했습니다.", "success");
    } catch (error) {
      showToast(getErrorMessage(error, isPrayer ? "응원 메시지 수정에 실패했습니다." : "댓글 수정에 실패했습니다."), "error");
      setBusy(form, false);
    }
  });
  contentNode.replaceWith(form);
  form.content.focus();
}

async function handleDeleteComment(node, commentId, isPrayer = false, onDeleted = null) {
  const confirmed = await confirmDialog({
    title: isPrayer ? "응원 메시지를 삭제할까요?" : "댓글을 삭제할까요?",
    message: isPrayer ? "삭제한 응원 메시지는 복구할 수 없습니다." : "삭제한 댓글은 복구할 수 없습니다.",
    confirmText: "삭제",
    danger: true,
  });
  if (!confirmed) return;
  try {
    await deleteComment(commentId);
    node.remove();
    if (onDeleted) await onDeleted(commentId);
    showToast(isPrayer ? "응원 메시지를 삭제했습니다." : "댓글을 삭제했습니다.", "success");
  } catch (error) {
    showToast(getErrorMessage(error, isPrayer ? "응원 메시지 삭제에 실패했습니다." : "댓글 삭제에 실패했습니다."), "error");
  }
}
