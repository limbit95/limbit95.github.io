export const PROFILE_STATUS = Object.freeze({
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  SUSPENDED: "suspended",
});

export const PROFILE_STATUS_LABEL = Object.freeze({
  pending: "승인 대기",
  approved: "이용 가능",
  rejected: "가입 거절",
  suspended: "이용 정지",
});

export const EVENT_STATUS_LABEL = Object.freeze({
  scheduled: "모집 중",
  closed: "모집 마감",
  completed: "활동 완료",
  cancelled: "일정 취소",
});

export const PARTICIPATION_STATUS_LABEL = Object.freeze({
  joined: "참여 확정",
  waitlisted: "대기 신청",
  cancelled: "참여 취소",
});

export const JOIN_REQUEST_STATUS_LABEL = Object.freeze({
  pending: "승인 대기",
  approved: "승인",
  rejected: "거절",
  held: "보류",
});

export const POLL_STATUS_LABEL = Object.freeze({
  open: "투표 중",
  closed: "투표 마감",
  cancelled: "투표 취소",
});

export const AGE_VISIBILITY_LABEL = Object.freeze({
  birth_year: "출생연도 공개",
  age_group: "연령대만 공개",
  private: "비공개",
});

export const ROUTE_META = Object.freeze({
  "/": { title: "홈", auth: "approved" },
  "/login": { title: "로그인", auth: "guest" },
  "/signup": { title: "회원가입", auth: "guest" },
  "/auth/confirm": { title: "이메일 인증", auth: null },
  "/password/forgot": { title: "비밀번호 찾기", auth: null },
  "/password/update": { title: "새 비밀번호 설정", auth: null },
  "/pending": { title: "가입 승인 대기", auth: "signed" },
  "/suspended": { title: "이용 정지 안내", auth: "signed" },
  "/activities": { title: "활동", auth: "approved" },
  "/activities/new": { title: "활동 등록", auth: "manager" },
  "/notice": { title: "공지사항", auth: "approved" },
  "/community": { title: "자유게시판", auth: "approved" },
  "/mypage": { title: "마이페이지", auth: "approved" },
  "/mypage/edit": { title: "프로필 수정", auth: "approved" },
  "/admin": { title: "관리자", auth: "admin" },
});

export const PAGE_SIZE = 12;
export const AVATAR_BUCKET = "avatars";
export const MAX_AVATAR_BYTES = 3 * 1024 * 1024;
export const ALLOWED_AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp"];
