import { readFile, writeFile } from "node:fs/promises";

const filePath = "tests/e2e/community-authenticated.spec.js";
let source = await readFile(filePath, "utf8");

const oldCollector = '      if (pathname.includes("/js/")) requests.add(pathname);';
const newCollector = '      if (pathname.includes("/js/") || pathname.includes("/assets/build/")) requests.add(pathname);';
if (!source.includes(oldCollector)) {
  throw new Error("Expected JavaScript request collector was not found.");
}
source = source.replace(oldCollector, newCollector);

const startMarker = '  test("does not eagerly load unrelated route or API modules at startup", async ({ page }) => {';
const endMarker = '  test("logs in and opens core community routes", async ({ page }) => {';
const start = source.indexOf(startMarker);
const end = source.indexOf(endMarker);
if (start < 0 || end < 0 || end <= start) {
  throw new Error("Expected startup performance E2E block was not found.");
}

const replacement = `  test("loads hashed startup bundles and keeps route chunks lazy", async ({ page }) => {\n    const pageErrors = collectPageErrors(page);\n    const jsRequests = collectJavaScriptRequests(page);\n    await login(page, memberEmail, memberPassword);\n\n    const startupBuildRequests = [...jsRequests].filter((pathname) => pathname.startsWith("/assets/build/"));\n    expect(\n      startupBuildRequests.some((pathname) => /^\\/assets\\/build\\/app-[A-Za-z0-9]+\\.js$/.test(pathname)),\n      "startup should load the content-hashed app entry",\n    ).toBe(true);\n    expect(\n      [...jsRequests].some((pathname) => pathname.startsWith("/js/pages/") || pathname.startsWith("/js/api/")),\n      "bundled production pages should not request raw route/API modules",\n    ).toBe(false);\n\n    const startupChunkCount = startupBuildRequests.length;\n    await page.goto("/#/mypage");\n    await assertHealthyPage(page, "마이페이지");\n    const afterMyPageBuildRequests = [...jsRequests].filter((pathname) => pathname.startsWith("/assets/build/"));\n    expect(\n      afterMyPageBuildRequests.length,\n      "navigating to a lazy route should fetch at least one additional hashed chunk",\n    ).toBeGreaterThan(startupChunkCount);\n\n    expectNoPageErrors(pageErrors);\n  });\n\n`;
source = source.slice(0, start) + replacement + source.slice(end);

await writeFile(filePath, source, "utf8");
console.log("Migrated authenticated E2E startup assertions to hashed bundles.");
