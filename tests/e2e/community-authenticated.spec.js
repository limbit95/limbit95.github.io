import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";
import path from "node:path";

const localSupabaseUrl = process.env.E2E_LOCAL_SUPABASE_URL;
const localSupabaseAnonKey = process.env.E2E_LOCAL_SUPABASE_ANON_KEY;
const localSupabaseServiceRoleKey = process.env.E2E_LOCAL_SUPABASE_SERVICE_ROLE_KEY;
const memberEmail = process.env.E2E_MEMBER_EMAIL;
const memberPassword = process.env.E2E_MEMBER_PASSWORD;
const memberUserId = process.env.E2E_MEMBER_USER_ID;
const adminEmail = process.env.E2E_ADMIN_EMAIL;
const adminPassword = process.env.E2E_ADMIN_PASSWORD;
const adminUserId = process.env.E2E_ADMIN_USER_ID;
const activityId = process.env.E2E_ACTIVITY_ID;
const authenticatedEnvironmentReady = Boolean(
  localSupabaseUrl
  && localSupabaseAnonKey
  && memberEmail
  && memberPassword
  && adminEmail
  && adminPassword,
);
const writeEnvironmentReady = Boolean(
  authenticatedEnvironmentReady
  && localSupabaseServiceRoleKey
  && memberUserId
  && adminUserId
  && activityId,
);

const configPath = path.resolve("js", "config.js");
let localConfigSource = null;
const configuredPages = new WeakSet();

async function buildLocalConfigSource() {
  const source = await readFile(configPath, "utf8");
  return source
    .replace(
      /export const SUPABASE_URL = [^;]+;/,
      `export const SUPABASE_URL = ${JSON.stringify(localSupabaseUrl)};`,
    )
    .replace(
      /export const SUPABASE_PUBLISHABLE_KEY = [^;]+;/,
      `export const SUPABASE_PUBLISHABLE_KEY = ${JSON.stringify(localSupabaseAnonKey)};`,
    );
}

async function useLocalSupabase(page) {
  if (configuredPages.has(page)) return;
  localConfigSource ??= await buildLocalConfigSource();
  await page.route(/https?:\/\/[^/]+\/js\/config\.js(?:\?.*)?$/, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/javascript; charset=utf-8",
      body: localConfigSource,
    });
  });
  configuredPages.add(page);
}

async function login(page, email, password) {
  await useLocalSupabase(page);
  await page.goto("/#/login");
  await expect(page.locator("#login-email")).toBeVisible();
  await page.locator("#login-email").fill(email);
  await page.locator("#login-password").fill(password);
  await page.getByRole("button", { name: "이메일로 로그인" }).click();
  await expect(page).toHaveURL(/#\/$/);
  await assertHealthyPage(page, "홈");
}

async function logout(page) {
  await page.getByRole("button", { name: "로그아웃", exact: true }).click();
  const dialog = page.getByRole("alertdialog");
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "로그아웃", exact: true }).click();
  await expect(page).toHaveURL(/#\/login$/);
}

async function assertHealthyPage(page, expectedTitle) {
  await expect(page).toHaveTitle(`${expectedTitle} | 청파 같이`);
  await expect(page.locator("#main-content")).toBeVisible();
  await expect(page.locator(".app-initial-loading")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "화면을 불러오지 못했어요" })).toHaveCount(0);
  await expect(page.getByText("앱을 불러오지 못했어요", { exact: true })).toHaveCount(0);
}

function collectPageErrors(page) {
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error));
  return pageErrors;
}

function collectJavaScriptRequests(page) {
  const requests = new Set();
  page.on("request", (request) => {
    try {
      const pathname = new URL(request.url()).pathname;
      if (pathname.includes("/js/") || pathname.includes("/assets/build/")) requests.add(pathname);
    } catch {
      // Ignore non-standard URLs emitted by the browser.
    }
  });
  return requests;
}

function expectNoPageErrors(pageErrors) {
  expect(
    pageErrors,
    pageErrors.map((error) => error.stack ?? error.message).join("\n\n"),
  ).toEqual([]);
}

