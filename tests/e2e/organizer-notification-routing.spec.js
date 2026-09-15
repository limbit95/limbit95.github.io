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
  && adminPassword
  && adminUserId,
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
        icon: "🔔",
        color: "#6B7280",
        description: "Organizer notification routing E2E fixture",
        is_active: true,
      }),
    },
  );

  expect(response.ok, JSON.stringify(body)).toBeTruthy();
  expect(body).toHaveLength(1);
  return Number(body[0].id);
}

async function listNotifications(token, eventId, type) {
  const { response, body } = await requestJson(
    `${supabaseUrl}/rest/v1/notifications?event_id=eq.${eventId}&notification_type=eq.${type}&select=id,notification_type,title,event_id,user_id&order=id.asc`,
    { headers: restHeaders(token) },
  );
  expect(response.ok, JSON.stringify(body)).toBeTruthy();
  return body ?? [];
}

test("organizer transfer responses notify the requester and later joins notify the current organizer", async () => {
  test.skip(!environmentReady, "Organizer notification routing E2E environment is not configured.");

  const [memberToken, adminToken] = await Promise.all([
    signIn(memberEmail, memberPassword),
    signIn(adminEmail, adminPassword),
  ]);
  const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const categoryId = await createCategory(adminToken, `E2E organizer routing ${suffix}`);

  const createEvent = await requestJson(
    `${supabaseUrl}/rest/v1/events?select=id,created_by,organizer_id`,
    {
      method: "POST",
      headers: restHeaders(memberToken, { Prefer: "return=representation" }),
      body: JSON.stringify({
        category_id: categoryId,
        title: `E2E organizer routing ${suffix}`,
        description: "Organizer response and participant notification routing E2E",
        event_date: "2030-03-10",
        start_time: "19:00:00",
        end_time: "20:00:00",
        location_name: "E2E location",
        capacity: 5,
        fee_text: "무료",
        difficulty: "초급",
        preparation: "",
        beginner_friendly: true,
        participant_notice: "",
        registration_deadline: "2030-03-09T20:00:00+09:00",
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
    const request = await requestJson(
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
    expect(request.response.ok, JSON.stringify(request.body)).toBeTruthy();

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

  const rejectedRequest = await requestTransfer(false);
  const reject = await requestJson(
    `${supabaseUrl}/rest/v1/rpc/respond_event_organizer_transfer`,
    {
      method: "POST",
      headers: restHeaders(adminToken),
      body: JSON.stringify({
        p_request_id: Number(rejectedRequest.id),
        p_accept: false,
      }),
    },
  );
  expect(reject.response.ok, JSON.stringify(reject.body)).toBeTruthy();
  expect(reject.body?.status).toBe("rejected");

  const rejectionNotifications = await listNotifications(
    memberToken,
    eventId,
    "event_organizer_transfer_rejected",
  );
  expect(rejectionNotifications).toContainEqual(expect.objectContaining({
    user_id: memberUserId,
    notification_type: "event_organizer_transfer_rejected",
    title: "주최자 변경 요청이 거절됐어요",
    event_id: eventId,
  }));

  const acceptedRequest = await requestTransfer(true);
  const accept = await requestJson(
    `${supabaseUrl}/rest/v1/rpc/respond_event_organizer_transfer`,
    {
      method: "POST",
      headers: restHeaders(adminToken),
      body: JSON.stringify({
        p_request_id: Number(acceptedRequest.id),
        p_accept: true,
      }),
    },
  );
  expect(accept.response.ok, JSON.stringify(accept.body)).toBeTruthy();
  expect(accept.body?.status).toBe("accepted");

  const acceptanceNotifications = await listNotifications(
    memberToken,
    eventId,
    "event_organizer_transfer_accepted",
  );
  expect(acceptanceNotifications).toContainEqual(expect.objectContaining({
    user_id: memberUserId,
    notification_type: "event_organizer_transfer_accepted",
    title: "주최자 변경 요청이 수락됐어요",
    event_id: eventId,
  }));

  const eventAfterAccept = await requestJson(
    `${supabaseUrl}/rest/v1/events?id=eq.${eventId}&select=created_by,organizer_id`,
    { headers: restHeaders(adminToken) },
  );
  expect(eventAfterAccept.response.ok, JSON.stringify(eventAfterAccept.body)).toBeTruthy();
  expect(eventAfterAccept.body).toEqual([{
    created_by: memberUserId,
    organizer_id: adminUserId,
  }]);

  const previousOrganizerParticipation = await requestJson(
    `${supabaseUrl}/rest/v1/event_participants?event_id=eq.${eventId}&user_id=eq.${memberUserId}&select=status`,
    { headers: restHeaders(memberToken) },
  );
  expect(previousOrganizerParticipation.response.ok, JSON.stringify(previousOrganizerParticipation.body)).toBeTruthy();
  expect(previousOrganizerParticipation.body).toEqual([{ status: "cancelled" }]);

  const adminNotificationsBeforeRejoin = await listNotifications(
    adminToken,
    eventId,
    "event_participant_joined",
  );
  const creatorNotificationsBeforeRejoin = await listNotifications(
    memberToken,
    eventId,
    "event_participant_joined",
  );

  const rejoinPreviousOrganizer = await requestJson(
    `${supabaseUrl}/rest/v1/rpc/join_event`,
    {
      method: "POST",
      headers: restHeaders(memberToken),
      body: JSON.stringify({ p_event_id: eventId }),
    },
  );
  expect(rejoinPreviousOrganizer.response.ok, JSON.stringify(rejoinPreviousOrganizer.body)).toBeTruthy();
  expect(rejoinPreviousOrganizer.body).toBe("joined");

  const adminNotificationsAfterRejoin = await listNotifications(
    adminToken,
    eventId,
    "event_participant_joined",
  );
  const creatorNotificationsAfterRejoin = await listNotifications(
    memberToken,
    eventId,
    "event_participant_joined",
  );

  expect(adminNotificationsAfterRejoin).toHaveLength(adminNotificationsBeforeRejoin.length + 1);
  expect(adminNotificationsAfterRejoin.at(-1)).toEqual(expect.objectContaining({
    user_id: adminUserId,
    notification_type: "event_participant_joined",
    event_id: eventId,
  }));
  expect(creatorNotificationsAfterRejoin).toHaveLength(creatorNotificationsBeforeRejoin.length);

  const redundantSelfNotification = await listNotifications(
    adminToken,
    eventId,
    "event_organizer_transferred",
  );
  expect(redundantSelfNotification).toEqual([]);
});
