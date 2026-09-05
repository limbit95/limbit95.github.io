import { canManageCategory, getAuthState } from "../auth.js";
import { getSignedAvatarUrl } from "../api/profiles.js";
import { enhanceActivityDetails } from "../activity-detail-map.js";
import { enhanceActivityShare } from "../activity-share-enhancements.js";
import {
  cancelEventParticipation,
  getEvent,
  joinEvent,
  listEventParticipants,
  updateEvent,
} from "../api/activities.js";
import { getMyParticipation, participationCounts } from "../components/activityCard.js";
import { confirmDialog, contentDialog } from "../components/modal.js";
import { createProfileAvatarTrigger } from "../components/profilePopover.js";
import { showToast } from "../components/toast.js";
import { EVENT_STATUS_LABEL, PARTICIPATION_STATUS_LABEL } from "../constants.js";
import {
  downloadFile,
  el,
  formatDate,
  formatTime,
  getErrorMessage,
  pageContainer,
  safeUrl,
  setBusy,
} from "../ui.js";

export async function renderActivityDetail(route) {
  const auth = getAuthState();
  const event = await getEvent(route.params.id);
  const participants = await listEventParticipants(event.id);
  const counts = participationCounts(event);
  const mine = getMyParticipation(event, auth.user.id);
  const canManage = canManageCategory(event.category_id);
  const root = pageContainer();
  const categoryColor = event.category?.color ?? "#2f6b4f";

  const detail = el("section", {
    className: "detail-hero activity-detail-hero",
    style: { "--category-color": categoryColor },
  }, [
    el("div", { className: "page-header activity-detail__header" }, [
      el("div", { className: "activity-detail__title-group" }, [
        el("p", { className: "eyebrow", text: `${event.category?.icon ?? "🌿"} ${event.category?.name ?? "활동"}` }),
        el("h1", { className: "detail-title", text: event.title }),
      ]),
      statusBadge(event.status, event.registration_deadline),
    ]),
    el("div", { className: "activity-detail__summary" }, [
      meta("🗓️", "일정", activityScheduleText(event), null, "activity-detail__meta--schedule"),
      meta("📍", "장소", event.location_name, event.location_url),
      meta("💳", "참가비", event.fee_text || "무료"),
      event.difficulty
        ? meta("🌱", "난이도", `${event.difficulty}${event.beginner_friendly ? " · 초보자 환영" : ""}`)
        : null,
    ]),
    createParticipationPanel(event, mine, counts, participants, root),
    el("div", { className: "button-row activity-detail__utility-actions" }, [
      el("button", {
        className: "button button--yellow",
        type: "button",
        text: "📅 내 캘린더에 저장",
        onClick: () => downloadCalendar(event),
      }),
      canManage ? el("a", {
        className: "button button--secondary",
        href: `#/activities/${event.id}/edit`,
        text: "✏️ 활동 수정",
      }) : null,
    ]),
  ]);

  const body = el("div", {
    className: "page-stack activity-detail__body",
    style: { "--category-color": categoryColor },
  }, [
    el("section", { className: "card page-stack activity-detail__content-card" }, [
      el("h2", { className: "section-title", text: "활동 소개" }),
      el("p", { className: "prose", text: event.description }),
    ]),
    event.preparation ? el("section", { className: "card page-stack activity-detail__content-card" }, [
      el("h2", { className: "section-title", text: "🎒 준비물" }),
      el("p", { className: "prose", text: event.preparation }),
    ]) : null,
    event.participant_notice ? el("section", { className: "notice-box notice-box--warning" }, [
      el("strong", { text: "참여자 주의사항" }),
      el("p", { className: "prose", text: event.participant_notice }),
    ]) : null,
    canManage && event.status !== "cancelled"
      ? managementSection(event, root)
      : null,
  ]);

  root.append(detail, body);
  enhanceActivityDetails(root, event);
  enhanceActivityShare(root, event);
  return root;
}

function meta(icon, label, text, link = null, extraClass = "") {
  return el("div", { className: `activity-detail__meta ${extraClass}`.trim() }, [
    el("span", { className: "activity-detail__meta-icon", text: icon, "aria-hidden": "true" }),
    el("div", { className: "activity-detail__meta-body" }, [
      el("span", { className: "activity-detail__meta-label", text: label }),
      link
        ? el("a", {
            className: "activity-detail__meta-value",
            href: safeUrl(link),
            target: "_blank",
            rel: "noopener noreferrer",
            text: `${text} ↗`,
          })
        : el("strong", { className: "activity-detail__meta-value", text }),
    ]),
  ]);
}

function activityScheduleText(event) {
  const time = `${formatTime(event.start_time)}${event.end_time ? `–${formatTime(event.end_time)}` : ""}`;
  return `${formatDate(event.event_date)}\n${time}`;
}

