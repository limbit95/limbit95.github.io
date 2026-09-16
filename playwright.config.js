import { defineConfig, devices } from "@playwright/test";

const isCI = Boolean(process.env.CI);
const e2eMemberUserId = process.env.E2E_MEMBER_USER_ID;
const authenticatedStorageState = e2eMemberUserId
  ? {
      cookies: [],
      origins: [
        {
          origin: "http://127.0.0.1:4173",
          localStorage: [
            {
              name: `cheongpa:push-onboarding:${e2eMemberUserId}:first-activity:v1`,
              value: "shown",
            },
          ],
        },
      ],
    }
  : undefined;

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  expect: {
    timeout: 10_000,
  },
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  workers: isCI ? 2 : undefined,
  reporter: isCI
    ? [["line"], ["html", { open: "never" }]]
    : "list",
  use: {
    baseURL: "http://127.0.0.1:4173",
    storageState: authenticatedStorageState,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium-desktop",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "webkit-mobile",
      use: { ...devices["iPhone 15"] },
    },
  ],
  webServer: {
    command: "python3 -m http.server 4173 --bind 127.0.0.1",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: !isCI,
    timeout: 15_000,
  },
});
