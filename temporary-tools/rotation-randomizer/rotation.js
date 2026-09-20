const DAY_MS = 24 * 60 * 60 * 1000;
const MAX_DAYS = 366;

export function buildRotationPlan({ startDate, endDate, people, random = Math.random }) {
  const normalizedPeople = normalizePeople(people);
  if (!startDate || !endDate) throw new Error("시작일과 종료일을 모두 선택해 주세요.");
  if (!normalizedPeople.length) throw new Error("로테이션에 참여할 인원을 한 명 이상 등록해 주세요.");

  const dates = enumerateDates(startDate, endDate);
  if (dates.length > MAX_DAYS) throw new Error("기간은 최대 366일까지 설정할 수 있습니다.");

  const assignments = [];
  let previousPerson = null;

  for (let offset = 0; offset < dates.length; offset += normalizedPeople.length) {
    const order = shuffle([...normalizedPeople], random);
    if (previousPerson && order.length > 1 && order[0] === previousPerson) {
      const swapIndex = order.findIndex((person) => person !== previousPerson);
      [order[0], order[swapIndex]] = [order[swapIndex], order[0]];
    }

    const blockDates = dates.slice(offset, offset + normalizedPeople.length);
    blockDates.forEach((date, index) => {
      const person = order[index];
      assignments.push({ date, person });
      previousPerson = person;
    });
  }

  const counts = Object.fromEntries(normalizedPeople.map((person) => [person, 0]));
  assignments.forEach(({ person }) => {
    counts[person] += 1;
  });

  return {
    assignments,
    counts,
    dayCount: dates.length,
    peopleCount: normalizedPeople.length,
  };
}

export function normalizePeople(people = []) {
  const seen = new Set();
  const result = [];
  people.forEach((value) => {
    const name = String(value ?? "").trim();
    if (!name || seen.has(name)) return;
    seen.add(name);
    result.push(name);
  });
  return result;
}

export function enumerateDates(startDate, endDate) {
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  if (start > end) throw new Error("종료일은 시작일보다 빠를 수 없습니다.");

  const dates = [];
  for (let current = start; current <= end; current += DAY_MS) {
    dates.push(toDateInputValue(new Date(current)));
  }
  return dates;
}

export function formatPlanDate(dateValue) {
  const [year, month, day] = dateValue.split("-").map(Number);
  return new Intl.DateTimeFormat("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "short",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

function parseDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value));
  if (!match) throw new Error("올바른 날짜를 입력해 주세요.");
  const [, year, month, day] = match.map(Number);
  const timestamp = Date.UTC(year, month - 1, day);
  const date = new Date(timestamp);
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    throw new Error("올바른 날짜를 입력해 주세요.");
  }
  return timestamp;
}

function toDateInputValue(date) {
  return [
    date.getUTCFullYear(),
    String(date.getUTCMonth() + 1).padStart(2, "0"),
    String(date.getUTCDate()).padStart(2, "0"),
  ].join("-");
}

function shuffle(values, random) {
  for (let index = values.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [values[index], values[swapIndex]] = [values[swapIndex], values[index]];
  }
  return values;
}
