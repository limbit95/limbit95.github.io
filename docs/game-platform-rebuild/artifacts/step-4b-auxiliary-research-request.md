# STEP 4B — 일반 Sol5.6 보조 조사 요청

첨부한 `step-4b-auxiliary-research-input.md`를 유일한 프로젝트 입력으로 사용하여 아래 Q01~04의 부족한 근거만 조사해줘. 저장소 접근·배포 상태·프로젝트 기술 지원을 가정하지 마. 기존 STEP3/4A 조사 전체를 반복하지 마.

1. **Q01 순서·중복·initial/live:** 권위 있는 상태와 입력 stream에서 transport ordering/ACK, application sequence/중복 commit, snapshot과 live의 연결 경계를 구별할 공식 근거를 확인해줘. 구독 ACK 전 변경·snapshot 로드 중 변경·재가입/동일 sequence·여러 stream/연결 교체의 조건과 한계를 비교해줘. 기존 DB version을 모든 모델의 필수 필드로 정하지 마.
2. **Q02 복구·예측/확정:** 현재 상태 resync와 history replay, 입력 retry와 simulation 재실행, authoritative 재시작/상태 보존, late join/rejoin의 실패 조건을 조사해줘. TTL/보존기간·gap 검출·확정/결과 중복 경계를 공식 자료가 어디까지 보장하는지 구분해줘. GGPO 자체를 영구 보상 중복 방지 근거로 확대하지 마.
3. **Q03 private·인가 신선도:** Supabase Realtime의 사용 모드(Postgres Changes/Broadcast/Presence)별 인증·접근 검사 시점, 정책/회원상태 변경과 기존 구독·재가입·token refresh의 관계를 공식 문서에서 확인해줘. 프로젝트는 DB helper가 profiles.status를 조회하고 client authState는 cached profile을 사용한다. 요청 인가·전송 대상 제한·client cache 폐기와 이미 발송된 정보 회수는 서로 다르다. 기존 OAuth/HTTP 문서 전체를 다시 조사하지 마.
4. **Q04 실행·transport·운영/비용:** 프로젝트 후보를 선택하지 말고 다음 분류의 확인 가능한 차이를 비교해줘: 기존 DB transaction+invalidation, 전용 authoritative match loop+stream(기존 Nakama 사례 재사용), relay/client simulation(기존 Photon 사례 재사용). Supabase Realtime 일반 기능이 임의 권위 simulation loop를 운영함을 증명하는지 별도로 확인해줘. 추가 제품은 이 분류의 핵심 공백을 해소하는 데 꼭 필요한 경우에만 최대1개를 선정 이유와 함께 조사해줘. 제품별 정확한 edition/배포형태·인증·상태유지/재시작·스케일/지역·연결/주기/대역폭·관측/장애·가격 항목과 제한을 적어줘.

부하/동접/지역/주기/예산/허용지연/회복시간 수치가 없다. 임의 숫자·최저 월비용·무료플랜 적합성 결론을 만들지 마. 비용은 확인일, 공식 가격URL, 단위/포함량/초과량, 공개 가격 없음 여부, 변수식과 필요한 가정, compute/DB/egress/저장/관측/운영 인력 등 미포함 비용을 구분해줘. self-host와 managed/cloud 가격을 섞지 마.

출처는 공식 문서/규격·공식 운영/가격 자료에 한정해줘. 출처마다 ID, URL, 문서 판본/확인일, 정확한 절, 직접 지지하는 사실, 지원 조건, 미확인·확인 실패를 남겨줘. 미래판 문서·폐기/유지보수판·공식 문서 간 충돌은 그대로 표시해줘. 확인 못한 내용은 완료로 쓰지 마.

`step-4b-auxiliary-research-report.md` 원본으로 제출해줘. Q별 요약/비교표 → 출처/확인 범위 → 프로젝트 적용 추론 → 미확인 → Astra 3A/3B/3C 판단 질문 순으로 작성해줘. source 사실, 적용 추론, 결정을 명확히 분리하고 확인 과정이 없는 주장에 출처 ID를 붙이지 마.

모델/백엔드/transport/API/필드·규칙 면제·저장소 적합성을 결정하지 마. Git 수정·DB/서비스 구축·핵심 판단·정식 산출물 반영은 수행하지 마. 조사 원본 제출 뒤 멈춰줘. 조사 수신은 Astra 판단 완료가 아니다.
