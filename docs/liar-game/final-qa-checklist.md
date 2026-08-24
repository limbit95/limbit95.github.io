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
