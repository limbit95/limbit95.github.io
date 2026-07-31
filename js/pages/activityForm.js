import { canManageCategory, getAuthState } from "../auth.js";
import {
  createEvent,
  createRecurringEvent,
  getEvent,
  listCategories,
  updateEvent,
} from "../api.js";
import { confirmDialog } from "../components/modal.js";
import { showToast } from "../components/toast.js";
import {
  accessDeniedState,
  el,
  getErrorMessage,
  pageContainer,
  setBusy,
} from "../ui.js";
import { clearFieldErrors, setFieldError, validateRequiredFields, validateUrl } from "../validators.js";

export async function renderActivityForm(route, mode) {
  const auth = getAuthState();
  const editing = mode === "edit";
  const [categories, event] = await Promise.all([
    listCategories({ activeOnly: !editing }),
    editing ? getEvent(route.params.id) : Promise.resolve(null),
  ]);
  if (editing && !canManageCategory(event.category_id)) {
    return pageContainer(accessDeniedState("이 활동 카테고리의 관리자만 수정할 수 있습니다."));
  }
  const availableCategories = auth.isAdmin
    ? categories
    : categories.filter((category) => auth.managerCategoryIds.has(Number(category.id)));
  if (!availableCategories.length) {
    return pageContainer(accessDeniedState("담당자로 지정된 활성 카테고리가 없습니다."));
  }
  const form = createForm(availableCategories, event, editing);
  const root = pageContainer(
    el("div", { className: "page-header" }, [
      el("div", {}, [
        el("p", { className: "eyebrow", text: editing ? "EDIT ACTIVITY" : "NEW ACTIVITY" }),
        el("h1", { className: "page-title", text: editing ? "활동 수정" : "새 활동 등록" }),
        el("p", { className: "page-description", text: "참여자가 필요한 정보를 한눈에 확인할 수 있도록 정확히 입력해 주세요." }),
      ]),
    ]),
    el("div", { className: "notice-box", text: "권한은 화면 표시와 별개로 Supabase RLS에서 다시 검사합니다. 일정 변경 시 참여자에게 알림이 생성됩니다." }),
    form,
  );
  form.addEventListener("submit", (submitEvent) => handleSubmit(submitEvent, {
    auth,
    editing,
    event,
    availableCategories,
  }));
  return root;
}

function createForm(categories, event, editing) {
  const form = el("form", { className: "card form-grid", novalidate: true });
  const category = el("select", { id: "event-category", name: "category_id", required: true }, categories.map((item) => el("option", {
    value: item.id,
    text: `${item.icon} ${item.name}`,
    selected: Number(item.id) === Number(event?.category_id),
  })));
  const recurring = el("input", { id: "event-recurring", name: "recurring", type: "checkbox", disabled: editing });
  const recurrenceFields = el("fieldset", {
    className: "card card--flat form-grid form-grid--2",
    hidden: true,
  }, [
    el("legend", { className: "section-title", text: "반복 규칙" }),
    selectControl("recurrence_frequency", "반복 주기", [["WEEKLY", "매주"], ["MONTHLY", "매월"]]),
    inputControl("recurrence_interval", "반복 간격", "number", { min: "1", max: "12", value: "1" }, "예: 2이면 격주 또는 격월"),
    inputControl("recurrence_end_date", "반복 종료일", "date", {}, "", true),
  ]);
  recurring.addEventListener("change", () => {
    recurrenceFields.hidden = !recurring.checked;
    recurrenceFields.querySelector('[name="recurrence_end_date"]').required = recurring.checked;
  });

  form.append(
    el("section", { className: "form-grid form-grid--2" }, [
      control("카테고리", category, true),
      inputControl("title", "활동 이름", "text", { maxlength: "150", value: event?.title ?? "" }, "", true),
      el("div", { className: "field field--full" }, [
        el("label", { className: "required", for: "event-description", text: "활동 소개" }),
        el("textarea", { id: "event-description", name: "description", maxlength: "5000", required: true, text: event?.description ?? "" }),
        errorFor("description"),
      ]),
    ]),
    el("section", { className: "card card--flat form-grid" }, [
      el("h2", { className: "section-title", text: "🗓️ 일정" }),
      el("div", { className: "form-grid form-grid--2" }, [
        inputControl("event_date", "활동 날짜", "date", { value: event?.event_date ?? "" }, "", true),
        inputControl("registration_deadline", "신청 마감", "datetime-local", { value: event ? isoToSeoulInput(event.registration_deadline) : "" }, "", true),
        inputControl("start_time", "시작 시간", "time", { value: event?.start_time?.slice(0, 5) ?? "" }, "", true),
        inputControl("end_time", "종료 시간", "time", { value: event?.end_time?.slice(0, 5) ?? "" }),
      ]),
      !editing ? el("label", { className: "checkbox" }, [
        recurring,
        el("span", {}, [
          el("strong", { text: "반복 활동으로 등록" }),
          el("span", { className: "small subtle", text: " 첫 일정을 포함해 종료일까지 개별 활동을 생성합니다." }),
        ]),
      ]) : null,
      recurrenceFields,
    ]),
    el("section", { className: "card card--flat form-grid form-grid--2" }, [
      el("h2", { className: "section-title field--full", text: "📍 장소와 참여 정보" }),
      inputControl("location_name", "장소", "text", { maxlength: "200", value: event?.location_name ?? "" }, "", true),
      inputControl("location_url", "지도 링크", "url", { value: event?.location_url ?? "", placeholder: "https://..." }),
      inputControl("capacity", "모집 정원", "number", { min: "1", value: event?.capacity ?? "" }, "비워 두면 정원 제한 없음"),
      inputControl("fee_text", "참가비", "text", { maxlength: "200", value: event?.fee_text ?? "무료" }),
      inputControl("difficulty", "난이도", "text", { maxlength: "100", value: event?.difficulty ?? "", placeholder: "예: 쉬움, 5km 완주 가능자" }),
      el("div", { className: "field" }, [
        el("span", { className: "field-label", text: "초보자 참여" }),
        el("label", { className: "checkbox" }, [
          el("input", { type: "checkbox", name: "beginner_friendly", checked: event?.beginner_friendly ?? true }),
          el("span", { text: "초보자 환영 표시" }),
        ]),
      ]),
      el("div", { className: "field field--full" }, [
        el("label", { for: "event-preparation", text: "준비물" }),
        el("textarea", { id: "event-preparation", name: "preparation", maxlength: "1000", text: event?.preparation ?? "" }),
        errorFor("preparation"),
      ]),
      el("div", { className: "field field--full" }, [
        el("label", { for: "event-participant_notice", text: "참여자 유의사항" }),
        el("textarea", { id: "event-participant_notice", name: "participant_notice", maxlength: "2000", text: event?.participant_notice ?? "" }),
        errorFor("participant_notice"),
      ]),
      editing ? selectControl("status", "활동 상태", [
        ["scheduled", "모집 중"],
        ["closed", "모집 마감"],
        ["completed", "활동 완료"],
        ["cancelled", "일정 취소"],
      ], event.status) : null,
    ]),
    el("div", { className: "form-actions" }, [
      el("a", { className: "button button--ghost", href: event ? `#/activities/${event.id}` : "#/activities", text: "취소" }),
      el("button", { className: "button button--coral", type: "submit", text: editing ? "변경사항 저장" : "활동 등록" }),
    ]),
  );
  return form;
}

