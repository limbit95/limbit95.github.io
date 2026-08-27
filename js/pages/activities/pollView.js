import { canManageCategory } from "../../auth.js";
import {
  cancelDatePoll,
  closeDatePoll,
  createDatePoll,
  listDatePolls,
  replaceDatePollVotes,
} from "../../api/polls.js";
import { confirmDialog } from "../../components/modal.js";
import { showToast } from "../../components/toast.js";
import { POLL_STATUS_LABEL } from "../../constants.js";
import {
  el,
  emptyState,
  formatDateTime,
  getErrorMessage,
  setBusy,
} from "../../ui.js";

export async function renderPollView(categories, selectedCategory, auth) {
  const wrapper = el("div", { className: "page-stack" });
  const availableForCreate = auth.isAdmin
    ? categories
    : categories.filter((category) => auth.managerCategoryIds.has(Number(category.id)));
  if (availableForCreate.length) wrapper.append(createPollForm(availableForCreate, auth));
  const polls = await listDatePolls({ categoryId: selectedCategory || null });
  if (!polls.length) {
    wrapper.append(emptyState("진행 중인 날짜 투표가 없어요", "담당자가 새 모임 날짜를 제안하면 여기에서 투표할 수 있어요."));
    return wrapper;
  }
  const list = el("section", { className: "poll-list", "aria-label": "날짜 투표 목록" });
  const refresh = async () => {
    const next = await renderPollView(categories, selectedCategory, auth);
    wrapper.replaceWith(next);
  };
  polls.forEach((poll) => list.append(createPollCard(poll, auth, refresh)));
  wrapper.append(list);
  return wrapper;
}

function createPollForm(categories, auth) {
  const details = el("details", { className: "card" });
  const summary = el("summary", { className: "section-title", text: "＋ 새 날짜 투표 만들기" });
  const form = el("form", { className: "form-grid", style: { marginTop: "1rem" } });
  const category = el("select", { name: "category_id", required: true }, categories.map((item) => el("option", { value: item.id, text: `${item.icon} ${item.name}` })));
  const optionsBox = el("div", { className: "form-grid", dataset: { pollOptions: "true" } });
  const addOption = () => {
    const index = optionsBox.children.length + 1;
    optionsBox.append(el("div", { className: "card card--flat form-grid form-grid--2" }, [
      el("div", { className: "field" }, [
        el("label", { text: `후보 ${index} 시작` }),
        el("input", { type: "datetime-local", name: "option_start", required: true }),
      ]),
      el("div", { className: "field" }, [
        el("label", { text: "후보 이름" }),
        el("input", { type: "text", name: "option_label", maxlength: "100", placeholder: "예: 토요일 오전" }),
      ]),
    ]));
  };
  addOption();
  addOption();
  form.append(
    el("div", { className: "form-grid form-grid--2" }, [
      labeled("카테고리", category),
      labeled("투표 마감", el("input", { type: "datetime-local", name: "closes_at", required: true })),
      labeled("제목", el("input", { type: "text", name: "title", maxlength: "150", required: true }), "field field--full"),
      labeled("설명", el("textarea", { name: "description", maxlength: "3000" }), "field field--full"),
    ]),
    el("label", { className: "checkbox" }, [
      el("input", { type: "checkbox", name: "allow_multiple", checked: true }),
      el("span", { text: "여러 후보 선택 허용" }),
    ]),
    el("h3", { className: "section-title", text: "날짜 후보" }),
    optionsBox,
    el("div", { className: "button-row" }, [
      el("button", {
        className: "button button--secondary",
        type: "button",
        text: "＋ 후보 추가",
        onClick: () => {
          if (optionsBox.children.length < 8) addOption();
          else showToast("날짜 후보는 최대 8개까지 등록할 수 있습니다.", "error");
        },
      }),
      el("button", { className: "button", type: "submit", text: "투표 등록" }),
    ]),
  );
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const starts = [...form.querySelectorAll('[name="option_start"]')].map((input) => input.value);
    const labels = [...form.querySelectorAll('[name="option_label"]')].map((input) => input.value.trim());
    if (starts.some((value) => !value) || new Set(starts).size !== starts.length) {
      showToast("서로 다른 날짜 후보를 2개 이상 입력해 주세요.", "error");
      return;
    }
    if (!canManageCategory(category.value)) {
      showToast("이 카테고리의 투표를 등록할 권한이 없습니다.", "error");
      return;
    }
    setBusy(form, true, "등록 중…");
    try {
      await createDatePoll({
        category_id: Number(category.value),
        title: form.title.value.trim(),
        description: form.description.value.trim(),
        allow_multiple: form.allow_multiple.checked,
        closes_at: seoulInputToIso(form.closes_at.value),
        status: "open",
        created_by: auth.user.id,
      }, starts.map((start, index) => ({
        option_start: seoulInputToIso(start),
        option_end: null,
        label: labels[index] || null,
      })));
      showToast("날짜 투표를 등록했습니다.", "success");
      window.location.reload();
    } catch (error) {
      showToast(getErrorMessage(error), "error");
    } finally {
      setBusy(form, false);
    }
  });
  details.append(summary, form);
  return details;
}

