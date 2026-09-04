import { KAKAO_JAVASCRIPT_KEY, SITE_NAME } from "./config.js";

const KAKAO_SDK_URL = "https://t1.kakaocdn.net/kakao_js_sdk/2.8.1/kakao.min.js";
const KAKAO_SDK_INTEGRITY = "sha384-OL+ylM/iuPLtW5U3XcvLSGhE8JzReKDank5InqlHGWPhb4140/yrBw0bg0y7+C9J";

let kakaoSdkPromise = null;

function kakaoConfigError() {
  return new Error("카카오톡 공유 설정이 필요합니다. Kakao Developers의 JavaScript 키와 웹 도메인을 확인해 주세요.");
}

function normalizeTime(value) {
  return String(value ?? "").slice(0, 5);
}

function activityDateLabel(event) {
  if (!event?.event_date) return "일정 미정";
  const date = new Date(`${event.event_date}T00:00:00+09:00`);
  return new Intl.DateTimeFormat("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "short",
    timeZone: "Asia/Seoul",
  }).format(date);
}

function activityTimeLabel(event) {
  const start = normalizeTime(event?.start_time);
  const end = normalizeTime(event?.end_time);
  if (!start) return "";
  return end ? `${start}–${end}` : start;
}

function participantLabel(event) {
  const joined = Number(event?.joined_count ?? 0);
  const waitlisted = Number(event?.waitlisted_count ?? 0);
  const capacity = Number(event?.capacity);
  const base = Number.isFinite(capacity) && capacity > 0
    ? `${joined}/${capacity}명`
    : `${joined}명`;
  return waitlisted > 0 ? `${base} · 대기 ${waitlisted}명` : base;
}

function seriesLabel(event) {
  if (!event?.series?.start_date || !event?.series?.end_date) return "";
  return `반복 ${event.series.start_date} ~ ${event.series.end_date}`;
}

export function activityShareUrl(eventId) {
  const id = Number(eventId);
  if (!Number.isFinite(id)) throw new Error("공유할 활동을 확인할 수 없습니다.");
  const url = new URL(window.location.href);
  url.hash = `#/activities/${id}`;
  return url.toString();
}

export function activityShareDescription(event) {
  const schedule = [activityDateLabel(event), activityTimeLabel(event)].filter(Boolean).join(" · ");
  const location = event?.location_name ? `📍 ${event.location_name}` : "";
  const participation = `👥 ${participantLabel(event)} · ${event?.fee_text || "무료"}`;
  const series = seriesLabel(event);
  const deadline = event?.registration_deadline
    ? `마감 ${new Intl.DateTimeFormat("ko-KR", {
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        timeZone: "Asia/Seoul",
      }).format(new Date(event.registration_deadline))}`
    : "";
  return [schedule, location, participation, series || deadline].filter(Boolean).join("\n");
}

function initializeKakao() {
  const kakao = window.Kakao;
  if (!kakao) throw new Error("카카오톡 공유 모듈을 불러오지 못했습니다.");
  if (!KAKAO_JAVASCRIPT_KEY) throw kakaoConfigError();
  if (!kakao.isInitialized()) kakao.init(KAKAO_JAVASCRIPT_KEY);
  return kakao;
}

export function prepareKakaoShare() {
  if (!KAKAO_JAVASCRIPT_KEY) return Promise.reject(kakaoConfigError());
  if (window.Kakao) {
    try {
      return Promise.resolve(initializeKakao());
    } catch (error) {
      return Promise.reject(error);
    }
  }
  if (kakaoSdkPromise) return kakaoSdkPromise;

  kakaoSdkPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${KAKAO_SDK_URL}"]`);
    if (existing) {
      existing.addEventListener("load", () => {
        try {
          resolve(initializeKakao());
        } catch (error) {
          reject(error);
        }
      }, { once: true });
      existing.addEventListener("error", () => reject(new Error("카카오톡 공유 모듈을 불러오지 못했습니다.")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = KAKAO_SDK_URL;
    script.integrity = KAKAO_SDK_INTEGRITY;
    script.crossOrigin = "anonymous";
    script.async = true;
    script.addEventListener("load", () => {
      try {
        resolve(initializeKakao());
      } catch (error) {
        reject(error);
      }
    }, { once: true });
    script.addEventListener("error", () => reject(new Error("카카오톡 공유 모듈을 불러오지 못했습니다.")), { once: true });
    document.head.append(script);
  }).catch((error) => {
    kakaoSdkPromise = null;
    throw error;
  });

  return kakaoSdkPromise;
}

export function shareActivityToKakao(event) {
  const kakao = window.Kakao;
  if (!kakao || !kakao.isInitialized()) throw kakaoConfigError();
  const url = activityShareUrl(event?.id);
  return kakao.Share.sendDefault({
    objectType: "feed",
    content: {
      title: `${event?.category?.icon ?? "🌿"} ${event?.title ?? SITE_NAME}`,
      description: activityShareDescription(event),
      link: {
        mobileWebUrl: url,
        webUrl: url,
      },
    },
    buttons: [{
      title: `${SITE_NAME}에서 보기`,
      link: {
        mobileWebUrl: url,
        webUrl: url,
      },
    }],
  });
}

export async function copyActivityLink(eventId) {
  const url = activityShareUrl(eventId);
  if (navigator.clipboard?.writeText && window.isSecureContext) {
    await navigator.clipboard.writeText(url);
    return url;
  }

  const textarea = document.createElement("textarea");
  textarea.value = url;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.append(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  textarea.remove();
  if (!copied) throw new Error("링크를 복사하지 못했습니다.");
  return url;
}