function statusBadge(status, registrationDeadline = null) {
  const registrationClosed = status === "scheduled"
    && registrationDeadline
    && new Date(registrationDeadline) < new Date();
  const variant = status === "cancelled"
    ? "status-badge--danger"
    : registrationClosed || status !== "scheduled"
      ? "status-badge--muted"
      : "";
  const dotColor = status === "cancelled"
    ? "var(--danger)"
    : registrationClosed
      ? "var(--coral-500)"
      : status === "scheduled"
        ? "var(--success)"
        : "#8d9892";
  const label = registrationClosed ? "신청 마감" : EVENT_STATUS_LABEL[status] ?? status;

  return el("span", { className: `status-badge ${variant}`.trim() }, [
    el("span", {
      "aria-hidden": "true",
      style: {
        width: "7px",
        height: "7px",
        borderRadius: "999px",
        background: dotColor,
        flex: "0 0 auto",
      },
    }),
    el("span", { text: label }),
  ]);
}

function createParticipationPanel(event, mine, counts, participants, root) {
  const deadline = new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(event.registration_deadline));

  return el("aside", { className: "activity-detail__participation-panel" }, [
    createParticipationOverview(event, mine, counts, participants, deadline),
    createParticipationAction(event, mine, counts, root),
  ]);
}

function createParticipationOverview(event, mine, counts, participants, deadline) {
  const countText = event.capacity
    ? `${counts.joined}/${event.capacity}명`
    : `${counts.joined}명`;

  return el("div", { className: "activity-detail__participation-overview" }, [
    el("div", { className: "activity-detail__overview-heading" }, [
      el("span", { className: "activity-detail__overview-label", text: "참여 현황" }),
      el("strong", { className: "activity-detail__overview-count", text: countText }),
    ]),
    counts.waitlisted
      ? el("span", { className: "activity-detail__overview-waitlist", text: `대기 ${counts.waitlisted}명` })
      : el("span", { className: "activity-detail__overview-waitlist", text: "현재 대기 없음" }),
    mine && mine.status !== "cancelled"
      ? el("span", {
          className: "activity-detail__my-status",
          text: `내 신청 상태 · ${PARTICIPATION_STATUS_LABEL[mine.status]}`,
        })
      : null,
    el("div", { className: "activity-detail__overview-deadline" }, [
      el("span", { className: "activity-detail__overview-deadline-label", text: "신청 마감" }),
      el("span", { className: "activity-detail__overview-deadline-date", text: deadline }),
    ]),
    el("button", {
      className: "button button--secondary activity-detail__participants-button",
      type: "button",
      text: "참여 인원 보기",
      onClick: (clickEvent) => openParticipantsDialog(participants, counts, clickEvent.currentTarget),
    }),
  ]);
}

function createParticipationAction(event, mine, counts, root) {
  const wrapper = el("div", { className: "activity-detail__participation-action" });
  const registrationOpen = event.status === "scheduled"
    && new Date(event.registration_deadline) >= new Date();

  if (mine && mine.status !== "cancelled" && registrationOpen) {
    wrapper.append(el("button", {
      className: "button button--secondary button--block activity-detail__participation-button",
      type: "button",
      text: `${mine.status === "waitlisted" ? "⏳ 대기 신청 취소" : "참여 취소"}`,
      onClick: async (clickEvent) => {
        const confirmed = await confirmDialog({
          title: "참여를 취소할까요?",
          message: "취소 후 다시 신청하면 대기 순서가 달라질 수 있습니다.",
          confirmText: "참여 취소",
          danger: true,
        });
        if (!confirmed) return;
        setBusy(clickEvent.currentTarget, true, "취소 중…");
        try {
          await cancelEventParticipation(event.id);
          showToast("참여를 취소했습니다.", "success");
          root.replaceWith(await renderActivityDetail({ params: { id: String(event.id) } }));
        } catch (error) {
          showToast(getErrorMessage(error), "error");
          setBusy(clickEvent.currentTarget, false);
        }
      },
    }));
  } else if (mine && mine.status !== "cancelled") {
    wrapper.append(el("button", {
      className: "button button--secondary button--block activity-detail__participation-button",
      type: "button",
      text: `${mine.status === "waitlisted" ? "⏳" : "✓"} ${PARTICIPATION_STATUS_LABEL[mine.status]} · 신청 마감`,
      disabled: true,
    }));
  } else if (registrationOpen) {
    const full = event.capacity && counts.joined >= event.capacity;
    wrapper.append(el("button", {
      className: "button button--block activity-detail__participation-button activity-detail__participation-button--primary",
      type: "button",
      text: full ? "⏳ 대기 신청하기" : "🙌 참여 신청하기",
      onClick: async (clickEvent) => {
        const confirmed = await confirmDialog({
          title: full ? "대기 신청할까요?" : "활동에 참여할까요?",
          message: full ? "자리가 생기면 신청 순서대로 자동 참여 확정됩니다." : `"${event.title}" 참여를 신청합니다.`,
          confirmText: full ? "대기 신청" : "참여 신청",
        });
        if (!confirmed) return;
        setBusy(clickEvent.currentTarget, true, "신청 중…");
        try {
          const result = await joinEvent(event.id);
          showToast(result === "waitlisted" ? "대기 명단에 등록되었습니다." : "참여 신청이 완료되었습니다.", "success");
          root.replaceWith(await renderActivityDetail({ params: { id: String(event.id) } }));
        } catch (error) {
          showToast(getErrorMessage(error), "error");
          setBusy(clickEvent.currentTarget, false);
        }
      },
    }));
  } else {
    wrapper.append(el("div", {
      className: "activity-detail__closed-message",
      text: "현재는 이 활동에 참여 신청할 수 없습니다.",
    }));
  }
  return wrapper;
}

