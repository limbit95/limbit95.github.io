/**
 * Supabase Dashboard > Project Settings > API(또는 Connect)에서 확인한 값을 넣으세요.
 * publishable key 또는 legacy anon key만 사용하며 service_role key는 절대 넣지 마세요.
 */
export const SUPABASE_URL = "https://YOUR_PROJECT_REF.supabase.co";
export const SUPABASE_PUBLISHABLE_KEY = "YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY";

/**
 * NAVER Cloud Maps > Application에서 발급한 Web Dynamic Map Client ID를 넣으세요.
 * 허용 웹 서비스 URL에는 실제 배포 도메인을 등록하세요.
 */
export const NAVER_MAPS_CLIENT_ID = "YOUR_NAVER_MAPS_CLIENT_ID";

/**
 * Kakao Developers > 앱 > 플랫폼 키에서 발급한 JavaScript 키를 넣으세요.
 * JavaScript SDK 도메인과 제품 링크 웹 도메인에는 실제 배포 도메인을 등록하세요.
 */
export const KAKAO_JAVASCRIPT_KEY = "YOUR_KAKAO_JAVASCRIPT_KEY";

/**
 * Kakao Developers > 도구 > 메시지 템플릿에서 만든 활동 공유용 사용자 정의 템플릿 ID를 넣으세요.
 * 기본 템플릿의 하단 APP 출처 링크는 변경할 수 없으므로, 출처 링크를 활동으로 보내려면 이 값이 필요합니다.
 * 템플릿에는 ${title}, ${description}, ${event_id} 사용자 인자를 사용하고,
 * 활동 자세히 보기 버튼과 하단 APP 출처 링크 모두 /activity-link.html?id=${event_id}로 설정하세요.
 * 값이 없으면 기본 Feed 템플릿으로 fallback합니다.
 */
export const KAKAO_SHARE_TEMPLATE_ID = null;

export const SITE_NAME = "청파 같이";
export const PRIVACY_POLICY_VERSION = "2026-01";
