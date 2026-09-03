import { canManageCategory, getAuthState } from "../auth.js";
import {
  createEvent,
  createRecurringEvent,
  getEvent,
  listCategories,
  updateEvent,
} from "../api/activities.js";
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

const KOREAN_WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

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
    el("div", { className: "page-header activity-form-page-header" }, [
      el("div", {}, [
        el("p", { className: "eyebrow", text: editing ? "EDIT ACTIVITY" : "NEW ACTIVITY" }),
        el("h1", { className: "page-title", text: editing ? "활동 수정" : "새 활동 등록" }),
        el("p", { className: "page-description", text: "참여자가 필요한 정보를 한눈에 확인할 수 있도록 정확히 입력해 주세요." }),
      ]),
    ]),
    el("div", {
      className: "notice-box activity-form-notice",
      text: "권한은 Supabase RLS에서 다시 검사하며, 일정 변경 시 참여자에게 알림이 생성됩니다.",
    }),
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
  const form = el("form", { className: "card form-grid activity-form", novalidate: true });
  const category = el("select", { id: "event-category", name: "category_id", required: true }, categories.map((item) => el("option", {
    value: item.id,
    text: `${item.icon} ${item.name}`,
    selected: Number(item.id) === Number(event?.category_id),
  })));
  const recurring = el("input", { id: "event-recurring", name: "recurring", type: "checkbox", disabled: editing });
  const recurrenceFields = el("fieldset", {
    className: "activity-form__recurrence-fields",
    hidden: true,
  }, [
    selectControl("recurrence_frequency", "반복 주기", [["WEEKLY", "매주"], ["MONTHLY", "매월"]]),
    inputControl("recurrence_interval", "반복 간격", "number", { min: "1", max: "12", value: "1" }, "예: 2 = 격주/격월"),
    dateControl("recurrence_end_date", "반복 종료일", "", true),
  ]);
  recurring.addEventListener("change", () => {
    recurrenceFields.hidden = !recurring.checked;
    recurrenceFields.querySelector('[name="recurrence_end_date"]').required = recurring.checked;
  });

  const schedule = activityScheduleControl(
    event?.event_date ?? "",
    event?.start_time?.slice(0, 5) ?? "",
    event?.end_time?.slice(0, 5) ?? "",
  );
  const deadline = dateTimeControl(
    "registration_deadline",
    "신청 마감",
    event ? isoToSeoulInput(event.registration_deadline) : "",
    true,
  );

  form.append(
    el("section", { className: "activity-form__section" }, [
      sectionHeading("기본 정보"),
      el("div", { className: "activity-form__basic-grid" }, [
        control("카테고리", category, true),
        inputControl("title", "활동 이름", "text", {
          maxlength: "150",
          value: event?.title ?? "",
          placeholder: "활동 이름을 입력해 주세요",
        }, "", true),
      ]),
      el("div", { className: "field activity-form__description-field" }, [
        el("label", { className: "required", for: "event-description", text: "활동 소개" }),
        el("textarea", {
          className: "activity-form__textarea activity-form__textarea--description",
          id: "event-description",
          name: "description",
          maxlength: "5000",
          required: true,
          text: event?.description ?? "",
          placeholder: "활동 내용과 진행 방식을 간단히 소개해 주세요",
        }),
        errorFor("description"),
      ]),
    ]),
    el("section", { className: "activity-form__section" }, [
      sectionHeading("일정 · 장소 · 참여"),
      el("div", { className: "activity-form__cluster" }, [
        el("h3", { className: "activity-form__cluster-title", text: "일정" }),
        el("div", { className: "activity-form__schedule-row" }, [
          schedule,
          deadline,
          !editing ? el("label", { className: "checkbox activity-form__toggle activity-form__repeat-toggle" }, [
            recurring,
            el("span", {}, [
              el("strong", { text: "반복 활동" }),
              el("span", { className: "small subtle", text: " 종료일까지 개별 일정 생성" }),
            ]),
          ]) : null,
        ]),
        recurrenceFields,
      ]),
      el("div", { className: "activity-form__cluster" }, [
        el("h3", { className: "activity-form__cluster-title", text: "장소" }),
        el("div", { className: "activity-form__location-row" }, [
          inputControl("location_name", "장소", "text", {
            maxlength: "200",
            value: event?.location_name ?? "",
            placeholder: "예: 청파공원",
          }, "", true),
          inputControl("location_url", "지도 링크", "url", {
            value: event?.location_url ?? "",
            placeholder: "https://...",
          }),
        ]),
      ]),
      el("div", { className: "activity-form__cluster" }, [
        el("h3", { className: "activity-form__cluster-title", text: "참여 조건" }),
        el("div", { className: "activity-form__participation-row" }, [
          inputControl("capacity", "모집 정원", "number", { min: "1", value: event?.capacity ?? "" }, "비워 두면 제한 없음"),
          inputControl("fee_text", "참가비", "text", { maxlength: "200", value: event?.fee_text ?? "무료" }),
          inputControl("difficulty", "난이도", "text", {
            maxlength: "100",
            value: event?.difficulty ?? "",
            placeholder: "예: 쉬움",
          }),
          el("div", { className: "field activity-form__field activity-form__beginner-field" }, [
            el("span", { className: "field-label", text: "초보자 참여" }),
            el("label", { className: "checkbox activity-form__toggle activity-form__toggle--compact" }, [
              el("input", { type: "checkbox", name: "beginner_friendly", checked: event?.beginner_friendly ?? true }),
              el("span", { text: "초보자 환영" }),
            ]),
          ]),
        ]),
      ]),
      el("div", { className: "activity-form__cluster" }, [
        el("h3", { className: "activity-form__cluster-title", text: "참여 안내" }),
        el("div", { className: "activity-form__notice-grid" }, [
          el("div", { className: "field" }, [
            el("label", { for: "event-preparation", text: "준비물" }),
            el("textarea", {
              className: "activity-form__textarea",
              id: "event-preparation",
              name: "preparation",
              maxlength: "1000",
              text: event?.preparation ?? "",
              placeholder: "필요한 준비물이 있다면 적어주세요",
            }),
            errorFor("preparation"),
          ]),
          el("div", { className: "field" }, [
            el("label", { for: "event-participant_notice", text: "참여자 유의사항" }),
            el("textarea", {
              className: "activity-form__textarea",
              id: "event-participant_notice",
              name: "participant_notice",
              maxlength: "2000",
              text: event?.participant_notice ?? "",
              placeholder: "참여 전에 꼭 알아야 할 내용을 적어주세요",
            }),
            errorFor("participant_notice"),
          ]),
        ]),
      ]),
      editing ? el("div", { className: "activity-form__cluster activity-form__cluster--status" }, [
        el("h3", { className: "activity-form__cluster-title", text: "상태" }),
        selectControl("status", "활동 상태", [
          ["scheduled", "모집 중"],
          ["closed", "모집 마감"],
          ["completed", "활동 완료"],
          ["cancelled", "일정 취소"],
        ], event.status),
      ]) : null,
    ]),
    el("div", { className: "form-actions activity-form__actions" }, [
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
  if (!form.event_date.value && !form.start_time.value) {
    setFieldError(form, "event_date", "활동 날짜와 시작 시간을 선택해 주세요.");
    setFieldError(form, "start_time");
    valid = false;
  } else if (!form.event_date.value) {
    setFieldError(form, "event_date", "활동 날짜를 선택해 주세요.");
    valid = false;
  } else if (!form.start_time.value) {
    setFieldError(form, "start_time", "시작 시간을 선택해 주세요.");
    valid = false;
  }
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
    const invalid = form.querySelector('[aria-invalid="true"]');
    const pickerControl = invalid?.closest(".activity-picker-control");
    (pickerControl?.querySelector(".activity-picker-trigger") ?? invalid)?.focus();
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
  return el("div", { className: `field activity-form__field activity-form__field--${type}` }, [
    el("label", { className: required ? "required" : "", for: input.id, text: label }),
    input,
    help ? el("p", { className: "field-help", text: help }) : null,
    errorFor(name),
  ]);
}

function activityScheduleControl(dateValue, startValue, endValue) {
  const dateInput = hiddenInput("event_date", dateValue, true);
  const startInput = hiddenInput("start_time", startValue, true);
  const endInput = hiddenInput("end_time", endValue);
  const triggerId = "event-schedule-trigger";
  const valueText = el("span", {
    className: scheduleDisplayClass(dateValue, startValue),
    text: formatScheduleValue(dateValue, startValue, endValue),
  });
  const trigger = pickerTrigger(triggerId, valueText);
  const refreshDisplay = () => {
    valueText.textContent = formatScheduleValue(dateInput.value, startInput.value, endInput.value);
    valueText.className = scheduleDisplayClass(dateInput.value, startInput.value);
  };
  const picker = createCalendarPicker({
    trigger,
    getSelectedDate: () => dateInput.value,
    onSelectDate: (value) => {
      setHiddenValue(dateInput, value);
      refreshDisplay();
    },
    closeOnDateSelect: false,
    footerFactory: (close) => {
      const startSelector = timeSelector("시작 시간", startInput.value, (value) => {
        setHiddenValue(startInput, value);
        refreshDisplay();
      });
      const endSelector = timeSelector("종료 시간", endInput.value, (value) => {
        setHiddenValue(endInput, value);
        refreshDisplay();
      }, { allowEmpty: true });
      return el("div", { className: "activity-date-picker__footer" }, [
        el("div", { className: "activity-time-picker__row" }, [startSelector, endSelector]),
        el("button", {
          className: "button button--secondary activity-date-picker__done",
          type: "button",
          text: "완료",
          onclick: close,
        }),
      ]);
    },
  });

  return el("div", { className: "field activity-form__field activity-form__field--schedule" }, [
    el("label", { className: "required", for: triggerId, text: "활동 일정" }),
    el("div", { className: "activity-picker-control" }, [
      dateInput,
      startInput,
      endInput,
      trigger,
      picker,
    ]),
    errorFor("event_date"),
    errorFor("start_time"),
    errorFor("end_time"),
  ]);
}

function dateTimeControl(name, label, value = "", required = false) {
  const input = hiddenInput(name, value, required);
  const inputId = input.id;
  const triggerId = `${inputId}-trigger`;
  const [initialDate = "", initialTime = ""] = value.split("T");
  let selectedDate = initialDate;
  let selectedTime = initialTime;
  const valueText = el("span", {
    className: value ? "activity-picker-trigger__value" : "activity-picker-trigger__value activity-picker-trigger__value--placeholder",
    text: value ? formatKoreanDateTime(value) : "날짜와 시간 선택",
  });
  const trigger = pickerTrigger(triggerId, valueText);
  const sync = () => {
    const completeValue = selectedDate && selectedTime ? `${selectedDate}T${selectedTime}` : "";
    setHiddenValue(input, completeValue, { dispatch: Boolean(completeValue) });
    valueText.textContent = selectedDate
      ? `${formatKoreanDate(selectedDate)} · ${selectedTime || "시간 선택"}`
      : "날짜와 시간 선택";
    valueText.className = selectedDate
      ? "activity-picker-trigger__value"
      : "activity-picker-trigger__value activity-picker-trigger__value--placeholder";
  };
  const picker = createCalendarPicker({
    trigger,
    getSelectedDate: () => selectedDate,
    onSelectDate: (date) => {
      selectedDate = date;
      sync();
    },
    closeOnDateSelect: false,
    footerFactory: (close) => {
      const selector = timeSelector("시간", selectedTime, (time) => {
        selectedTime = time;
        sync();
      });
      return el("div", { className: "activity-date-picker__footer activity-date-picker__footer--single" }, [
        selector,
        el("button", {
          className: "button button--secondary activity-date-picker__done",
          type: "button",
          text: "완료",
          onclick: close,
        }),
      ]);
    },
  });
  return el("div", { className: "field activity-form__field activity-form__field--datetime" }, [
    el("label", { className: required ? "required" : "", for: triggerId, text: label }),
    el("div", { className: "activity-picker-control" }, [input, trigger, picker]),
    errorFor(name),
  ]);
}

function dateControl(name, label, value = "", required = false) {
  const input = hiddenInput(name, value, required);
  const triggerId = `${input.id}-trigger`;
  const valueText = el("span", {
    className: value ? "activity-picker-trigger__value" : "activity-picker-trigger__value activity-picker-trigger__value--placeholder",
    text: value ? formatKoreanDate(value) : "날짜 선택",
  });
  const trigger = pickerTrigger(triggerId, valueText);
  const picker = createCalendarPicker({
    trigger,
    getSelectedDate: () => input.value,
    onSelectDate: (selectedValue) => {
      setHiddenValue(input, selectedValue);
      valueText.textContent = formatKoreanDate(selectedValue);
      valueText.classList.remove("activity-picker-trigger__value--placeholder");
    },
  });
  return el("div", { className: "field activity-form__field activity-form__field--date" }, [
    el("label", { className: required ? "required" : "", for: triggerId, text: label }),
    el("div", { className: "activity-picker-control" }, [input, trigger, picker]),
    errorFor(name),
  ]);
}

function createCalendarPicker({
  trigger,
  getSelectedDate,
  onSelectDate,
  closeOnDateSelect = true,
  footerFactory = null,
}) {
  const picker = el("div", {
    className: "activity-date-picker",
    hidden: true,
    role: "dialog",
    "aria-label": "날짜 선택",
  });
  const title = el("strong", { className: "activity-date-picker__title" });
  const days = el("div", { className: "activity-date-picker__days" });
  const previous = el("button", {
    className: "activity-date-picker__nav",
    type: "button",
    text: "‹",
    "aria-label": "이전 달",
  });
  const next = el("button", {
    className: "activity-date-picker__nav",
    type: "button",
    text: "›",
    "aria-label": "다음 달",
  });
  picker.append(
    el("div", { className: "activity-date-picker__header" }, [previous, title, next]),
    el("div", { className: "activity-date-picker__weekdays" }, KOREAN_WEEKDAYS.map((weekday) => el("span", { text: weekday }))),
    days,
  );

  let visibleMonth = dateFromValue(getSelectedDate()) ?? startOfMonth(new Date());

  const close = () => {
    picker.hidden = true;
    trigger.setAttribute("aria-expanded", "false");
  };
  if (footerFactory) picker.append(footerFactory(close));

  const render = () => {
    title.textContent = `${visibleMonth.getFullYear()}년 ${visibleMonth.getMonth() + 1}월`;
    days.replaceChildren();
    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth();
    const firstWeekday = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const selected = getSelectedDate();
    const today = localDateString(new Date());

    for (let index = 0; index < firstWeekday; index += 1) {
      days.append(el("span", { className: "activity-date-picker__blank", "aria-hidden": "true" }));
    }
    for (let day = 1; day <= lastDate; day += 1) {
      const dateValue = localDateString(new Date(year, month, day));
      const classNames = ["activity-date-picker__day"];
      if (dateValue === selected) classNames.push("activity-date-picker__day--selected");
      if (dateValue === today) classNames.push("activity-date-picker__day--today");
      const button = el("button", {
        className: classNames.join(" "),
        type: "button",
        text: String(day),
        "aria-label": formatKoreanDate(dateValue),
        "aria-pressed": dateValue === selected ? "true" : "false",
      });
      button.addEventListener("click", () => {
        onSelectDate(dateValue);
        render();
        if (closeOnDateSelect) close();
      });
      days.append(button);
    }
  };

  const open = () => {
    const selected = dateFromValue(getSelectedDate());
    visibleMonth = selected ? startOfMonth(selected) : startOfMonth(new Date());
    picker.hidden = false;
    trigger.setAttribute("aria-expanded", "true");
    render();
  };

  trigger.addEventListener("click", () => {
    if (picker.hidden) open();
    else close();
  });
  previous.addEventListener("click", () => {
    visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1);
    render();
  });
  next.addEventListener("click", () => {
    visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1);
    render();
  });
  picker.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      close();
      trigger.focus();
    }
  });
  document.addEventListener("pointerdown", (event) => {
    if (!picker.hidden && !picker.contains(event.target) && event.target !== trigger && !trigger.contains(event.target)) {
      close();
    }
  });

  return picker;
}

