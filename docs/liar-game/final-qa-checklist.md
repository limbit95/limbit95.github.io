# Liar Game Final Recovery / Security QA Checklist

## Recovery runtime

- [ ] ROLE_REVEAL, SPEAKING, DISCUSSION, VOTING, LIAR_REVEAL, LIAR_GUESS 참가자 leave가 `ROUND_PARTICIPANT_CANNOT_LEAVE`인지 확인
- [ ] 진행 Round 관전자 leave 성공 확인
- [ ] ROUND_RESULT 참가자 leave 성공 확인
- [ ] Host leave가 Room을 만료하고 active membership 전체를 종료하는지 확인
- [ ] ROLE_REVEAL 강제 종료 후 Round/Game force-ended 및 새 setup Game 확인
- [ ] VOTING 강제 종료가 open stage를 닫고 ballot/vote history를 보존하는지 확인
- [ ] LIAR_GUESS 강제 종료가 guess history를 보존하는지 확인
- [ ] Round 사이 `current_round_id=null`에서 강제 종료와 새 setup Game 확인
- [ ] ROUND_RESULT 강제 종료가 `INVALID_ROUND_STATE`인지 확인
- [ ] Realtime disconnect/reconnect 후 `SUBSCRIBED` snapshot 복구 확인
- [ ] background/foreground 복귀 후 visibility snapshot 복구 확인
- [ ] 계정 A read 진행 중 B 전환 시 A snapshot/secret/storage가 B에 적용되지 않는지 확인
- [ ] 계정 A mutation 진행 중 B 전환 시 A room id가 B storage에 기록되지 않는지 확인
- [ ] `STALE_VERSION` 시 snapshot만 refresh되고 mutation은 자동 재실행되지 않는지 확인

## Authorization and privacy

- [ ] anon business RPC 실행 거부 확인
- [ ] random/stolen player key가 `auth.uid` 불일치로 거부되는지 확인
- [ ] non-host의 start/next/restart/force-end/vote host action 거부 확인
- [ ] spectator의 role check, ballot, guess mutation 거부 확인
- [ ] 결과 전 `liar_get_round_result` 거부 확인
- [ ] authenticated/anon의 base table SELECT/INSERT/UPDATE/DELETE 거부 확인
- [ ] validate/expire/clear-expired/updated-at helper 직접 실행 거부 확인
- [ ] Realtime authorization helper 실행 권한 유지 확인
- [ ] 진행 참가자에게 다른 role, actual liar, answer word가 projection되지 않는지 확인
- [ ] open vote stage에서 다른 ballot 상세가 공개되지 않는지 확인
- [ ] capture failure 결과에서 reveal 전 `actual_liars=[]`인지 확인
- [ ] 모든 projection에서 `normalized_guess`가 제외되는지 확인

## Production start readiness

- [ ] ready 3 / liar 1에서 UI 시작 버튼 비활성 및 `NOT_ENOUGH_READY_PLAYERS` RPC 거부 확인
- [ ] ready 4 / liar 1 시작 성공 확인
- [ ] ready 4 / liar 2 시작 성공 확인
- [ ] ready 4 / liar 3에서 UI 시작 버튼 비활성 및 직접 RPC 호출의 `INVALID_LIAR_COUNT` 거부 확인
- [ ] ready 5 / liar 3 시작 성공 확인
- [ ] 준비 완료 4명에서 권장 라이어 1명 표시 확인
- [ ] 준비 완료 5명에서 권장 라이어 2명 표시 확인
- [ ] 권장값을 초과하는 liar 1~3 설정도 저장 가능한지 확인
- [ ] 시민 최소 2명을 충족하지 못할 때 setup과 다음 라운드 start 버튼이 disabled인지 확인
- [ ] 인원 부족 안내가 실제 부족 인원 수에 맞고, 시작 가능 상태가 명확히 표시되는지 확인
- [ ] 다음 라운드에서 설정이 read-only로 유지되는지 확인

## Full gameplay smoke test

- [ ] 4~6개의 실제 브라우저/프로필로 방 생성 → join → ready → role → speaking → discussion → voting → 필요 시 runoff → capture → guess → detailed result → next round → new game 전체 흐름을 1회 이상 완료
- [ ] 5명 / liar 2 전체 게임을 1회 완료
- [ ] 가능하면 5명 / liar 3 전체 게임을 1회 완료
- [ ] multi-liar 게임에서 정확한 수의 liar 배정과 투표 대상 선택 수 확인
- [ ] multi-liar 게임에서 self vote 거부, 팀 공유 guess attempts, detailed result 확인
- [ ] 결과에서 실제 liar 공개 전 next round/new game 차단과 공개 후 두 action 성공 확인

## Recovery smoke test

- [ ] 각 핵심 상태에서 reload 후 현재 상태 복구 확인
- [ ] background/foreground 전환 후 최신 snapshot 복구 확인
- [ ] Realtime 연결 해제/재연결 후 최신 snapshot 복구 확인
- [ ] stale version 발생 시 자동 snapshot 조회 후 수동 mutation 재선택 안내 확인
- [ ] 진행 중 입장 spectator의 정보 projection 및 action 제한 확인
- [ ] Auth 계정 전환 시 이전 계정 상태와 secret이 폐기되는지 확인
- [ ] Host force end 후 round/game 종료와 새 setup 복구 확인

## Responsive and accessibility

- [ ] 360px에서 긴 닉네임, 여러 카테고리, 긴 제시어, 다중 liar 이름, 투표 대상 3명, 긴 guess, vote history에 가로 overflow가 없는지 확인
- [ ] 결과의 다음 라운드/새 게임 action이 360px에서는 간격 있는 1열, 넓은 화면에서는 2열인지 확인
- [ ] 준비, 시작, 역할 확인, 발언, 투표, 추측, 다음 라운드 주요 action의 touch target이 최소 약 44px인지 확인
- [ ] disabled button의 시각 상태, cursor, 클릭 차단 확인
- [ ] keyboard focus와 역할 재확인 modal의 focus 복귀 확인
- [ ] `prefers-reduced-motion`에서 기존 motion 억제 확인