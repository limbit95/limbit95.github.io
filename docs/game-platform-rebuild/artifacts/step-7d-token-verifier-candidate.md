# STEP7D private token verifier candidate

Astra 2026-10-28 소비 경로 판단에 따른 독립 후보. ES256/typ JWT, 명시 issuer/audience, 로컬 public JWKS만 받는다. sub/session_id는 소문자 UUID, exp/nbf는 정수 NumericDate다. clock은 명시 milliseconds 함수이며 검증 전후 유효·비역행을 확인한다. 오차 허용0, 반환 직전 만료 거절. 시험 설정은 운영 deadline이 아니다. token/키/claims를 오류나 로그에 남기지 않는다.

결과 VERIFIED_TOKEN_CLAIMS는 current 허가/A/C/P가 아니다. consumer가 실제 검증 호출 경로를 소유해야 하며 JSON 복사·freeze는 같은 process의 악성 코드를 격리하지 않는다. 운영 issuer/key/알고리즘·rotation/revocation 호환은 미입증이다. HS256/remote JWKS/Auth HTTP fallback·storage/runtime GRANT/listener는 없다.

private jose6.2.12만 추가, root package/lock 불변. helper journal v2가 pg/jose 각각의 새 owned link를 추적한다. v1 journal은 새 helper로 삭제 권한을 재발급하지 않는다. 기존 pg14개 lock projection SHA256을 검사한다. 포장 명시 source 목록과 import proof는 verifier/jose를 포함하며 옛14package archive는 새 후보 증거가 아니다. 새 배포용 archive 생성은 별도 NOT_RUN이며 offline 임시 archive 계약과 구분한다.

원본 Astra 판단 §8·STEP7B §7 전체 및 기존 후속 의무 유지. DB NOT_RUN/public UNKNOWN_OPAQUE_EDGES/STEP7D 미완료·실제 지원 미입증 유지. lease/wrapper/원SQL/게임/Auth/site writer·Guard/policy/workflow는 변경하지 않는다.
