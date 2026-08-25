import { canManageCategory, getAuthState } from "../auth.js";
import {
  cancelEventParticipation,
  getEvent,
  getSignedAvatarUrl,
  joinEvent,
  listEventParticipants,
  updateEvent,
} from "../api.js";
import { getMyParticipation, participationCounts } from "../components/activityCard.js";
import { confirmDialog } from "../components/modal.js";
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
  const detail = el("section", {
    className: "detail-hero",
    style: { "--category-color": event.category?.color ?? "#2f6b4f" },
  }, [
    el("div", { className: "page-header" }, [
      el("div", {}, [
        el("p", { className: "eyebrow", text: `${event.category?.icon ?? "🌿"} ${event.category?.name ?? "활동"}` }),
        el("h1", { className: "detail-title", text: event.title }),
      ]),
      statusBadge(event.status, event.registration_deadline),
    ]),
    el("div", { className: "meta-list" }, [
      meta("🗓️", `${formatDate(event.event_date)} ${formatTime(event.start_time)}${event.end_time ? `–${formatTime(event.end_time)}` : ""}`),
      meta("📍", event.location_name, event.location_url),
      meta("👥", event.capacity
        ? `참여 ${counts.joined}/${event.capacity}명${counts.waitlisted ? ` · 대기 ${counts.waitlisted}명` : ""}`
        : `참여 ${counts.joined}명${counts.waitlisted ? ` · 대기 ${counts.waitlisted}명` : ""}`),
      meta("💳", event.fee_text || "무료"),
      event.difficulty ? meta("🌱", `난이도 ${event.difficulty}${event.beginner_friendly ? " · 초보자 환영" : ""}`) : null,
    ]),
    el("div", { className: "button-row" }, [
      el("button", {
        className: "button button--yellow",
        type: "button",
        text: "📅 내 캘린더에 저장",
        onClick: () => downloadCalendar(event),
      }),
      canManage ? el("a", { className: "button button--secondary", href: `#/activities/${event.id}/edit`, text: "✏️ 활동 수정" }) : null,
      canManage && event.status !== "cancelled"
        ? el("button", {
            className: "button button--ghost",
            type: "button",
            text: "일정 취소",
            onClick: (clickEvent) => cancelSchedule(event, root, clickEvent.currentTarget),
          })
        : null,
    ]),
  ]);
  const body = el("div", { className: "sidebar-layout" }, [
    el("div", { className: "page-stack" }, [
      el("section", { className: "card page-stack" }, [
        el("h2", { className: "section-title", text: "활동 소개" }),
        el("p", { className: "prose", text: event.description }),
      ]),
      event.preparation ? el("section", { className: "card page-stack" }, [
        el("h2", { className: "section-title", text: "🎒 준비물" }),
        el("p", { className: "prose", text: event.preparation }),
      ]) : null,
      event.participant_notice ? el("section", { className: "notice-box notice-box--warning" }, [
        el("strong", { text: "참여 전 확인해 주세요" }),
        el("p", { className: "prose", text: event.participant_notice }),
      ]) : null,
      await participantSection(participants, counts),
    ]),
    el("aside", { className: "page-stack" }, [
      el("section", { className: "card page-stack" }, [
        el("h2", { className: "section-title", text: "참여 안내" }),
        el("p", { text: `신청 마감: ${new Intl.DateTimeFormat("ko-KR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(event.registration_deadline))}` }),
        mine && mine.status !== "cancelled"
          ? el("div", { className: "notice-box", text: `현재 상태: ${PARTICIPATION_STATUS_LABEL[mine.status]}` })
          : null,
      ]),
      createParticipationAction(event, mine, counts, root),
    ]),
  ]);
  root.append(detail, body);
  return root;
}

function meta(icon, text, link = null) {
  return el("div", { className: "meta-item" }, [
    el("span", { className: "meta-icon", text: icon, "aria-hidden": "true" }),
    link
      ? el("a", { href: safeUrl(link), target: "_blank", rel: "noopener noreferrer", text: `${text} ↗` })
      : el("span", { text }),
  ]);
}

function statusBadge(status, registrationDeadline = null) {
  if (status === "scheduled" && registrationDeadline && new Date(registrationDeadline) < new Date()) {
    return el("span", {
      className: "status-badge status-badge--muted",
      text: "■ 신청 마감",
    });
  }
  const variant = status === "cancelled" ? "status-badge--danger" : status === "scheduled" ? "" : "status-badge--muted";
  return el("span", {
    className: `status-badge ${variant}`,
    text: `${status === "scheduled" ? "●" : status === "cancelled" ? "✕" : "■"} ${EVENT_STATUS_LABEL[status] ?? status}`,
  });
}

function createParticipationAction(event, mine, counts, root) {
  const wrapper = el("div", { className: "sticky-action" });
  const registrationOpen = event.status === "scheduled"
    && new Date(event.registration_deadline) >= new Date();
  if (mine && mine.status !== "cancelled" && registrationOpen) {
    wrapper.append(el("button", {
      className: "button button--secondary button--block",
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
      className: "button button--secondary button--block",
      type: "button",
      text: `${mine.status === "waitlisted" ? "⏳" : "✓"} ${PARTICIPATION_STATUS_LABEL[mine.status]} · 신청 마감`,
      disabled: true,
    }));
  } else if (registrationOpen) {
    const full = event.capacity && counts.joined >= event.capacity;
    wrapper.append(el("button", {
      className: "button button--coral button--block",
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
    wrapper.append(el("div", { className: "notice-box notice-box--warning", text: "현재는 이 활동에 참여 신청할 수 없습니다." }));
  }
  return wrapper;
}

async function participantSection(participants, counts) {
  const section = el("section", { className: "card page-stack" }, [
    el("div", { className: "page-header" }, [
      el("h2", { className: "section-title", text: `함께하는 사람 ${counts.joined}명` }),
      counts.waitlisted ? el("span", { className: "status-badge status-badge--warning", text: `⏳ 대기 ${counts.waitlisted}명` }) : null,
    ]),
  ]);
  const joined = participants.filter((item) => item.status === "joined");
  if (!joined.length) {
    section.append(el("p", { className: "subtle", text: "첫 번째 참여자가 되어 보세요!" }));
    return section;
  }
  const list = el("div", { className: "participant-list" });
  await Promise.all(joined.map(async (item) => {
    const profile = item.profile;
    const avatar = await getSignedAvatarUrl(profile?.avatar_path);
    const profileAvatar = profile
      ? createProfileAvatarTrigger(profile, { avatarUrl: avatar })
      : el("img", { className: "avatar", src: avatar, alt: "", width: "44", height: "44" });
    list.append(el("div", { className: "participant-person" }, [
      profileAvatar,
      el("strong", { text: profile?.display_name ?? "회원" }),
      profile?.age_group ? el("span", { className: "small subtle", text: profile.age_group }) : null,
    ]));
  }));
  section.append(list);
  return section;
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
