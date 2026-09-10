import { expect, test } from "@playwright/test";

const supabaseUrl = process.env.E2E_LOCAL_SUPABASE_URL;
const anonKey = process.env.E2E_LOCAL_SUPABASE_ANON_KEY;
const memberEmail = process.env.E2E_MEMBER_EMAIL;
const memberPassword = process.env.E2E_MEMBER_PASSWORD;
const memberUserId = process.env.E2E_MEMBER_USER_ID;
const adminEmail = process.env.E2E_ADMIN_EMAIL;
const adminPassword = process.env.E2E_ADMIN_PASSWORD;

const environmentReady = Boolean(
  supabaseUrl
  && anonKey
  && memberEmail
  && memberPassword
  && memberUserId
  && adminEmail
  && adminPassword,
);

async function requestJson(url, init = {}) {
  const response = await fetch(url, init);
  const text = await response.text();
  let body = null;

  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
  }

  return { response, body };
}

function restHeaders(token, extra = {}) {
  return {
    apikey: anonKey,
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

async function signIn(email, password) {
  const { response, body } = await requestJson(
    `${supabaseUrl}/auth/v1/token?grant_type=password`,
    {
      method: "POST",
      headers: {
        apikey: anonKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    },
  );

  expect(response.ok, JSON.stringify(body)).toBeTruthy();
  expect(body?.access_token).toBeTruthy();
  return body.access_token;
}

async function createCategory(adminToken, name) {
  const { response, body } = await requestJson(
    `${supabaseUrl}/rest/v1/activity_categories?select=id`,
    {
      method: "POST",
      headers: restHeaders(adminToken, { Prefer: "return=representation" }),
      body: JSON.stringify({
        name,
        icon: "🧪",
        color: "#6B7280",
        description: "Recurring activity permission E2E fixture",
        is_active: true,
      }),
    },
  );

  expect(response.ok, JSON.stringify(body)).toBeTruthy();
  expect(body).toHaveLength(1);
  return Number(body[0].id);
}

async function setCategoryManager(adminToken, categoryId, enabled) {
  const { response, body } = await requestJson(
    `${supabaseUrl}/rest/v1/rpc/admin_set_category_manager`,
    {
      method: "POST",
      headers: restHeaders(adminToken),
      body: JSON.stringify({
        p_user_id: memberUserId,
        p_category_id: categoryId,
        p_enabled: enabled,
      }),
    },
  );

  expect(response.ok, JSON.stringify(body)).toBeTruthy();
}

async function createRecurring(memberToken, categoryId, date, suffix) {
  const { response, body } = await requestJson(
    `${supabaseUrl}/rest/v1/rpc/create_recurring_event`,
    {
      method: "POST",
      headers: restHeaders(memberToken),
      body: JSON.stringify({
        p_series: {
          category_id: categoryId,
          title: `E2E recurring ${suffix}`,
          description: "Recurring activity permission boundary test",
          start_date: date,
          end_date: date,
          start_time: "19:00",
          end_time: "20:00",
          recurrence_rule: "FREQ=WEEKLY;INTERVAL=1;COUNT=1",
          location_name: "E2E location",
          fee_text: "무료",
          preparation: "",
          beginner_friendly: true,
          participant_notice: "",
        },
        p_occurrences: [
          {
            event_date: date,
            registration_deadline: `${date}T09:00:00+09:00`,
          },
        ],
      }),
    },
  );

  expect(response.ok, JSON.stringify(body)).toBeTruthy();
  expect(body?.series?.id).toBeTruthy();
  expect(body?.events).toHaveLength(1);

  return {
    seriesId: Number(body.series.id),
    eventId: Number(body.events[0].id),
    title: body.events[0].title,
  };
}

async function readEvent(memberToken, eventId) {
  const { response, body } = await requestJson(
    `${supabaseUrl}/rest/v1/events?id=eq.${eventId}&select=id,title,status,series_id,category_id`,
    { headers: restHeaders(memberToken) },
  );
  expect(response.ok, JSON.stringify(body)).toBeTruthy();
  expect(body).toHaveLength(1);
  return body[0];
}

test("recurring occurrence ownership cannot bypass manager boundaries", async () => {
  test.skip(!environmentReady, "Local Supabase E2E environment is not configured.");

  const [memberToken, adminToken] = await Promise.all([
    signIn(memberEmail, memberPassword),
    signIn(adminEmail, adminPassword),
  ]);
  const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  const categoryA = await createCategory(adminToken, `E2E recurring A ${suffix}`);
  const categoryB = await createCategory(adminToken, `E2E recurring B ${suffix}`);

  await setCategoryManager(adminToken, categoryA, true);
  await setCategoryManager(adminToken, categoryB, true);

  const recurringA = await createRecurring(memberToken, categoryA, "2030-01-10", `A ${suffix}`);
  const recurringB = await createRecurring(memberToken, categoryB, "2030-01-11", `B ${suffix}`);

  const categoryMove = await requestJson(
    `${supabaseUrl}/rest/v1/events?id=eq.${recurringA.eventId}`,
    {
      method: "PATCH",
      headers: restHeaders(memberToken, { Prefer: "return=representation" }),
      body: JSON.stringify({ category_id: categoryB }),
    },
  );
  expect(categoryMove.response.status, JSON.stringify(categoryMove.body)).toBeGreaterThanOrEqual(400);

  const seriesMove = await requestJson(
    `${supabaseUrl}/rest/v1/events?id=eq.${recurringA.eventId}`,
    {
      method: "PATCH",
      headers: restHeaders(memberToken, { Prefer: "return=representation" }),
      body: JSON.stringify({ series_id: recurringB.seriesId }),
    },
  );
  expect(seriesMove.response.status, JSON.stringify(seriesMove.body)).toBeGreaterThanOrEqual(400);

  const seriesCategoryMove = await requestJson(
    `${supabaseUrl}/rest/v1/event_series?id=eq.${recurringA.seriesId}`,
    {
      method: "PATCH",
      headers: restHeaders(memberToken, { Prefer: "return=representation" }),
      body: JSON.stringify({ category_id: categoryB }),
    },
  );
  expect(
    seriesCategoryMove.response.status,
    JSON.stringify(seriesCategoryMove.body),
  ).toBeGreaterThanOrEqual(400);

  const mismatchedInsert = await requestJson(
    `${supabaseUrl}/rest/v1/events`,
    {
      method: "POST",
      headers: restHeaders(memberToken, { Prefer: "return=representation" }),
      body: JSON.stringify({
        series_id: recurringB.seriesId,
        category_id: categoryA,
        title: `E2E mismatched recurring ${suffix}`,
        description: "Must be rejected because series and event categories differ",
        event_date: "2030-01-20",
        start_time: "19:00",
        end_time: "20:00",
        location_name: "E2E location",
        fee_text: "무료",
        preparation: "",
        beginner_friendly: true,
        participant_notice: "",
        registration_deadline: "2030-01-20T09:00:00+09:00",
        status: "scheduled",
        created_by: memberUserId,
      }),
    },
  );
  expect(
    mismatchedInsert.response.status,
    JSON.stringify(mismatchedInsert.body),
  ).toBeGreaterThanOrEqual(400);

  await setCategoryManager(adminToken, categoryA, false);

  const formerManagerEdit = await requestJson(
    `${supabaseUrl}/rest/v1/events?id=eq.${recurringA.eventId}`,
    {
      method: "PATCH",
      headers: restHeaders(memberToken, { Prefer: "return=representation" }),
      body: JSON.stringify({ title: `Former manager edit ${suffix}` }),
    },
  );
  expect(formerManagerEdit.response.status, JSON.stringify(formerManagerEdit.body)).toBe(200);
  expect(formerManagerEdit.body).toEqual([]);

  const unchanged = await readEvent(memberToken, recurringA.eventId);
  expect(unchanged.title).toBe(recurringA.title);

  const formerManagerRemove = await requestJson(
    `${supabaseUrl}/rest/v1/rpc/remove_or_cancel_event`,
    {
      method: "POST",
      headers: restHeaders(memberToken),
      body: JSON.stringify({ p_event_id: recurringA.eventId }),
    },
  );
  expect(
    formerManagerRemove.response.status,
    JSON.stringify(formerManagerRemove.body),
  ).toBeGreaterThanOrEqual(400);

  await setCategoryManager(adminToken, categoryA, true);

  const removeRecurring = await requestJson(
    `${supabaseUrl}/rest/v1/rpc/remove_or_cancel_event`,
    {
      method: "POST",
      headers: restHeaders(memberToken),
      body: JSON.stringify({ p_event_id: recurringA.eventId }),
    },
  );
  expect(removeRecurring.response.ok, JSON.stringify(removeRecurring.body)).toBeTruthy();
  expect(removeRecurring.body?.action).toBe("cancelled");

  const cancelled = await readEvent(memberToken, recurringA.eventId);
  expect(cancelled.status).toBe("cancelled");
  expect(Number(cancelled.series_id)).toBe(recurringA.seriesId);
  expect(Number(cancelled.category_id)).toBe(categoryA);

  await setCategoryManager(adminToken, categoryA, false);
  await setCategoryManager(adminToken, categoryB, false);
});
