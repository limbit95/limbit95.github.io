import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");
const home = read("../js/pages/home.js");
const listView = read("../js/pages/activities/listView.js");
const detail = read("../js/pages/activityDetail.js");

test("activity participation mutations refresh only the affected home and list cards", () => {
  assert.match(home, /attachEventParticipationSummaries/);
  assert.match(home, /card\.replaceWith\(createHomeActivityCard\(updatedEvent, auth\)\)/);
  assert.doesNotMatch(home, /const refreshed = await renderHome\(\)/);
  assert.doesNotMatch(home, /root\.replaceWith\(refreshed\)/);

  assert.match(listView, /attachEventParticipationSummaries/);
  assert.match(listView, /card\.replaceWith\(createListActivityCard\(updatedEvent, auth\)\)/);
  assert.doesNotMatch(listView, /const updated = await renderActivityList\(/);
  assert.doesNotMatch(listView, /grid\.replaceWith\(updated\)/);
});

test("activity detail refreshes participation state without rebuilding the whole screen for normal joins", () => {
  assert.match(detail, /async function refreshParticipationPanel/);
  assert.match(detail, /attachEventParticipationSummaries\(\[event\]\)/);
  assert.match(detail, /listEventParticipants\(event\.id\)/);
  assert.match(detail, /currentPanel\.replaceWith\(createParticipationPanel/);
  assert.match(
    detail,
    /const result = await joinEvent\(event\.id\);[\s\S]*await refreshParticipationPanel\(\{ event, root, auth, organizerTransferRequest \}\)/,
  );
});

test("organizer participation cancellation keeps the full detail refresh safety boundary", () => {
  assert.match(
    detail,
    /await cancelEventParticipation\(event\.id\);[\s\S]*if \(isOrganizer\) \{[\s\S]*root\.replaceWith\(await renderActivityDetail/,
  );
  assert.match(
    detail,
    /else \{[\s\S]*await refreshParticipationPanel\(\{ event, root, auth, organizerTransferRequest \}\)/,
  );
});