async function openParticipantsDialog(participants, counts, button) {
  setBusy(button, true, "불러오는 중…");
  try {
    const content = await participantDialogContent(participants, counts);
    setBusy(button, false);
    void contentDialog({
      title: "참여 인원",
      content,
    });
  } catch (error) {
    showToast(getErrorMessage(error, "참여 인원을 불러오지 못했습니다."), "error");
    setBusy(button, false);
  }
}

async function participantDialogContent(participants, counts) {
  const joined = participants.filter((item) => item.status === "joined");
  const content = el("div", { className: "activity-participants-dialog page-stack" }, [
    el("div", { className: "activity-participants-dialog__summary" }, [
      el("strong", { text: `참여 ${counts.joined}명` }),
      counts.waitlisted
        ? el("span", { className: "status-badge status-badge--warning", text: `⏳ 대기 ${counts.waitlisted}명` })
        : null,
    ]),
  ]);

  if (!joined.length) {
    content.append(el("div", {
      className: "activity-participants-dialog__empty",
      text: "아직 참여 신청한 사람이 없습니다.",
    }));
    return content;
  }

  const people = await Promise.all(joined.map(async (item) => {
    const profile = item.profile;
    const avatar = await getSignedAvatarUrl(profile?.avatar_path);
    const profileAvatar = profile
      ? createProfileAvatarTrigger(profile, { avatarUrl: avatar })
      : el("img", { className: "avatar", src: avatar, alt: "", width: "44", height: "44" });
    return el("div", { className: "participant-person" }, [
      profileAvatar,
      el("strong", { text: profile?.display_name ?? "회원" }),
      profile?.age_group ? el("span", { className: "small subtle", text: profile.age_group }) : null,
    ]);
  }));

  content.append(el("div", { className: "participant-list activity-participants-dialog__list" }, people));
  return content;
}

function managementSection(event, root) {
  return el("section", { className: "activity-detail__management" }, [
    el("div", { className: "activity-detail__management-copy" }, [
      el("strong", { text: "관리자 작업" }),
      el("p", {
        className: "small subtle",
        text: "활동 자체를 진행하지 않게 된 경우에만 일정을 취소해 주세요.",
      }),
    ]),
    el("button", {
      className: "button activity-detail__cancel-schedule",
      type: "button",
      text: "일정 취소",
      onClick: (clickEvent) => cancelSchedule(event, root, clickEvent.currentTarget),
    }),
  ]);
}

async function cancelSchedule(event, root, button) {
  const confirmed = await confirmDialog({
    title: "활동 일정을 취소할까요?",
    message: "참여자와 대기자에게 취소 알림이 생성되며, 취소 상태는 되돌리기 전에 신중히 확인해야 합니다.",
    confirmText: "일정 취소",
    danger: true,
  });
  if (!confirmed) return;
  setBusy(button, true, "취소 중…");
  try {
    await updateEvent(event.id, { status: "cancelled" });
    showToast("활동 일정을 취소했습니다.", "success");
    root.replaceWith(await renderActivityDetail({ params: { id: String(event.id) } }));
  } catch (error) {
    showToast(getErrorMessage(error), "error");
    setBusy(button, false);
  }
}

function downloadCalendar(event) {
  const compactDate = event.event_date.replaceAll("-", "");
  const compactTime = (event.start_time || "00:00").replaceAll(":", "").slice(0, 6).padEnd(6, "0");
  const endTime = (event.end_time || event.start_time || "00:00").replaceAll(":", "").slice(0, 6).padEnd(6, "0");
  const escapeIcs = (value) => String(value ?? "").replaceAll("\\", "\\\\").replaceAll("\n", "\\n").replaceAll(",", "\\,").replaceAll(";", "\\;");
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Cheongpa Gachi//Activities//KO",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:event-${event.id}@cheongpa-gachi`,
    `DTSTAMP:${new Date().toISOString().replaceAll(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z")}`,
    `DTSTART;TZID=Asia/Seoul:${compactDate}T${compactTime}`,
    `DTEND;TZID=Asia/Seoul:${compactDate}T${endTime}`,
    `SUMMARY:${escapeIcs(event.title)}`,
    `DESCRIPTION:${escapeIcs(event.description)}`,
    `LOCATION:${escapeIcs(event.location_name)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  downloadFile(`activity-${event.id}.ics`, `${lines.join("\r\n")}\r\n`, "text/calendar;charset=utf-8");
}