function timeSelector(label, value, onChange, { allowEmpty = false } = {}) {
  const [initialHour = "", initialMinute = ""] = value ? value.split(":") : [];
  const hour = el("select", {
    className: "activity-time-picker__select",
    "aria-label": `${label} 시`,
  }, [
    el("option", { value: "", text: "시", selected: !initialHour }),
    ...Array.from({ length: 24 }, (_, index) => {
      const hourValue = String(index).padStart(2, "0");
      return el("option", {
        value: hourValue,
        text: hourValue,
        selected: hourValue === initialHour,
      });
    }),
  ]);
  const minuteOptions = minuteValues(initialMinute);
  const minute = el("select", {
    className: "activity-time-picker__select",
    "aria-label": `${label} 분`,
  }, [
    el("option", { value: "", text: "분", selected: !initialMinute }),
    ...minuteOptions.map((minuteValue) => el("option", {
      value: minuteValue,
      text: minuteValue,
      selected: minuteValue === initialMinute,
    })),
  ]);
  const emit = () => onChange(hour.value && minute.value ? `${hour.value}:${minute.value}` : "");
  hour.addEventListener("change", emit);
  minute.addEventListener("change", emit);

  return el("div", { className: "activity-time-picker" }, [
    el("span", { className: "activity-time-picker__label", text: label }),
    el("div", { className: "activity-time-picker__controls" }, [
      hour,
      el("span", { className: "activity-time-picker__colon", text: ":" }),
      minute,
      allowEmpty ? el("button", {
        className: "activity-time-picker__clear",
        type: "button",
        text: "없음",
        onclick: () => {
          hour.value = "";
          minute.value = "";
          onChange("");
        },
      }) : null,
    ]),
  ]);
}

