import { EVENT_STATUS_LABEL, PARTICIPATION_STATUS_LABEL } from "../constants.js";
import { el, formatDate, formatTime } from "../ui.js";

export function participationCounts(event) {
  if (Number.isFinite(Number(event.joined_count)) && Number.isFinite(Number(event.waitlisted_count))) {
    return {
      joined: Number(event.joined_count),
      waitlisted: Number(event.waitlisted_count),
    };
  }
  const participants = event.participants ?? [];
  return {
    joined: participants.filter((item) => item.status === "joined").length,
    waitlisted: participants.filter((item) => item.status === "waitlisted").length,
  };
}

export function getMyParticipation(event, userId) {
  if (event.my_participation_status) {
    return {
      user_id: userId,
      status: event.my_participation_status,
    };
  }
  return (event.participants ?? []).find((item) => item.user_id === userId) ?? null;
}

function statusBadge(event) {
  const deadlinePassed = event.status === "scheduled"
    && event.registration_deadline
    && new Date(event.registration_deadline) < new Date();
  if (deadlinePassed) {
    return el("span", {
      className: "status-badge status-badge--muted",
      text: "■ 신청 마감",
    });
  }
  const className = event.status === "cancelled"
    ? "status-badge status-badge--danger"
    : event.status === "closed" || event.status === "completed"
      ? "status-badge status-badge--muted"
      : "status-badge";
  const icon = event.status === "scheduled" ? "●" : event.status === "cancelled" ? "✕" : "■";
  return el("span", { className, text: `${icon} ${EVENT_STATUS_LABEL[event.status] ?? event.status}` });
}

export function createActivityCard(event, {
  userId,
  onJoin,
  onCancel,
  compact = false,
} = {}) {
  const counts = participationCounts(event);
  const mine = getMyParticipation(event, userId);
  const registrationOpen = event.status === "scheduled"
    && (!event.registration_deadline || new Date(event.registration_deadline) >= new Date());
  const capacityLabel = event.capacity ? `${counts.joined}/${event.capacity}명` : `${counts.joined}명`;
  const meterValue = event.capacity ? Math.min(100, Math.round((counts.joined / event.capacity) * 100)) : 0;
  const card = el("article", {
    className: "activity-card",
    style: { "--category-color": event.category?.color ?? "#2f6b4f" },
  });
  const titleLink = el("a", { href: `#/activities/${event.id}` }, [
    el("h3", { className: "activity-card__title", text: event.title }),
  ]);
  const header = el("div", { className: "activity-card__header" }, [
    el("div", {}, [
      el("span", {
        className: "eyebrow",
        text: `${event.category?.icon ?? "🌿"} ${event.category?.name ?? "활동"}`,
      }),
      titleLink,
    ]),
    statusBadge(event),
  ]);
  const meta = el("div", { className: "meta-list" }, [
    el("div", { className: "meta-item" }, [
      el("span", { className: "meta-icon", text: "🗓️", "aria-hidden": "true" }),
      el("span", { text: `${formatDate(event.event_date)} ${formatTime(event.start_time)}` }),
    ]),
    el("div", { className: "meta-item" }, [
      el("span", { className: "meta-icon", text: "📍", "aria-hidden": "true" }),
      el("span", { text: event.location_name }),
    ]),
    el("div", { className: "meta-item" }, [
      el("span", { className: "meta-icon", text: "👥", "aria-hidden": "true" }),
      el("span", { text: `참여 ${capacityLabel}${counts.waitlisted ? ` · 대기 ${counts.waitlisted}명` : ""}` }),
    ]),
  ]);
  const meter = event.capacity
    ? el("div", { className: "participant-meter" }, [
        el("div", {
          className: "meter",
          role: "progressbar",
          "aria-label": "참여 인원",
          "aria-valuemin": "0",
          "aria-valuemax": event.capacity,
          "aria-valuenow": counts.joined,
        }, el("span", { style: { "--meter-value": `${meterValue}%` } })),
      ])
    : null;
  const footer = el("div", { className: "activity-card__footer" }, [meter]);

  if (!compact) {
    if (mine && mine.status !== "cancelled" && registrationOpen) {
      footer.append(el("button", {
        className: "button button--secondary",
        type: "button",
        text: `${mine.status === "waitlisted" ? "⏳" : "✓"} ${PARTICIPATION_STATUS_LABEL[mine.status]} · 취소`,
        onClick: (clickEvent) => onCancel?.(event, mine, clickEvent.currentTarget),
      }));
    } else if (!mine || mine.status === "cancelled") {
      if (registrationOpen) {
        footer.append(el("button", {
          className: "button button--coral",
          type: "button",
          text: event.capacity && counts.joined >= event.capacity ? "⏳ 대기 신청" : "🙌 참여하기",
          onClick: (clickEvent) => onJoin?.(event, clickEvent.currentTarget),
        }));
      } else {
        footer.append(el("a", {
          className: "button button--ghost",
          href: `#/activities/${event.id}`,
          text: event.status === "scheduled" ? "신청 마감 · 상세 보기" : "상세 보기",
        }));
      }
    } else {
      footer.append(el("button", {
        className: "button button--secondary",
        type: "button",
        text: `${mine.status === "waitlisted" ? "⏳" : "✓"} ${PARTICIPATION_STATUS_LABEL[mine.status]}`,
        disabled: true,
      }));
    }
  }
  card.append(header, meta, footer);
  return card;
}
