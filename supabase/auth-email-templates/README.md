# Supabase Auth 이메일 템플릿

Supabase Auth가 직접 발송하는 인증 메일의 커스텀 템플릿 원본을 보관합니다.

서비스 메일 공통 레이아웃(`../functions/_shared/email-layout.ts`)은 Edge Function에서 사용하는 TypeScript 렌더러이므로 Supabase Auth 이메일에서 직접 import할 수 없습니다. 대신 이 디렉터리의 Auth 템플릿에서 동일한 브랜드 색상, 카드, CTA 버튼, 푸터 규칙을 유지합니다.

## 비밀번호 재설정

- Supabase 항목: `Authentication > Email Templates > Reset password`
- 제목: `[청파 같이] 비밀번호 재설정 안내`
- 본문 원본: `recovery.html`
- 재설정 링크: `{{ .ConfirmationURL }}`

`{{ .ConfirmationURL }}`은 Supabase Auth가 발급하는 recovery 링크를 그대로 사용합니다. 별도의 토큰 URL을 만들지 않아 현재 `js/pages/passwordReset.js`의 비밀번호 복구 흐름을 변경하지 않습니다.

운영 Auth 이메일 템플릿을 수정할 때는 Supabase에 반영하는 내용과 이 디렉터리의 버전 관리 원본을 함께 갱신합니다.