function minuteValues(initialMinute) {
  const values = Array.from({ length: 12 }, (_, index) => String(index * 5).padStart(2, "0"));
  if (initialMinute && !values.includes(initialMinute)) values.push(initialMinute);
  return values.sort();
}

function pickerTrigger(id, valueText) {
  return el("button", {
    className: "activity-picker-trigger",
    id,
    type: "button",
    "aria-haspopup": "dialog",
    "aria-expanded": "false",
  }, [
    el("span", { className: "activity-picker-trigger__icon", "aria-hidden": "true" }),
    valueText,
    el("span", { className: "activity-picker-trigger__chevron", text: "⌄", "aria-hidden": "true" }),
  ]);
}

function hiddenInput(name, value = "", required = false) {
  return el("input", {
    className: "activity-picker-input",
    id: `event-${name}`,
    name,
    type: "hidden",
    required,
    value,
  });
}

function setHiddenValue(input, value, { dispatch = true } = {}) {
  input.value = value;
  input.setAttribute("value", value);
  if (value) input.removeAttribute("aria-invalid");
  if (!dispatch) return;
  input.dispatchEvent(new Event("input", { bubbles: true }));
  input.dispatchEvent(new Event("change", { bubbles: true }));
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
  return el("div", { className: "field activity-form__field activity-form__field--select" }, [
    el("label", { className: required ? "required" : "", for: input.id, text: label }),
    input,
    errorFor(input.name),
  ]);
}

