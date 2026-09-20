# Supabase Auth 이메일 템플릿

Supabase Auth가 직접 발송하는 인증 메일의 커스텀 템플릿 원본을 보관합니다.

서비스 메일 공통 레이아웃(`../functions/_shared/email-layout.ts`)은 Edge Function에서 사용하는 TypeScript 렌더러이므로 Supabase Auth 이메일에서 직접 import할 수 없습니다. 대신 이 디렉터리의 Auth 템플릿에서 동일한 브랜드 색상, 카드, CTA 버튼, 푸터 규칙을 유지합니다.

## 비밀번호 재설정

- Supabase 항목: `Authentication > Email Templates > Reset password`
- 제목: `[청파 같이] 비밀번호 재설정 안내`
- 본문 원본: `recovery.html`
- 재설정 링크: `{{ .RedirectTo }}?token_hash={{ .TokenHash }}&type=recovery#/password/update`

비밀번호 복구는 현재 사이트의 해시 라우터와 PKCE 설정에 맞춰 다음 순서로 처리합니다.

1. `js/auth.js`의 `requestPasswordReset()`이 현재 서비스 루트 URL을 `redirectTo`로 전달합니다.
2. 복구 메일은 `RedirectTo`와 `TokenHash`를 조합해 실제 경로는 루트(`/`)에 두고 `#/password/update` 해시 라우트로 이동합니다.
3. `js/pages/passwordReset.js`가 `token_hash`를 읽어 `verifyOtp({ type: "recovery" })`로 복구 세션을 검증합니다.
4. 검증이 끝나면 URL의 일회용 토큰을 제거하고 새 비밀번호 입력 폼을 표시합니다.

GitHub Pages는 `/password/update` 같은 SPA 경로를 직접 제공하지 않으므로 복구 링크에서 일반 경로를 사용하지 않습니다. 실제 문서 요청은 항상 루트로 보내고 화면 전환은 `#/password/update`로 처리합니다.

운영 중인 hosted Supabase 프로젝트의 이메일 템플릿은 저장소 파일과 자동 동기화되지 않습니다. 이 파일을 변경했다면 Supabase Dashboard의 `Authentication > Email Templates > Reset password` 본문에도 같은 내용을 반영해야 합니다.
