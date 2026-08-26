import { appendFile } from "node:fs/promises";
import process from "node:process";

const url = process.env.E2E_LOCAL_SUPABASE_URL;
const serviceRoleKey = process.env.E2E_LOCAL_SUPABASE_SERVICE_ROLE_KEY;
const memberUserId = process.env.E2E_MEMBER_USER_ID;
const adminUserId = process.env.E2E_ADMIN_USER_ID;

if (!url || !serviceRoleKey || !memberUserId || !adminUserId) {
  throw new Error("Local Supabase credentials and E2E member/admin ids are required for fixture setup.");
}

const headers = {
  apikey: serviceRoleKey,
  Authorization: `Bearer ${serviceRoleKey}`,
  "Content-Type": "application/json",
};

async function request(path, options = {}) {
  const response = await fetch(`${url}${path}`, {
    ...options,
    headers: {
      ...headers,
      ...(options.headers ?? {}),
    },
  });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`${options.method ?? "GET"} ${path} failed (${response.status}): ${text}`);
  }
  return text ? JSON.parse(text) : null;
}

const categories = await request("/rest/v1/activity_categories?select=id&name=eq.%EB%9F%AC%EB%8B%9D&limit=1");
const categoryId = Number(categories?.[0]?.id);
if (!Number.isFinite(categoryId)) {
  throw new Error("Seeded running category was not found in isolated Supabase.");
}

const eventDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
const eventDateKey = eventDate.toISOString().slice(0, 10);
const registrationDeadline = new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString();

const events = await request("/rest/v1/events?select=id,title", {
  method: "POST",
  headers: { Prefer: "return=representation" },
  body: JSON.stringify({
    category_id: categoryId,
    title: "E2E 참여 테스트 활동",
    description: "격리된 로컬 Supabase에서 참여/취소 쓰기 흐름을 검증하는 활동입니다.",
    event_date: eventDateKey,
    start_time: "19:00:00",
    end_time: "20:00:00",
    location_name: "E2E 테스트 장소",
    capacity: 5,
    fee_text: "무료",
    difficulty: "초급",
    preparation: "",
    beginner_friendly: true,
    participant_notice: "",
    registration_deadline: registrationDeadline,
    status: "scheduled",
    created_by: adminUserId,
  }),
});

const activityId = Number(events?.[0]?.id);
if (!Number.isFinite(activityId)) {
  throw new Error("E2E activity fixture was not created.");
}

if (process.env.GITHUB_ENV) {
  await appendFile(process.env.GITHUB_ENV, `E2E_ACTIVITY_ID=${activityId}\n`, "utf8");
}

console.log(`Prepared isolated community fixtures (activity ${activityId}, member ${memberUserId}).`);
