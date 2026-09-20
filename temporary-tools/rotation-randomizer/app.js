import { buildRotationPlan, formatPlanDate, normalizePeople } from "./rotation.js";

const startDateInput = document.querySelector("#start-date");
const endDateInput = document.querySelector("#end-date");
const personForm = document.querySelector("#person-form");
const personNameInput = document.querySelector("#person-name");
const peopleCount = document.querySelector("#people-count");
const peopleList = document.querySelector("#people-list");
const peopleEmpty = document.querySelector("#people-empty");
const clearPeopleButton = document.querySelector("#clear-people");
const generateButton = document.querySelector("#generate-button");
const regenerateButton = document.querySelector("#regenerate-button");
const formMessage = document.querySelector("#form-message");
const resultSection = document.querySelector("#result-section");
const resultSummary = document.querySelector("#result-summary");
const resultBody = document.querySelector("#result-body");
const countSummary = document.querySelector("#count-summary");

let people = [];

setDefaultPeriod();
renderPeople();

personForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const candidates = personNameInput.value.split(",").map((value) => value.trim()).filter(Boolean);
  if (!candidates.length) {
    showMessage("추가할 이름을 입력해 주세요.");
    personNameInput.focus();
    return;
  }

  const beforeCount = people.length;
  people = normalizePeople([...people, ...candidates]);
  const addedCount = people.length - beforeCount;
  personNameInput.value = "";
  renderPeople();

  if (!addedCount) {
    showMessage("이미 등록된 이름입니다.");
  } else {
    showMessage("");
    personNameInput.focus();
  }
});

clearPeopleButton.addEventListener("click", () => {
  people = [];
  renderPeople();
  clearResult();
  personNameInput.focus();
});

generateButton.addEventListener("click", generate);
regenerateButton.addEventListener("click", generate);

function generate() {
  try {
    const plan = buildRotationPlan({
      startDate: startDateInput.value,
      endDate: endDateInput.value,
      people,
    });
    showMessage("");
    renderPlan(plan);
  } catch (error) {
    clearResult();
    showMessage(error instanceof Error ? error.message : "로테이션을 생성하지 못했습니다.");
  }
}

function renderPeople() {
  peopleCount.textContent = String(people.length);
  peopleList.replaceChildren();
  peopleEmpty.hidden = people.length > 0;
  clearPeopleButton.hidden = people.length === 0;

  people.forEach((person) => {
    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.setAttribute("aria-label", `${person} 삭제`);
    removeButton.textContent = "×";
    removeButton.addEventListener("click", () => {
      people = people.filter((name) => name !== person);
      renderPeople();
      clearResult();
    });

    const chip = document.createElement("li");
    chip.className = "person-chip";
    const name = document.createElement("span");
    name.textContent = person;
    chip.append(name, removeButton);
    peopleList.append(chip);
  });
}

function renderPlan(plan) {
  resultBody.replaceChildren();
  countSummary.replaceChildren();

  plan.assignments.forEach(({ date, person }) => {
    const row = document.createElement("tr");
    const dateCell = document.createElement("td");
    const personCell = document.createElement("td");
    dateCell.textContent = formatPlanDate(date);
    personCell.textContent = person;
    row.append(dateCell, personCell);
    resultBody.append(row);
  });

  Object.entries(plan.counts).forEach(([person, count]) => {
    const badge = document.createElement("span");
    badge.className = "count-badge";
    badge.textContent = `${person} · ${count}회`;
    countSummary.append(badge);
  });

  resultSummary.textContent = `${plan.dayCount}일 동안 ${plan.peopleCount}명을 가능한 한 균등하게 배정했습니다.`;
  resultSection.hidden = false;
  resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

function clearResult() {
  resultSection.hidden = true;
  resultBody.replaceChildren();
  countSummary.replaceChildren();
}

function showMessage(message) {
  formMessage.textContent = message;
}

function setDefaultPeriod() {
  const today = new Date();
  const end = new Date(today);
  end.setDate(end.getDate() + 6);
  startDateInput.value = toLocalDateInputValue(today);
  endDateInput.value = toLocalDateInputValue(end);
}

function toLocalDateInputValue(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}
