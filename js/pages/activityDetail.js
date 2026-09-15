import { getAuthState } from "../auth.js";
import { getSignedAvatarUrl } from "../api/profiles.js";
import { enhanceActivityDetails } from "../activity-detail-map.js";
import { enhanceActivityShare } from "../activity-share-enhancements.js";
import {
  cancelEventParticipation,
  getEvent,
  joinEvent,
  listEventOrganizerHistory,
  listEventParticipants,
  removeEvent,
  transferEventOrganizer,
  updateEvent,
} from "../api/activities.js";
import { getMyParticipation, participationCounts } from "../components/activityCard.js";
import { contentDialog, confirmDialog } from "../components/modal.js";
import { createProfileAvatarTrigger } from "../components/profilePopover.js";
import { showToast } from "../components/toast.js";
import { EVENT_STATUS_LABEL, PARTICIPATION_STATUS_LABEL } from "../constants.js";
import {
  canCancelActivityFor,
  canDeleteActivityFor,
  canEditActivityFor,
} from "../permissions.js";
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
  const [participants, organizerHistory] = await Promise.all([
    listEventParticipants(event.id),
    listEventOrganizerHistory(event.id),
  ]);
  const counts = participationCounts(event);
  const mine = getMyParticipation(event, auth.user.id);
  const canEdit = canEditActivityFor(auth, event);
  const canCancel = canCancelActivityFor(auth, event);
  const canDelete = canDeleteActivityFor(auth, event);
  const root = pageContainer();
  const categoryColor = event.category?.color ?? "#2f6b4f";
  const organizerAvatarUrl = await getSignedAvatarUrl(event.organizer?.avatar_path);
  const canTransferOrganizer = event.series_id == null
    && event.created_by === auth.user.id
    && ["scheduled", "closed"].includes(event.status);

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
      organizerMeta(event, organizerAvatarUrl, canTransferOrganizer, participants, organizerHistory, root),
    ]),
    createParticipationPanel(event, mine, counts, participants, root, auth),
    el("div", { className: "button-row activity-detail__utility-actions" }, [
      el("button", {
        className: "button button--yellow",
        type: "button",
        text: "📅 내 캘린더에 저장",
        onClick: () => downloadCalendar(event),
      }),
      canEdit ? el("a", {
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
    el("section", { className: "card page-stack activity-detail__content-card" }, [
      el("h2", { className: "section-title", text: "🎒 준비물" }),
      el("p", { className: "prose", text: event.preparation ?? "" }),
    ]),
    el("section", { className: "notice-box notice-box--warning" }, [
      el("strong", { text: "참여자 주의사항" }),
      el("p", { className: "prose", text: event.participant_notice ?? "" }),
    ]),
    canCancel || canDelete
      ? managementSection(event, root, { canCancel, canDelete })
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

function organizerMeta(event, avatarUrl, canTransfer, participants, organizerHistory, root) {
  const profile = event.organizer;
  const organizerAvatar = profile
    ? createProfileAvatarTrigger(profile, { avatarUrl, portalMenu: true })
    : el("span", { className: "activity-detail__organizer-fallback", text: "👤", "aria-hidden": "true" });
  const organizerActions = organizerHistory.length || canTransfer
    ? el("span", {
        style: {
          display: "flex",
          alignItems: "center",
          gap: ".3rem",
          flex: "0 0 auto",
        },
      }, [
        organizerHistory.length ? el("button", {
          className: "activity-detail__organizer-change",
          type: "button",
          text: "주최자 이력",
          title: "주최자 변경 이력 보기",
          onClick: () => openOrganizerHistoryDialog(organizerHistory),
        }) : null,
        canTransfer ? el("button", {
          className: "activity-detail__organizer-change",
          type: "button",
          text: "변경",
          onClick: (clickEvent) => openOrganizerTransferDialog({
            event,
            participants,
            root,
            trigger: clickEvent.currentTarget,
          }),
        }) : null,
      ])
    : null;

  return el("div", { className: "activity-detail__meta activity-detail__organizer" }, [
    el("span", { className: "activity-detail__meta-icon", text: "👑", "aria-hidden": "true" }),
    el("div", { className: "activity-detail__meta-body" }, [
      el("span", { className: "activity-detail__meta-label", text: "주최자" }),
      el("div", { className: "activity-detail__meta-value activity-detail__organizer-value" }, [
        el("span", { className: "activity-detail__organizer-profile" }, [
          organizerAvatar,
          el("strong", { text: profile?.display_name ?? "회원" }),
        ]),
        organizerActions,
      ]),
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
  if (registrationClosed) {
    return el("span", {
      className: "status-badge status-badge--muted",
      text: "■ 신청 마감",
    });
  }
  const variant = status === "cancelled"
    ? "status-badge--danger"
    : status !== "scheduled"
      ? "status-badge--muted"
      : "";
  const dotColor = status === "cancelled"
    ? "var(--danger)"
    : status === "scheduled"
      ? "var(--success)"
      : "#8d9892";
  const label = EVENT_STATUS_LABEL[status] ?? status;

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

function createParticipationPanel(event, mine, counts, participants, root, auth) {
  const deadline = new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(event.registration_deadline));

  return el("aside", { className: "activity-detail__participation-panel" }, [
    createParticipationOverview(event, mine, counts, participants, deadline),
    createParticipationAction(event, mine, counts, participants, root, auth),
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
      onClick: (clickEvent) => openParticipantsDialog(event, participants, counts, clickEvent.currentTarget),
    }),
  ]);
}

function createParticipationAction(event, mine, counts, participants, root, auth) {
  const wrapper = el("div", { className: "activity-detail__participation-action" });
  const registrationOpen = event.status === "scheduled"
    && new Date(event.registration_deadline) >= new Date();

  if (mine && mine.status !== "cancelled" && registrationOpen) {
    wrapper.append(el("button", {
      className: "button button--secondary button--block activity-detail__participation-button",
      type: "button",
      text: `${mine.status === "waitlisted" ? "⏳ 대기 신청 취소" : "참여 취소"}`,
      onClick: async (clickEvent) => {
        const isOrganizer = event.series_id == null
          && event.created_by === auth.user.id
          && mine.status === "joined";
        const otherJoinedParticipants = participants.filter((participant) => (
          participant.status === "joined" && participant.user_id !== auth.user.id
        ));
        if (isOrganizer && otherJoinedParticipants.length) {
          await openOrganizerTransferDialog({
            event,
            participants,
            root,
            trigger: clickEvent.currentTarget,
            leaveAfterTransfer: true,
          });
          return;
        }

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

async function openParticipantsDialog(event, participants, counts, button) {
  setBusy(button, true, "불러오는 중…");
  try {
    const content = await participantDialogContent(event, participants, counts);
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

async function participantDialogContent(event, participants, counts) {
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
      ? createProfileAvatarTrigger(profile, { avatarUrl: avatar, portalMenu: true })
      : el("img", { className: "avatar", src: avatar, alt: "", width: "44", height: "44" });
    const isOrganizer = item.user_id === event.created_by;
    return el("div", { className: "participant-person" }, [
      el("span", { className: "participant-person__avatar-wrap" }, [
        profileAvatar,
        isOrganizer ? el("span", {
          className: "participant-person__organizer-crown",
          text: "👑",
          title: "주최자",
          "aria-label": "주최자",
        }) : null,
      ]),
      el("strong", { text: profile?.display_name ?? "회원" }),
      profile?.age_group ? el("span", { className: "small subtle", text: profile.age_group }) : null,
    ]);
  }));

  content.append(el("div", { className: "participant-list activity-participants-dialog__list" }, people));
  return content;
}

function openOrganizerHistoryDialog(history) {
  const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
  });
  const content = el("div", { className: "page-stack" }, history.map((item) => (
    el("div", {
      style: {
        display: "grid",
        gap: ".35rem",
        padding: ".78rem .82rem",
        border: "1px solid #dde9ec",
        borderRadius: "12px",
        background: "#f9fcfd",
      },
    }, [
      el("div", {
        style: {
          display: "flex",
          alignItems: "center",
          gap: ".45rem",
          flexWrap: "wrap",
          color: "#45636e",
        },
      }, [
        el("strong", { text: item.previous_organizer_name ?? "회원" }),
        el("span", { text: "→", "aria-hidden": "true" }),
        el("strong", { text: item.organizer_name ?? "회원" }),
      ]),
      el("span", {
        className: "small subtle",
        text: dateFormatter.format(new Date(item.changed_at)),
      }),
      el("span", {
        className: "small subtle",
        text: item.previous_organizer_left
          ? "이전 주최자 · 참여 취소"
          : "이전 주최자 · 계속 참여",
      }),
    ])
  )));

  return contentDialog({
    title: "주최자 변경 이력",
    content,
  });
}

async function openOrganizerTransferDialog({
  event,
  participants,
  root,
  trigger,
  leaveAfterTransfer = false,
}) {
  const candidates = participants.filter((participant) => (
    participant.status === "joined" && participant.user_id !== event.created_by
  ));
  const content = el("div", { className: "activity-organizer-transfer page-stack" }, [
    el("p", {
      className: "prose activity-organizer-transfer__message",
      text: leaveAfterTransfer
        ? "현재 활동의 주최자입니다. 참여를 취소하려면 먼저 함께 참여 중인 사람에게 주최자를 넘겨주세요."
        : "함께 참여 중인 사람 중 새 주최자를 선택해주세요. 주최자를 넘기면 활동 수정과 일정 관리 권한도 함께 이전됩니다.",
    }),
  ]);

  if (!candidates.length) {
    content.append(el("div", {
      className: "activity-organizer-transfer__empty",
      text: "주최자를 넘길 수 있는 다른 참여자가 없습니다.",
    }));
  } else {
    const candidateRows = await Promise.all(candidates.map(async (participant) => {
      const profile = participant.profile;
      const avatarUrl = await getSignedAvatarUrl(profile?.avatar_path);
      const profileAvatar = profile
        ? createProfileAvatarTrigger(profile, { avatarUrl, portalMenu: true })
        : el("span", { className: "activity-detail__organizer-fallback", text: "👤", "aria-hidden": "true" });
      return el("div", { className: "activity-organizer-transfer__person" }, [
        el("span", { className: "activity-organizer-transfer__profile" }, [
          profileAvatar,
          el("strong", { text: profile?.display_name ?? "회원" }),
        ]),
        el("button", {
          className: `button ${leaveAfterTransfer ? "button--danger" : "button--secondary"}`,
          type: "button",
          text: leaveAfterTransfer ? "넘기고 참여 취소" : "주최자로 변경",
          onClick: async (clickEvent) => {
            setBusy(clickEvent.currentTarget, true, "변경 중…");
            try {
              await transferEventOrganizer(event.id, participant.user_id, { leaveCurrent: leaveAfterTransfer });
              showToast(
                leaveAfterTransfer
                  ? `${profile?.display_name ?? "선택한 참여자"}님에게 주최자를 넘기고 참여를 취소했습니다.`
                  : `${profile?.display_name ?? "선택한 참여자"}님으로 주최자를 변경했습니다.`,
                "success",
              );
              root.replaceWith(await renderActivityDetail({ params: { id: String(event.id) } }));
            } catch (error) {
              showToast(getErrorMessage(error), "error");
              setBusy(clickEvent.currentTarget, false);
            }
          },
        }),
      ]);
    }));
    content.append(el("div", { className: "activity-organizer-transfer__list" }, candidateRows));
  }

  if (leaveAfterTransfer) {
    content.append(el("p", {
      className: "small subtle activity-organizer-transfer__hint",
      text: "활동 자체를 진행하지 않을 경우에는 참여 취소 대신 아래 활동 관리의 ‘일정 취소’를 이용해주세요.",
    }));
  }

  if (trigger) setBusy(trigger, false);
  return contentDialog({
    title: leaveAfterTransfer ? "주최자를 먼저 변경해주세요" : "주최자 변경",
    content,
  });
}

function managementSection(event, root, permissions) {
  const guidance = permissions.canDelete
    ? "일정 취소와 운영상 필요한 단일 활동 정리를 구분해 진행해 주세요."
    : "활동 자체를 진행하지 않게 된 경우에만 일정을 취소해 주세요.";
  return el("section", { className: "activity-detail__management" }, [
    el("div", { className: "activity-detail__management-copy" }, [
      el("strong", { text: "활동 관리" }),
      el("p", {
        className: "small subtle",
        text: guidance,
      }),
    ]),
    permissions.canCancel ? el("button", {
      className: "button activity-detail__cancel-schedule",
      type: "button",
      text: "일정 취소",
      onClick: (clickEvent) => cancelSchedule(event, root, clickEvent.currentTarget),
    }) : null,
    permissions.canDelete ? el("button", {
      className: "button button--danger",
      type: "button",
      text: "활동 삭제",
      onClick: (clickEvent) => removeSchedule(event, root, clickEvent.currentTarget),
    }) : null,
  ]);
}

async function removeSchedule(event, root, button) {
  const confirmed = await confirmDialog({
    title: "활동을 삭제할까요?",
    message: "참여 이력이 있으면 활동과 이력을 보존하고 일정 취소로 처리합니다.",
    confirmText: "삭제 요청",
    danger: true,
  });
  if (!confirmed) return;
  setBusy(button, true, "처리 중…");
  try {
    const result = await removeEvent(event.id);
    if (result?.action === "cancelled") {
      showToast("참여 이력이 있어 활동을 취소하고 이력을 보존했습니다.", "success");
      root.replaceWith(await renderActivityDetail({ params: { id: String(event.id) } }));
    } else {
      showToast("활동을 삭제했습니다.", "success");
      window.location.hash = "#/activities";
    }
  } catch (error) {
    showToast(getErrorMessage(error), "error");
    setBusy(button, false);
  }
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