function sectionHeading(title) {
  return el("div", { className: "activity-form__section-heading" }, [
    el("h2", { className: "activity-form__section-title", text: title }),
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

function formatScheduleValue(dateValue, startValue, endValue) {
  if (!dateValue) return "날짜와 시작 시간 선택";
  const timeText = startValue
    ? `${startValue}${endValue ? ` ~ ${endValue}` : ""}`
    : "시작 시간 선택";
  return `${formatKoreanDate(dateValue)} · ${timeText}`;
}

function scheduleDisplayClass(dateValue, startValue) {
  return dateValue && startValue
    ? "activity-picker-trigger__value"
    : "activity-picker-trigger__value activity-picker-trigger__value--placeholder";
}

function formatKoreanDateTime(value) {
  if (!value) return "날짜와 시간 선택";
  const [dateValue, timeValue] = value.split("T");
  return `${formatKoreanDate(dateValue)} · ${timeValue || "시간 선택"}`;
}

function formatKoreanDate(value) {
  const date = dateFromValue(value);
  if (!date) return "날짜 선택";
  return `${date.getFullYear()}. ${String(date.getMonth() + 1).padStart(2, "0")}. ${String(date.getDate()).padStart(2, "0")} (${KOREAN_WEEKDAYS[date.getDay()]})`;
}

function dateFromValue(value) {
  if (!value) return null;
  const dateValue = value.includes("T") ? value.split("T")[0] : value;
  const [year, month, day] = dateValue.split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function localDateString(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