function projectToken(testInfo) {
  return `${testInfo.project.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-${Date.now()}`;
}

async function serviceRoleRequest(pathname, options = {}) {
  if (!localSupabaseUrl || !localSupabaseServiceRoleKey) {
    throw new Error("Local Supabase service-role environment is required for E2E fixture helpers.");
  }
  const response = await fetch(`${localSupabaseUrl}${pathname}`, {
    ...options,
    headers: {
      apikey: localSupabaseServiceRoleKey,
      Authorization: `Bearer ${localSupabaseServiceRoleKey}`,
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`${options.method ?? "GET"} ${pathname} failed (${response.status}): ${text}`);
  }
  return text ? JSON.parse(text) : null;
}

async function createFixturePost(authorId, token) {
  const rows = await serviceRoleRequest("/rest/v1/posts?select=id,title", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      board_type: "free",
      title: `E2E DM 대상 ${token}`,
      content: "쪽지 E2E를 위해 생성한 격리 게시글입니다.",
      author_id: authorId,
      status: "published",
    }),
  });
  const id = Number(rows?.[0]?.id);
  if (!Number.isFinite(id)) throw new Error("DM target post fixture was not created.");
  return id;
}

async function createUnreadNotification(token) {
  const rows = await serviceRoleRequest("/rest/v1/notifications?select=id,title", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      user_id: memberUserId,
      notification_type: "event_updated",
      kind: "event_updated",
      title: `E2E 알림 ${token}`,
      body: "읽음 처리 검증 알림",
      event_id: Number(activityId),
      target_path: `#/activities/${activityId}`,
      is_read: false,
      read_at: null,
      dedupe_key: `e2e-notification:${token}`,
    }),
  });
  const id = Number(rows?.[0]?.id);
  if (!Number.isFinite(id)) throw new Error("Unread notification fixture was not created.");
  return id;
}

async function createPendingMember(token) {
  const email = `pending-${token}@example.com`;
  const realName = `E2E 승인대기 ${token}`;
  const user = await serviceRoleRequest("/auth/v1/admin/users", {
    method: "POST",
    body: JSON.stringify({
      email,
      password: "Cheongpa-Pending-E2E-2026!",
      email_confirm: true,
      user_metadata: {
        display_name: realName,
        real_name: realName,
        birth_year: "1995",
        age_visibility: "private",
        church_group: "E2E",
        request_message: "관리자 승인/정지/복구 자동화 검증",
        privacy_policy_version: "2026-08",
        privacy_consent: true,
      },
    }),
  });
  if (!user?.id) throw new Error("Pending Auth user fixture was not created.");
  return { id: user.id, email, realName };
}