async function handleSubmit(submitEvent, context) {
  submitEvent.preventDefault();
  const form = submitEvent.currentTarget;
  clearFieldErrors(form);
  let valid = validateRequiredFields(form, [
    "category_id",
    "title",
    "description",
    "event_date",
    "registration_deadline",
    "start_time",
    "location_name",
  ]);
  if (!validateUrl(form.location_url.value)) {
    setFieldError(form, "location_url", "http 또는 https로 시작하는 올바른 링크를 입력해 주세요.");
    valid = false;
  }
  if (form.end_time.value && form.end_time.value <= form.start_time.value) {
    setFieldError(form, "end_time", "종료 시간은 시작 시간보다 늦어야 합니다.");
    valid = false;
  }
  const eventStart = new Date(`${form.event_date.value}T${form.start_time.value}:00+09:00`);
  const deadline = new Date(`${form.registration_deadline.value}:00+09:00`);
  if (deadline >= eventStart) {
    setFieldError(form, "registration_deadline", "신청 마감은 활동 시작 전이어야 합니다.");
    valid = false;
  }
  if (!context.auth.isAdmin && !context.auth.managerCategoryIds.has(Number(form.category_id.value))) {
    setFieldError(form, "category_id", "담당자로 지정된 카테고리만 선택할 수 있습니다.");
    valid = false;
  }
  if (form.recurring?.checked) {
    const end = form.recurrence_end_date.value;
    if (!end || end < form.event_date.value) {
      setFieldError(form, "recurrence_end_date", "반복 종료일은 첫 활동 날짜 이후여야 합니다.");
      valid = false;
    }
  }
  if (!valid) {
    form.querySelector('[aria-invalid="true"]')?.focus();
    return;
  }

  if (context.editing && context.event.status !== "cancelled" && form.status.value === "cancelled") {
    const confirmed = await confirmDialog({
      title: "활동 일정을 취소할까요?",
      message: "참여자와 대기자에게 일정 취소 알림이 생성됩니다.",
      confirmText: "일정 취소",
      danger: true,
    });
    if (!confirmed) return;
  }

  setBusy(form, true, context.editing ? "저장 중…" : "등록 중…");
  try {
    const payload = eventPayloadFromForm(form);
    let saved;
    if (context.editing) {
      saved = await updateEvent(context.event.id, {
        ...payload,
        status: form.status.value,
      });
    } else if (form.recurring.checked) {
      const dates = generateOccurrenceDates(
        form.event_date.value,
        form.recurrence_end_date.value,
        form.recurrence_frequency.value,
        Number(form.recurrence_interval.value),
      );
      const leadMs = eventStart.getTime() - deadline.getTime();
      const occurrences = dates.map((date) => {
        const occurrenceStart = new Date(`${date}T${form.start_time.value}:00+09:00`);
        return {
          ...payload,
          event_date: date,
          registration_deadline: new Date(occurrenceStart.getTime() - leadMs).toISOString(),
          created_by: context.auth.user.id,
        };
      });
      const recurrenceRule = `FREQ=${form.recurrence_frequency.value};INTERVAL=${Number(form.recurrence_interval.value)};UNTIL=${form.recurrence_end_date.value.replaceAll("-", "")}`;
      const result = await createRecurringEvent({
        category_id: payload.category_id,
        title: payload.title,
        description: payload.description,
        start_date: form.event_date.value,
        end_date: form.recurrence_end_date.value,
        start_time: payload.start_time,
        end_time: payload.end_time,
        timezone: "Asia/Seoul",
        recurrence_rule: recurrenceRule,
        location_name: payload.location_name,
        location_url: payload.location_url,
        capacity: payload.capacity,
        fee_text: payload.fee_text,
        difficulty: payload.difficulty,
        preparation: payload.preparation,
        beginner_friendly: payload.beginner_friendly,
        participant_notice: payload.participant_notice,
        status: "active",
        created_by: context.auth.user.id,
      }, occurrences);
      saved = result.events[0];
    } else {
      saved = await createEvent({
        ...payload,
        created_by: context.auth.user.id,
        status: "scheduled",
      });
    }
    showToast(context.editing ? "활동 정보를 저장했습니다." : "활동을 등록했습니다.", "success");
    window.location.hash = `#/activities/${saved.id}`;
  } catch (error) {
    showToast(getErrorMessage(error, "활동을 저장하지 못했습니다. 입력 내용을 확인해 주세요."), "error");
  } finally {
    setBusy(form, false);
  }
}