function createPollCard(poll, auth, refresh) {
  const card = el("article", { className: "card page-stack" });
  const manageable = canManageCategory(poll.category_id);
  const selectedByMe = new Set((poll.options ?? [])
    .filter((option) => (option.votes ?? []).some((vote) => vote.user_id === auth.user.id))
    .map((option) => Number(option.id)));
  const totalVoters = new Set((poll.options ?? []).flatMap((option) => (option.votes ?? []).map((vote) => vote.user_id))).size;
  const optionList = el("div", { className: "form-grid" });
  const inputName = `poll-${poll.id}`;
  (poll.options ?? []).forEach((option) => {
    const votes = option.votes?.length ?? 0;
    const percent = totalVoters ? Math.round((votes / totalVoters) * 100) : 0;
    optionList.append(el("label", { className: "poll-option" }, [
      el("span", { className: poll.allow_multiple ? "checkbox" : "radio" }, [
        el("input", {
          type: poll.allow_multiple ? "checkbox" : "radio",
          name: inputName,
          value: option.id,
          checked: selectedByMe.has(Number(option.id)),
          disabled: poll.status !== "open" || new Date(poll.closes_at) < new Date(),
        }),
        el("span", {}, [
          el("strong", { text: option.label || formatDateTime(option.option_start) }),
          option.label ? el("span", { className: "small subtle", text: formatDateTime(option.option_start), style: { display: "block" } }) : null,
        ]),
      ]),
      el("div", { className: "poll-bar", "aria-hidden": "true" }, el("span", { style: { "--vote-value": `${percent}%` } })),
      el("span", { className: "small subtle", text: `${votes}표 · 참여자 기준 ${percent}%` }),
    ]));
  });
  const actions = el("div", { className: "button-row" });
  if (poll.status === "open" && new Date(poll.closes_at) >= new Date()) {
    actions.append(el("button", {
      className: "button button--yellow",
      type: "button",
      text: "투표 저장",
      onClick: async (event) => {
        const chosen = [...card.querySelectorAll(`input[name="${inputName}"]:checked`)].map((input) => Number(input.value));
        if (!chosen.length) {
          showToast("한 개 이상의 날짜 후보를 선택해 주세요.", "error");
          return;
        }
        setBusy(event.currentTarget, true, "저장 중…");
        try {
          await replaceDatePollVotes(poll, auth.user.id, chosen);
          showToast("투표를 저장했습니다.", "success");
          await refresh();
        } catch (error) {
          showToast(getErrorMessage(error), "error");
          setBusy(event.currentTarget, false);
        }
      },
    }));
  }
  if (manageable && poll.status === "open") {
    actions.append(
      el("button", {
        className: "button button--secondary",
        type: "button",
        text: "투표 마감",
        onClick: async () => {
          const selected = [...poll.options].sort((a, b) => (b.votes?.length ?? 0) - (a.votes?.length ?? 0))[0];
          if (!selected) return;
          const confirmed = await confirmDialog({
            title: "투표를 마감할까요?",
            message: `현재 최다 득표 후보인 "${selected.label || formatDateTime(selected.option_start)}"을 선택 결과로 저장합니다.`,
            confirmText: "마감",
          });
          if (!confirmed) return;
          try {
            await closeDatePoll(poll.id, selected.id);
            showToast("투표를 마감했습니다.", "success");
            await refresh();
          } catch (error) {
            showToast(getErrorMessage(error), "error");
          }
        },
      }),
      el("button", {
        className: "button button--ghost",
        type: "button",
        text: "투표 취소",
        onClick: async () => {
          const confirmed = await confirmDialog({
            title: "날짜 투표를 취소할까요?",
            message: "취소된 투표에는 더 이상 참여할 수 없습니다.",
            confirmText: "투표 취소",
            danger: true,
          });
          if (!confirmed) return;
          try {
            await cancelDatePoll(poll.id);
            showToast("투표를 취소했습니다.", "success");
            await refresh();
          } catch (error) {
            showToast(getErrorMessage(error), "error");
          }
        },
      }),
    );
  }
  card.append(
    el("div", { className: "page-header" }, [
      el("div", {}, [
        el("p", { className: "eyebrow", text: `${poll.category?.icon ?? "🗳️"} ${poll.category?.name ?? "날짜 투표"}` }),
        el("h2", { className: "section-title", text: poll.title }),
      ]),
      el("span", {
        className: `status-badge ${poll.status === "open" ? "" : "status-badge--muted"}`,
        text: `${poll.status === "open" ? "●" : "■"} ${POLL_STATUS_LABEL[poll.status] ?? poll.status}`,
      }),
    ]),
    poll.description ? el("p", { className: "prose", text: poll.description }) : null,
    el("p", { className: "small subtle", text: `마감 ${formatDateTime(poll.closes_at)} · 참여 ${totalVoters}명` }),
    optionList,
    actions,
  );
  return card;
}

function labeled(label, input, className = "field") {
  const id = `field-${crypto.randomUUID()}`;
  input.id = id;
  return el("div", { className }, [
    el("label", { for: id, text: label }),
    input,
  ]);
}

function seoulInputToIso(value) {
  if (!value) return null;
  return new Date(`${value}:00+09:00`).toISOString();
}
