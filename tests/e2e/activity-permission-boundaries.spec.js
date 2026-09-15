import { expect, test } from "@playwright/test";

const supabaseUrl = process.env.E2E_LOCAL_SUPABASE_URL;
const anonKey = process.env.E2E_LOCAL_SUPABASE_ANON_KEY;
const memberEmail = process.env.E2E_MEMBER_EMAIL;
const memberPassword = process.env.E2E_MEMBER_PASSWORD;
const memberUserId = process.env.E2E_MEMBER_USER_ID;
const adminEmail = process.env.E2E_ADMIN_EMAIL;
const adminPassword = process.env.E2E_ADMIN_PASSWORD;
const adminUserId = process.env.E2E_ADMIN_USER_ID;

const environmentReady = Boolean(
  supabaseUrl
  && anonKey
  && memberEmail
  && memberPassword
  && memberUserId
  && adminEmail
  && adminPassword,
);
const organizerTransferEnvironmentReady = Boolean(environmentReady && adminUserId);

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

test("organizer transfer request, cancellation, and acceptance preserve notification boundaries", async () => {
  test.skip(!organizerTransferEnvironmentReady, "Organizer transfer E2E environment is not configured.");

  const [memberToken, adminToken] = await Promise.all([
    signIn(memberEmail, memberPassword),
    signIn(adminEmail, adminPassword),
  ]);
  const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const categoryId = await createCategory(adminToken, `E2E organizer transfer ${suffix}`);

  const createEvent = await requestJson(
    `${supabaseUrl}/rest/v1/events?select=id,created_by,organizer_id`,
    {
      method: "POST",
      headers: restHeaders(memberToken, { Prefer: "return=representation" }),
      body: JSON.stringify({
        category_id: categoryId,
        title: `E2E organizer transfer ${suffix}`,
        description: "Organizer transfer notification lifecycle E2E",
        event_date: "2030-02-10",
        start_time: "19:00:00",
        end_time: "20:00:00",
        location_name: "E2E location",
        capacity: 5,
        fee_text: "무료",
        difficulty: "초급",
        preparation: "",
        beginner_friendly: true,
        participant_notice: "",
        registration_deadline: "2030-02-09T20:00:00+09:00",
        status: "scheduled",
        created_by: memberUserId,
      }),
    },
  );
  expect(createEvent.response.status, JSON.stringify(createEvent.body)).toBe(201);
  expect(createEvent.body).toHaveLength(1);
  const eventId = Number(createEvent.body[0].id);
  expect(createEvent.body[0].created_by).toBe(memberUserId);
  expect(createEvent.body[0].organizer_id).toBe(memberUserId);

  const joinAdmin = await requestJson(
    `${supabaseUrl}/rest/v1/rpc/join_event`,
    {
      method: "POST",
      headers: restHeaders(adminToken),
      body: JSON.stringify({ p_event_id: eventId }),
    },
  );
  expect(joinAdmin.response.ok, JSON.stringify(joinAdmin.body)).toBeTruthy();
  expect(joinAdmin.body).toBe("joined");

  const requestTransfer = async (leaveCurrent) => {
    const result = await requestJson(
      `${supabaseUrl}/rest/v1/rpc/request_event_organizer_transfer`,
      {
        method: "POST",
        headers: restHeaders(memberToken),
        body: JSON.stringify({
          p_event_id: eventId,
          p_new_organizer_id: adminUserId,
          p_leave_current: leaveCurrent,
        }),
      },
    );
    expect(result.response.ok, JSON.stringify(result.body)).toBeTruthy();

    const pending = await requestJson(
      `${supabaseUrl}/rest/v1/rpc/get_event_organizer_transfer_request`,
      {
        method: "POST",
        headers: restHeaders(memberToken),
        body: JSON.stringify({ p_event_id: eventId }),
      },
    );
    expect(pending.response.ok, JSON.stringify(pending.body)).toBeTruthy();
    expect(pending.body).toHaveLength(1);
    return pending.body[0];
  };

  const firstRequest = await requestTransfer(false);
  expect(firstRequest.from_organizer_id).toBe(memberUserId);
  expect(firstRequest.to_organizer_id).toBe(adminUserId);
  expect(firstRequest.leave_current_after_accept).toBe(false);

  const requestedNotifications = await requestJson(
    `${supabaseUrl}/rest/v1/notifications?event_id=eq.${eventId}&notification_type=eq.event_organizer_transfer_requested&select=notification_type,title,event_id`,
    { headers: restHeaders(adminToken) },
  );
  expect(requestedNotifications.response.ok, JSON.stringify(requestedNotifications.body)).toBeTruthy();
  expect(requestedNotifications.body).toContainEqual(expect.objectContaining({
    notification_type: "event_organizer_transfer_requested",
    event_id: eventId,
  }));

  const cancelRequest = await requestJson(
    `${supabaseUrl}/rest/v1/rpc/cancel_event_organizer_transfer_request`,
    {
      method: "POST",
      headers: restHeaders(memberToken),
      body: JSON.stringify({ p_request_id: Number(firstRequest.id) }),
    },
  );
  expect(cancelRequest.response.ok, JSON.stringify(cancelRequest.body)).toBeTruthy();

  const cancelledNotifications = await requestJson(
    `${supabaseUrl}/rest/v1/notifications?event_id=eq.${eventId}&notification_type=eq.event_organizer_transfer_cancelled&select=notification_type,title,event_id`,
    { headers: restHeaders(adminToken) },
  );
  expect(cancelledNotifications.response.ok, JSON.stringify(cancelledNotifications.body)).toBeTruthy();
  expect(cancelledNotifications.body).toContainEqual(expect.objectContaining({
    notification_type: "event_organizer_transfer_cancelled",
    title: "주최자 변경 요청이 취소되었어요",
    event_id: eventId,
  }));

  const secondRequest = await requestTransfer(true);
  expect(secondRequest.leave_current_after_accept).toBe(true);

  const acceptRequest = await requestJson(
    `${supabaseUrl}/rest/v1/rpc/respond_event_organizer_transfer`,
    {
      method: "POST",
      headers: restHeaders(adminToken),
      body: JSON.stringify({
        p_request_id: Number(secondRequest.id),
        p_accept: true,
      }),
    },
  );
  expect(acceptRequest.response.ok, JSON.stringify(acceptRequest.body)).toBeTruthy();

  const eventAfterAccept = await requestJson(
    `${supabaseUrl}/rest/v1/events?id=eq.${eventId}&select=created_by,organizer_id`,
    { headers: restHeaders(adminToken) },
  );
  expect(eventAfterAccept.response.ok, JSON.stringify(eventAfterAccept.body)).toBeTruthy();
  expect(eventAfterAccept.body).toEqual([{
    created_by: memberUserId,
    organizer_id: adminUserId,
  }]);

  const formerOrganizerParticipation = await requestJson(
    `${supabaseUrl}/rest/v1/event_participants?event_id=eq.${eventId}&user_id=eq.${memberUserId}&select=status`,
    { headers: restHeaders(memberToken) },
  );
  expect(formerOrganizerParticipation.response.ok, JSON.stringify(formerOrganizerParticipation.body)).toBeTruthy();
  expect(formerOrganizerParticipation.body).toEqual([{ status: "cancelled" }]);

  const redundantSelfNotification = await requestJson(
    `${supabaseUrl}/rest/v1/notifications?event_id=eq.${eventId}&notification_type=eq.event_organizer_transferred&select=id`,
    { headers: restHeaders(adminToken) },
  );
  expect(redundantSelfNotification.response.ok, JSON.stringify(redundantSelfNotification.body)).toBeTruthy();
  expect(redundantSelfNotification.body).toEqual([]);
});
