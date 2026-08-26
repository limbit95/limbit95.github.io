import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const errors = [];

function fail(message) {
  errors.push(message);
}

function relativeFile(filePath) {
  return path.relative(root, filePath).replaceAll(path.sep, "/");
}

function walk(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) return walk(target);
    return [target];
  });
}

function stripQueryHash(specifier) {
  return specifier.split(/[?#]/, 1)[0];
}

function sourceAt(relativePath) {
  const filePath = path.join(root, relativePath);
  if (!fs.existsSync(filePath)) {
    fail(`required file not found: ${relativePath}`);
    return "";
  }
  return fs.readFileSync(filePath, "utf8");
}

function checkRelativeImports(filePath) {
  const source = fs.readFileSync(filePath, "utf8");
  const importPattern = /(?:import|export)\s+(?:[^'";]*?\s+from\s+)?["']([^"']+)["']|import\(\s*["']([^"']+)["']\s*\)/g;
  for (const match of source.matchAll(importPattern)) {
    const specifier = match[1] ?? match[2];
    if (!specifier?.startsWith(".")) continue;
    const resolved = path.resolve(path.dirname(filePath), stripQueryHash(specifier));
    const candidates = [resolved, `${resolved}.js`, path.join(resolved, "index.js")];
    if (!candidates.some((candidate) => fs.existsSync(candidate))) {
      fail(`${relativeFile(filePath)}: import target not found: ${specifier}`);
    }
  }
}

function checkIndexAssets() {
  const indexPath = path.join(root, "index.html");
  const html = fs.readFileSync(indexPath, "utf8");
  const localAssetPattern = /(?:href|src)=["']\.\/([^"']+)["']/g;
  for (const match of html.matchAll(localAssetPattern)) {
    const asset = stripQueryHash(match[1]);
    if (/^https?:/i.test(asset)) continue;
    const target = path.join(root, asset);
    if (!fs.existsSync(target)) fail(`index.html: referenced file not found: ./${asset}`);
  }
  if (html.includes("theme.css")) {
    fail("index.html: removed theme.css is still referenced");
  }
}

function checkCssBraces() {
  for (const filePath of walk(path.join(root, "css")).filter((file) => file.endsWith(".css"))) {
    const source = fs.readFileSync(filePath, "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
    let depth = 0;
    for (const char of source) {
      if (char === "{") depth += 1;
      if (char === "}") depth -= 1;
      if (depth < 0) break;
    }
    if (depth !== 0) fail(`${relativeFile(filePath)}: unbalanced CSS braces`);
  }
}

function checkArchitectureContracts() {
  const requiredFiles = [
    "js/api/profiles.js",
    "js/api/activities.js",
    "js/api/boards.js",
    "js/api/admin.js",
    "js/api/polls.js",
    "js/api/notifications.js",
    "js/pages/activities/listView.js",
    "js/pages/activities/calendarView.js",
    "js/pages/activities/pollView.js",
    "js/pages/admin/dashboard.js",
    "js/pages/admin/approvals.js",
    "js/pages/admin/members.js",
    "js/pages/admin/managers.js",
    "js/pages/admin/categories.js",
    "supabase/site/migrations/20260826072528_community_p1_stability.sql",
    "supabase/site/migrations/20260826072758_community_p1_rpc_security_invoker.sql",
    "supabase/site/migrations/20260826073714_community_p2_admin_member_pagination.sql",
    "supabase/site/migrations/20260826084607_community_p2_participation_overview.sql",
  ];
  requiredFiles.forEach(sourceAt);

  const apiFacade = sourceAt("js/api.js");
  const expectedApiModules = ["profiles", "activities", "boards", "admin", "polls", "notifications"];
  expectedApiModules.forEach((moduleName) => {
    if (!apiFacade.includes(`./api/${moduleName}.js`)) {
      fail(`js/api.js: missing ${moduleName} domain re-export`);
    }
  });
  if (apiFacade.split(/\r?\n/).filter(Boolean).length > 20) {
    fail("js/api.js: facade grew beyond 20 non-empty lines; keep domain logic in js/api/*");
  }

  const activitiesFacade = sourceAt("js/pages/activities.js");
  if (!activitiesFacade.includes("./activities/listView.js")
    || !activitiesFacade.includes("./activities/calendarView.js")
    || !activitiesFacade.includes("./activities/pollView.js")) {
    fail("js/pages/activities.js: split activity view modules are not all wired");
  }

  const adminFacade = sourceAt("js/pages/admin.js");
  ["dashboard", "approvals", "members", "managers", "categories"].forEach((section) => {
    if (!adminFacade.includes(`./admin/${section}.js`)) {
      fail(`js/pages/admin.js: missing ${section} section module`);
    }
  });

  const activityCard = sourceAt("js/components/activityCard.js");
  if (!activityCard.includes("activity-card__title-link")) {
    fail("js/components/activityCard.js: semantic card link is missing");
  }
  if (activityCard.includes("window.location.hash = detailHref")) {
    fail("js/components/activityCard.js: whole-card navigation regressed to JS hash mutation");
  }

  const profileApi = sourceAt("js/api/profiles.js");
  if (!profileApi.includes('supabase.rpc("replace_my_profile_interests"')) {
    fail("js/api/profiles.js: profile interests must be replaced through the atomic RPC");
  }
  if (profileApi.includes('.from("profile_interests")\n    .delete()')) {
    fail("js/api/profiles.js: profile interest replacement regressed to client-side delete/insert");
  }

  const activitiesApi = sourceAt("js/api/activities.js");
  if (!activitiesApi.includes('supabase.rpc("create_recurring_event"')) {
    fail("js/api/activities.js: recurring events must be created through the atomic RPC");
  }
  if (!activitiesApi.includes('supabase.rpc("get_my_participation_overview"')
    || activitiesApi.includes("listMyParticipations")) {
    fail("js/api/activities.js: my participation history must remain bounded by the overview RPC");
  }

  const myPage = sourceAt("js/pages/mypage.js");
  if (!myPage.includes("HISTORY_PAGE_SIZE")
    || !myPage.includes("historyOffset")
    || !myPage.includes("getMyParticipationOverview")) {
    fail("js/pages/mypage.js: participation history pagination is not wired");
  }

  const adminApi = sourceAt("js/api/admin.js");
  if (!adminApi.includes('supabase.rpc("admin_list_members_page"')) {
    fail("js/api/admin.js: admin member directory must use the paginated RPC");
  }
  const adminMembersPage = sourceAt("js/pages/admin/members.js");
  if (!adminMembersPage.includes("PAGE_SIZE")
    || !adminMembersPage.includes("pageSize: PAGE_SIZE")
    || adminMembersPage.includes("rows.filter(")) {
    fail("js/pages/admin/members.js: member management must remain server-paginated and server-searched");
  }

  const notificationRuntime = sourceAt("js/notifications.js");
  if (notificationRuntime.includes("sync_my_activity_reminders")
    || notificationRuntime.includes("setInterval(syncRemindersAndNotify")) {
    fail("js/notifications.js: client activity-reminder polling must remain removed");
  }

  const p1StabilityMigration = sourceAt("supabase/site/migrations/20260826072528_community_p1_stability.sql");
  if (!p1StabilityMigration.includes("private.is_approved_member()")
    || !p1StabilityMigration.includes("direct_messages_select_own")) {
    fail("community P1 migration: direct-message access must require approved membership");
  }

  const p1InvokerMigration = sourceAt("supabase/site/migrations/20260826072758_community_p1_rpc_security_invoker.sql");
  if (!p1InvokerMigration.includes("security invoker")
    || !p1InvokerMigration.includes("sync_my_activity_reminders")) {
    fail("community P1 migration: atomic RPCs must remain invoker-based and client reminder RPC revoked");
  }

  const p2AdminMigration = sourceAt("supabase/site/migrations/20260826073714_community_p2_admin_member_pagination.sql");
  if (!p2AdminMigration.includes("admin_list_members_page")
    || !p2AdminMigration.includes("security invoker")
    || !p2AdminMigration.includes("private.is_admin()")) {
    fail("community P2 migration: admin member pagination must remain invoker-based and admin-guarded");
  }

  const p2ParticipationMigration = sourceAt("supabase/site/migrations/20260826084607_community_p2_participation_overview.sql");
  if (!p2ParticipationMigration.includes("get_my_participation_overview")
    || !p2ParticipationMigration.includes("security invoker")
    || !p2ParticipationMigration.includes("private.is_approved_member()")
    || !p2ParticipationMigration.includes("p_history_offset")) {
    fail("community P2 migration: participation overview must remain approved-member scoped and paginated");
  }

  const navigationCss = sourceAt("css/navigation.css");
  if (!/@media\s*\(min-width:\s*900px\)[\s\S]*?\.icon-button\.header-admin-link\s*\{[\s\S]*?display:\s*none\s*;?[\s\S]*?\}/.test(navigationCss)) {
    fail("css/navigation.css: mobile admin shortcut must stay hidden on desktop with sufficient specificity");
  }

  const app = sourceAt("js/app.js");
  const criticalRoutes = [
    "/login",
    "/",
    "/activities",
    "/notice",
    "/prayer",
    "/mypage",
    "/admin",
  ];
  criticalRoutes.forEach((routePath) => {
    if (!app.includes(`route("${routePath}"`)) {
      fail(`js/app.js: critical route not registered: ${routePath}`);
    }
  });
  if (!app.includes("resetShellTransientUi(shellState.header)")
    || !app.includes("#notification-panel")
    || !app.includes("aria-controls='notification-panel'")) {
    fail("js/app.js: persistent shell must reset notification panel state on route render");
  }
}

const siteJsFiles = walk(path.join(root, "js"))
  .filter((file) => file.endsWith(".js"))
  .filter((file) => relativeFile(file) !== "js/pages/games.js");

siteJsFiles.forEach(checkRelativeImports);
checkIndexAssets();
checkCssBraces();
checkArchitectureContracts();

if (errors.length) {
  console.error("Site static checks failed:\n");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Site static checks passed (${siteJsFiles.length} site JS files).`);