test.describe("approved member flow", () => {
  test.skip(!authenticatedEnvironmentReady, "Authenticated E2E requires the isolated local Supabase environment.");

  test("loads hashed startup bundles and keeps route chunks lazy", async ({ page }) => {
    const pageErrors = collectPageErrors(page);
    const jsRequests = collectJavaScriptRequests(page);
    await login(page, memberEmail, memberPassword);

    const startupBuildRequests = [...jsRequests].filter((pathname) => pathname.startsWith("/assets/build/"));
    expect(
      startupBuildRequests.some((pathname) => /^\/assets\/build\/app-[A-Za-z0-9]+\.js$/.test(pathname)),
      "startup should load the content-hashed app entry",
    ).toBe(true);
    expect(
      [...jsRequests].some((pathname) => pathname.startsWith("/js/pages/") || pathname.startsWith("/js/api/")),
      "bundled production pages should not request raw route/API modules",
    ).toBe(false);

    const startupChunkCount = startupBuildRequests.length;
    await page.goto("/#/mypage");
    await assertHealthyPage(page, "마이페이지");
    const afterMyPageBuildRequests = [...jsRequests].filter((pathname) => pathname.startsWith("/assets/build/"));
    expect(
      afterMyPageBuildRequests.length,
      "navigating to a lazy route should fetch at least one additional hashed chunk",
    ).toBeGreaterThan(startupChunkCount);

    expectNoPageErrors(pageErrors);
  });

  test("logs in and opens core community routes", async ({ page }) => {
    const pageErrors = collectPageErrors(page);
    await login(page, memberEmail, memberPassword);

    const routes = [
      ["activities", "활동"],
      ["prayer", "기도 제목"],
      ["notice", "공지사항"],
      ["mypage", "마이페이지"],
    ];

    for (const [route, title] of routes) {
      await page.goto(`/#/${route}`);
      await assertHealthyPage(page, title);
    }

    expectNoPageErrors(pageErrors);
  });

  test("joins and cancels an activity through the real participation RPC", async ({ page }) => {
    test.skip(!writeEnvironmentReady, "Write-path E2E requires isolated community fixtures.");
    const pageErrors = collectPageErrors(page);
    await login(page, memberEmail, memberPassword);

    await page.goto(`/#/activities/${activityId}`);
    await assertHealthyPage(page, "활동 상세");
    await expect(page.getByRole("heading", { name: "E2E 참여 테스트 활동", exact: true })).toBeVisible();

    await page.getByRole("button", { name: "🙌 참여 신청하기" }).click();
    const joinDialog = page.getByRole("alertdialog");
    await expect(joinDialog).toBeVisible();
    await joinDialog.getByRole("button", { name: "참여 신청", exact: true }).click();
    await expect(page.getByRole("button", { name: "참여 취소", exact: true })).toBeVisible();

    await page.getByRole("button", { name: "참여 취소", exact: true }).click();
    const cancelDialog = page.getByRole("alertdialog");
    await expect(cancelDialog).toBeVisible();
    await cancelDialog.getByRole("button", { name: "참여 취소", exact: true }).click();
    await expect(page.getByRole("button", { name: "🙌 참여 신청하기" })).toBeVisible();

    expectNoPageErrors(pageErrors);
  });

  test("creates, edits, comments on, and deletes a prayer post through the UI", async ({ page }, testInfo) => {
    test.skip(!writeEnvironmentReady, "Write-path E2E requires isolated community fixtures.");
    const pageErrors = collectPageErrors(page);
    const token = projectToken(testInfo);
    const initialTitle = `E2E 기도제목 ${token}`;
    const editedTitle = `E2E 기도제목 수정 ${token}`;
    const commentText = `E2E 응원 ${token}`;
    const editedCommentText = `E2E 응원 수정 ${token}`;

    await login(page, memberEmail, memberPassword);
    await page.goto("/#/prayer/new");
    await assertHealthyPage(page, "기도 제목 나누기");
    await page.locator("#post-title").fill(initialTitle);
    await page.locator("#post-content").fill("쓰기 경로 E2E에서 생성한 기도 제목입니다.");
    await page.getByRole("button", { name: "기도 제목 등록", exact: true }).click();
    await expect(page).toHaveURL(/#\/prayer\/\d+$/);
    await assertHealthyPage(page, "기도 제목 상세");
    await expect(page.getByRole("heading", { name: initialTitle, exact: true })).toBeVisible();

    const postId = new URL(page.url()).hash.match(/^#\/prayer\/(\d+)$/)?.[1];
    expect(postId).toBeTruthy();

    await page.getByRole("link", { name: "수정", exact: true }).click();
    await assertHealthyPage(page, "기도 제목 수정");
    await page.locator("#post-title").fill(editedTitle);
    await page.locator("#post-content").fill("수정된 기도 제목 내용입니다.");
    await page.getByRole("button", { name: "변경사항 저장", exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`#\\/prayer\\/${postId}$`));
    await expect(page.getByRole("heading", { name: editedTitle, exact: true })).toBeVisible();

    const comments = page.locator(".prayer-comment-section");
    await comments.getByRole("textbox", { name: "응원 메시지" }).fill(commentText);
    await comments.getByRole("button", { name: "등록", exact: true }).click();
    let comment = comments.locator("article.prayer-comment").filter({ hasText: commentText });
    await expect(comment).toBeVisible();

    await comment.getByRole("button", { name: "수정", exact: true }).click();
    await comment.locator("textarea[name='content']").fill(editedCommentText);
    await comment.getByRole("button", { name: "수정 완료", exact: true }).click();
    comment = comments.locator("article.prayer-comment").filter({ hasText: editedCommentText });
    await expect(comment).toBeVisible();

    await comment.getByRole("button", { name: "삭제", exact: true }).click();
    const commentDeleteDialog = page.getByRole("alertdialog");
    await commentDeleteDialog.getByRole("button", { name: "삭제", exact: true }).click();
    await expect(comments.getByText(editedCommentText, { exact: true })).toHaveCount(0);

    await page.locator("article.post-detail").getByRole("button", { name: "삭제", exact: true }).click();
    const postDeleteDialog = page.getByRole("alertdialog");
    await postDeleteDialog.getByRole("button", { name: "삭제", exact: true }).click();
    await expect(page).toHaveURL(/#\/prayer$/);
    await assertHealthyPage(page, "기도 제목");

    const deletedRows = await serviceRoleRequest(`/rest/v1/posts?id=eq.${postId}&select=id`);
    expect(deletedRows).toEqual([]);
    expectNoPageErrors(pageErrors);
  });

  test("updates profile fields and atomically replaces interests", async ({ page }) => {
    test.skip(!writeEnvironmentReady, "Write-path E2E requires isolated community fixtures.");
    const pageErrors = collectPageErrors(page);
    await login(page, memberEmail, memberPassword);

    await page.goto("/#/mypage/edit");
    await assertHealthyPage(page, "프로필 수정");
    await page.locator("#profile-display_name").fill("E2E 회원 수정");
    await page.locator("#profile-bio").fill("프로필 쓰기 E2E 검증");
    const interests = page.locator('input[name="interests"]');
    expect(await interests.count()).toBeGreaterThanOrEqual(2);
    for (let index = 0; index < await interests.count(); index += 1) {
      await interests.nth(index).uncheck();
    }
    await interests.nth(0).check();
    await interests.nth(1).check();
    await page.getByRole("button", { name: "프로필 저장", exact: true }).click();
    await expect(page).toHaveURL(/#\/mypage$/);
    await assertHealthyPage(page, "마이페이지");
    await expect(page.getByRole("heading", { name: "E2E 회원 수정", exact: true })).toBeVisible();

    const profileRows = await serviceRoleRequest(`/rest/v1/profiles?id=eq.${encodeURIComponent(memberUserId)}&select=display_name,bio`);
    expect(profileRows?.[0]?.display_name).toBe("E2E 회원 수정");
    const selectedRows = await serviceRoleRequest(`/rest/v1/profile_interests?user_id=eq.${encodeURIComponent(memberUserId)}&select=category_id`);
    expect(selectedRows).toHaveLength(2);

    await page.goto("/#/mypage/edit");
    await assertHealthyPage(page, "프로필 수정");
    await page.locator("#profile-display_name").fill("E2E 회원");
    await page.locator("#profile-bio").fill("");
    const restoreInterests = page.locator('input[name="interests"]');
    for (let index = 0; index < await restoreInterests.count(); index += 1) {
      await restoreInterests.nth(index).uncheck();
    }
    await page.getByRole("button", { name: "프로필 저장", exact: true }).click();
    await expect(page).toHaveURL(/#\/mypage$/);
    const restoredRows = await serviceRoleRequest(`/rest/v1/profile_interests?user_id=eq.${encodeURIComponent(memberUserId)}&select=category_id`);
    expect(restoredRows).toHaveLength(0);

    expectNoPageErrors(pageErrors);
  });

  test("marks an individual notification read through the header panel", async ({ page }, testInfo) => {
    test.skip(!writeEnvironmentReady, "Write-path E2E requires isolated community fixtures.");
    const pageErrors = collectPageErrors(page);
    const token = projectToken(testInfo);
    const notificationId = await createUnreadNotification(token);
    const title = `E2E 알림 ${token}`;

    await login(page, memberEmail, memberPassword);
    await page.getByRole("button", { name: "알림 열기" }).click();
    const item = page.locator("button.notification-item").filter({ hasText: title });
    await expect(item).toBeVisible();
    await item.click();
    await expect(page).toHaveURL(new RegExp(`#\\/activities\\/${activityId}$`));
    await assertHealthyPage(page, "활동 상세");

    const rows = await serviceRoleRequest(`/rest/v1/notifications?id=eq.${notificationId}&select=is_read,read_at`);
    expect(rows?.[0]?.is_read).toBe(true);
    expect(rows?.[0]?.read_at).toBeTruthy();
    expectNoPageErrors(pageErrors);
  });

  test("sends and reads a direct message through member profile and notification UI", async ({ page }, testInfo) => {
    test.skip(!writeEnvironmentReady, "Write-path E2E requires isolated community fixtures.");
    const pageErrors = collectPageErrors(page);
    const token = projectToken(testInfo);
    const message = `E2E-DM-${token}`;
    const postId = await createFixturePost(adminUserId, token);

    await login(page, memberEmail, memberPassword);
    await page.goto(`/#/prayer/${postId}`);
    await assertHealthyPage(page, "기도 제목 상세");
    await page.getByRole("button", { name: "E2E 관리자 프로필 메뉴 열기" }).click();
    await page.getByRole("button", { name: "✉️ 쪽지 보내기", exact: true }).click();
    const composer = page.getByRole("dialog");
    await expect(composer.getByRole("heading", { name: "쪽지 보내기", exact: true })).toBeVisible();
    await composer.getByRole("textbox", { name: "E2E 관리자님에게 보낼 쪽지 내용" }).fill(message);
    await composer.getByRole("button", { name: "쪽지 보내기", exact: true }).click();
    await expect(composer).toBeHidden();

    await logout(page);
    await login(page, adminEmail, adminPassword);
    await page.getByRole("button", { name: "알림 열기" }).click();
    const messageNotification = page.locator("button.notification-item").filter({ hasText: message });
    await expect(messageNotification).toBeVisible();
    await messageNotification.click();
    const reader = page.getByRole("dialog");
    await expect(reader.getByText(message, { exact: true })).toBeVisible();
    await reader.getByRole("button", { name: "닫기", exact: true }).click();

    const messages = await serviceRoleRequest(`/rest/v1/direct_messages?content=eq.${encodeURIComponent(message)}&select=id,read_at,recipient_id`);
    expect(messages).toHaveLength(1);
    expect(messages[0].recipient_id).toBe(adminUserId);
    expect(messages[0].read_at).toBeTruthy();

    await serviceRoleRequest(`/rest/v1/posts?id=eq.${postId}`, { method: "DELETE" });
    expectNoPageErrors(pageErrors);
  });

  test("enters the Liar Game lobby shell and returns to the game list", async ({ page }) => {
    const pageErrors = collectPageErrors(page);
    await login(page, memberEmail, memberPassword);

    await page.goto("/#/games");
    await assertHealthyPage(page, "게임");
    await page.getByRole("link", { name: "라이어 게임 시작" }).click();

    await expect(page).toHaveURL(/\/liar-game\/$/);
    const welcome = page.locator("#liar-welcome");
    const gameNavigation = page.getByRole("navigation", { name: "라이어 게임 이동" });
    await expect(welcome.getByRole("heading", { name: "라이어 게임", exact: true })).toBeVisible();
    await expect(welcome.getByRole("button", { name: "게임 로비 열기" })).toBeVisible();
    await expect(welcome.getByRole("link", { name: "게임 목록으로" })).toBeVisible();
    await expect(gameNavigation).toBeHidden();

    await welcome.getByRole("button", { name: "게임 로비 열기" }).click();
    await expect(welcome).toBeHidden();
    await expect(gameNavigation).toBeVisible();
    await expect(gameNavigation.getByRole("button", { name: "처음으로" })).toBeVisible();
    await expect(gameNavigation.getByRole("link", { name: "게임 목록으로" })).toBeVisible();

    await gameNavigation.getByRole("button", { name: "처음으로" }).click();
    await expect(gameNavigation).toBeHidden();
    await expect(welcome.getByRole("button", { name: "게임 로비 열기" })).toBeVisible();

    await welcome.getByRole("link", { name: "게임 목록으로" }).click();
    await expect(page).toHaveURL(/\/#\/games$/);
    await assertHealthyPage(page, "게임");

    expectNoPageErrors(pageErrors);
  });
});

test.describe("admin flow", () => {
  test.skip(!authenticatedEnvironmentReady, "Authenticated E2E requires the isolated local Supabase environment.");

  test("opens every admin route without runtime contract errors", async ({ page }) => {
    const pageErrors = collectPageErrors(page);
    await login(page, adminEmail, adminPassword);

    const routes = [
      ["admin", "관리자 대시보드"],
      ["admin/approvals", "가입 신청 관리"],
      ["admin/members", "회원 관리"],
      ["admin/managers", "활동 담당자 관리"],
      ["admin/categories", "활동 카테고리 관리"],
    ];

    for (const [route, title] of routes) {
      await page.goto(`/#/${route}`);
      await assertHealthyPage(page, title);
      await expect(page.getByRole("heading", { name: title, exact: true })).toBeVisible();
    }

    expectNoPageErrors(pageErrors);
  });

  test("approves a pending member, suspends the member, and restores access", async ({ page }, testInfo) => {
    test.skip(!writeEnvironmentReady, "Write-path E2E requires isolated community fixtures.");
    const pageErrors = collectPageErrors(page);
    const pending = await createPendingMember(projectToken(testInfo));
    await login(page, adminEmail, adminPassword);

    await page.goto("/#/admin/approvals");
    await assertHealthyPage(page, "가입 신청 관리");
    const requestCard = page.locator("article.card").filter({ hasText: pending.email });
    await expect(requestCard).toBeVisible();
    await requestCard.getByRole("button", { name: "승인", exact: true }).click();
    const approveDialog = page.getByRole("alertdialog");
    await approveDialog.getByRole("button", { name: "승인", exact: true }).click();
    await expect(page.getByText(`${pending.realName}님의 신청을 승인 처리했습니다.`, { exact: true })).toBeVisible();

    await page.goto("/#/admin/members");
    await assertHealthyPage(page, "회원 관리");
    await page.getByRole("searchbox", { name: "회원 검색" }).fill(pending.email);
    const memberRow = page.locator("tbody tr").filter({ hasText: pending.email });
    await expect(memberRow).toBeVisible();
    await expect(memberRow.getByRole("button", { name: "이용 정지", exact: true })).toBeVisible();
    await memberRow.getByRole("button", { name: "이용 정지", exact: true }).click();
    const suspendDialog = page.getByRole("alertdialog");
    await suspendDialog.getByRole("button", { name: "이용 정지", exact: true }).click();
    await expect(page.locator("tbody tr").filter({ hasText: pending.email }).getByRole("button", { name: "정지 해제", exact: true })).toBeVisible();

    const suspendedRows = await serviceRoleRequest(`/rest/v1/profiles?id=eq.${encodeURIComponent(pending.id)}&select=status`);
    expect(suspendedRows?.[0]?.status).toBe("suspended");

    const suspendedRow = page.locator("tbody tr").filter({ hasText: pending.email });
    await suspendedRow.getByRole("button", { name: "정지 해제", exact: true }).click();
    const restoreDialog = page.getByRole("alertdialog");
    await restoreDialog.getByRole("button", { name: "정지 해제", exact: true }).click();
    await expect(page.locator("tbody tr").filter({ hasText: pending.email }).getByRole("button", { name: "이용 정지", exact: true })).toBeVisible();

    const restoredRows = await serviceRoleRequest(`/rest/v1/profiles?id=eq.${encodeURIComponent(pending.id)}&select=status`);
    expect(restoredRows?.[0]?.status).toBe("approved");
    expectNoPageErrors(pageErrors);
  });
});
