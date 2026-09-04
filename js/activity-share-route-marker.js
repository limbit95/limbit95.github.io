const SHARE_AFTER_CREATE_KEY = "activity-share-after-create";

let previousPath = hashPath(window.location.hash);

function hashPath(hash = window.location.hash) {
  return String(hash || "#/").split("?")[0];
}

function activityIdFromHash(hash = window.location.hash) {
  const match = hashPath(hash).match(/^#\/activities\/(\d+)$/);
  return match ? Number(match[1]) : null;
}

window.addEventListener("hashchange", () => {
  const eventId = activityIdFromHash();
  if (previousPath === "#/activities/new" && eventId) {
    try {
      window.sessionStorage.setItem(SHARE_AFTER_CREATE_KEY, String(eventId));
    } catch {
      // 세션 저장소를 사용할 수 없는 환경에서는 등록 후 공유 제안만 생략한다.
    }
  }
  previousPath = hashPath();
});