function eventPayloadFromForm(form) {
  return {
    category_id: Number(form.category_id.value),
    title: form.title.value.trim(),
    description: form.description.value.trim(),
    event_date: form.event_date.value,
    start_time: form.start_time.value,
    end_time: form.end_time.value || null,
    location_name: form.location_name.value.trim(),
    location_url: form.location_url.value.trim() || null,
    capacity: form.capacity.value ? Number(form.capacity.value) : null,
    fee_text: form.fee_text.value.trim() || "무료",
    difficulty: form.difficulty.value.trim() || null,
    preparation: form.preparation.value.trim(),
    beginner_friendly: form.beginner_friendly.checked,
    participant_notice: form.participant_notice.value.trim(),
    registration_deadline: new Date(`${form.registration_deadline.value}:00+09:00`).toISOString(),
  };
}

function generateOccurrenceDates(startValue, endValue, frequency, interval) {
  const dates = [];
  const [startYear, startMonth, startDay] = startValue.split("-").map(Number);
  const [endYear, endMonth, endDay] = endValue.split("-").map(Number);
  const end = new Date(endYear, endMonth - 1, endDay);
  const step = Math.max(1, interval);
  if (frequency === "WEEKLY") {
    const current = new Date(startYear, startMonth - 1, startDay);
    while (current <= end) {
      if (dates.length >= 60) throw new Error("반복 활동은 한 번에 최대 60개까지 등록할 수 있습니다.");
      dates.push(localDateString(current));
      current.setDate(current.getDate() + 7 * step);
    }
  } else {
    let offset = 0;
    while (true) {
      const targetMonth = startMonth - 1 + offset;
      const candidate = new Date(startYear, targetMonth, startDay);
      if (candidate > end) break;
      if (candidate.getDate() === startDay) {
        if (dates.length >= 60) throw new Error("반복 활동은 한 번에 최대 60개까지 등록할 수 있습니다.");
        dates.push(localDateString(candidate));
      }
      offset += step;
    }
  }
  if (!dates.length) throw new Error("생성할 반복 일정이 없습니다.");
  return dates;
}

function inputControl(name, label, type, attributes = {}, help = "", required = false) {
  const input = el("input", {
    id: `event-${name}`,
    name,
    type,
    required,
    ...attributes,
  });
  return el("div", { className: "field" }, [
    el("label", { className: required ? "required" : "", for: input.id, text: label }),
    input,
    help ? el("p", { className: "field-help", text: help }) : null,
    errorFor(name),
  ]);
}

function selectControl(name, label, options, selected = null) {
  const select = el("select", { id: `event-${name}`, name }, options.map(([value, text]) => el("option", {
    value,
    text,
    selected: value === selected,
  })));
  return control(label, select);
}

function control(label, input, required = false) {
  return el("div", { className: "field" }, [
    el("label", { className: required ? "required" : "", for: input.id, text: label }),
    input,
    errorFor(input.name),
  ]);
}

function errorFor(name) {
  return el("p", { className: "field-error", dataset: { errorFor: name }, "aria-live": "polite" });
}

function isoToSeoulInput(value) {
  const date = new Date(value);
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
  const parts = Object.fromEntries(formatter.formatToParts(date).map((part) => [part.type, part.value]));
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
}

function localDateString(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
