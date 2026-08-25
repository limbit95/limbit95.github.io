import { cancelEventParticipation, joinEvent, listEvents } from "../../api.js";
import { createActivityCard } from "../../components/activityCard.js";
import { confirmDialog } from "../../components/modal.js";
import { showToast } from "../../components/toast.js";
import { emptyState, getErrorMessage, seoulDateString, setBusy } from "../../ui.js";

export async function renderActivityList(categoryId, search, auth) {
  const today = seoulDateString();
  const events = await listEvents({ categoryId, search, fromDate: today });
  if (!events.length) {
    return emptyState(
      search ? "검색 결과가 없어요" : "예정된 활동이 없어요",
      search ? "다른 검색어나 카테고리를 선택해 보세요." : "새 활동이 등록되면 이곳에 표시됩니다.",
      search ? document.createRange().createContextualFragment('<a class="button button--secondary" href="#/activities?view=list">검색 초기화</a>') : null,
    );
  }
  const grid = document.createElement("section");
  grid.className = "activity-grid";
  grid.setAttribute("aria-label", "활동 목록");
  const refresh = async () => {
    const updated = await renderActivityList(categoryId, search, auth);
    grid.replaceWith(updated);
  };
  events.forEach((event) => {
    grid.append(createActivityCard(event, {
      userId: auth.user.id,
      onJoin: (target, button) => participationAction(target, "join", refresh, button),
      onCancel: (target, _mine, button) => participationAction(target, "cancel", refresh, button),
    }));
  });
  return grid;
}

async function participationAction(event, action, refresh, button) {
  const joining = action === "join";
  const confirmed = await confirmDialog({
    title: joining ? "참여를 신청할까요?" : "참여를 취소할까요?",
    message: joining
      ? `"${event.title}" 활동에 참여합니다. 정원이 찬 경우 자동으로 대기 신청됩니다.`
      : `"${event.title}" 참여를 취소합니다.`,
    confirmText: joining ? "참여 신청" : "참여 취소",
    danger: !joining,
  });
  if (!confirmed) return;
  setBusy(button, true, joining ? "신청 중…" : "취소 중…");
  try {
    const result = joining ? await joinEvent(event.id) : await cancelEventParticipation(event.id);
    showToast(
      joining
        ? result === "waitlisted" ? "정원이 차서 대기자로 등록되었습니다." : "참여 신청이 완료되었습니다."
        : "참여를 취소했습니다.",
      "success",
    );
    await refresh();
  } catch (error) {
    showToast(getErrorMessage(error), "error");
    setBusy(button, false);
  }
}
