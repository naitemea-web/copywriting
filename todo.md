# todo.md — 카피 마스터 구현 체크리스트 (1 → 10단계)

> `PRD.md`(v2.0) · `spec.md`(v2.0) 기반 단계별 구현 체크리스트.
> 진행 시 `[ ]` → `[x]` 로 체크. 각 단계는 **완료 기준(DoD)** 을 통과해야 다음으로 진행.
> 의존성: 1 → 2 → 3 → 4 → 5 → (6·7·8) → 9 → 10. **MVP 필수 = 1~9단계**.

범례: ⭐ 핵심 / 🧪 테스트 동반 / 📱 모바일 확인 / 학습원리 ①~⑦

---

## 1단계 — 프로젝트 셋업 & 인프라 (M0)
> 목표: 빈 화면이 라우팅되는 골격.

- [x] `pnpm create vite copy-master --template react-ts` 로 프로젝트 생성
- [x] 의존성 설치: `zustand` `framer-motion` `@dnd-kit/core` `react-router-dom`
- [x] 개발 의존성: `tailwindcss` `postcss` `autoprefixer` `vitest` `@testing-library/react`
- [x] Tailwind 초기화 (`tailwind.config.js`, `index.css` 디렉티브) + 4단계 stage 색상 토큰 정의
- [x] `spec.md §7` 디렉토리 구조 생성 (`data/ types/ store/ lib/ components/ pages/`)
- [x] React Router 설정: `/`(Home) `/codex` `/quiz` `/builder` `/review` `/progress`
- [x] Vitest 설정(`vitest.config.ts`) + 샘플 테스트 1개 통과
- [x] Git 초기화, `.gitignore`, README 한 줄

**DoD**: `pnpm dev` 실행 시 6개 라우트가 빈 페이지로 전환됨. `pnpm test` 통과.

---

## 2단계 — 데이터 모델 & 콘텐츠 시드
> 목표: 타입 정의 + PDF 콘텐츠를 정적 시드로 확정. (`spec.md §2·§5`)

- [x] `types/index.ts`: `Stage` `CardCategory` `TechniqueCard` `FrameworkSection` `MissionCard` `QuizQuestion` 정의
- [x] `types/index.ts`: 학습상태 타입 `Confidence` `RecallAttempt` `CardMastery` `GameMode` `Grade` `BuilderPlacement` `RoundResult` `PlayerProgress` 정의
- [x] `data/techniqueCards.ts`: 7 심리 버튼 + 5 후킹 무기 = **12장** 시드 (id·이름·원리·stage·예시·효과·tip)
- [x] `data/sections.ts`: 9섹션 + `recommendedCardIds`(복수) + `modelCopy`(모범 카피)
- [x] `data/missions.ts`: TPPGE 미션 **3종 이상** 시드
- [x] `data/quizQuestions.ts`: 인출 퀴즈 문항 시드(각 카드당 1+ 예시, 보기 4지선다)
- [x] 시드 데이터 무결성 점검: 모든 `recommendedCardIds`/`answerCardId`가 실제 카드 id와 일치

**DoD**: 타입 컴파일 통과, 12장·9섹션·미션·퀴즈 시드가 코드로 import 가능. id 참조 깨짐 없음.

---

## 3단계 — 코어 학습 로직 라이브러리 🧪⭐
> 목표: 게임의 두뇌(학습 과학 로직)를 순수 함수로 구현 + 단위 테스트. (`spec.md §5.1~5.4`)

- [x] `lib/scoring.ts`: `scoreBuilder()` `toGrade()` 구현
- [x] `lib/srs.ts` ②: `updateMastery()`(박스 1~5, 간격 [1,2,4,7,14]) `getDueCards()` 구현
- [x] `lib/calibration.ts` ⑦: `isOverconfident()` `calibrationReport()`(과신/과소/보정정확도) 구현
- [x] `lib/deck.ts` ③: `buildDeck()`(블록→인터리빙, 임계 0.8) + `shuffle()` 유틸
- [x] `lib/session.ts` ⑤: 세션 타이머(8~12분), `updateStreak()`(날짜 비교 연속일) 구현
- [x] 🧪 `srs.test.ts`: 정답→박스+1·dueAt 증가, 오답→박스1 리셋 검증
- [x] 🧪 `calibration.test.ts`: 과신(확신≥3·오답) 카운트 검증
- [x] 🧪 `scoring.test.ts`: 정답 매칭 비율 점수·등급 경계값 검증

**DoD**: `lib/` 모든 함수가 순수 함수로 동작, 단위 테스트 전부 통과. (시간 의존 함수는 `now` 주입형)

---

## 4단계 — 전역 상태 & 영속화
> 목표: 진행도/SRS/세션을 Zustand로 관리하고 localStorage에 영속. (`spec.md §7 store`)

- [x] `store/gameStore.ts`: `PlayerProgress` 상태 + `persist` 미들웨어(localStorage)
- [x] 액션: `recordAttempt()` `applyMastery()`(srs 연동) `saveRound()` `unlockBadge()` `bumpStreak()`
- [x] 셀렉터: `selectDueCount()` `selectMastery(cardId)` `selectStreak()`
- [x] 신규 사용자 초기화(모든 카드 박스1·dueAt=now) / 마이그레이션 안전장치(버전 키)
- [x] 🧪 store 액션이 srs/calibration 로직과 올바르게 연동되는지 테스트

**DoD**: 새로고침 후에도 진행도·SRS 박스·streak 유지. 액션이 3단계 로직을 정확히 호출.

---

## 5단계 — 공용 컴포넌트 (학습 루프 부품) ⭐📱
> 목표: 모든 모드가 공유하는 인출/확신도/카드 UI. (`spec.md §6.2 핵심 학습 루프`)

- [x] `components/Card.tsx`: 앞/뒷면 뒤집기(Framer Motion), stage 색상, 모바일 터치 44px+
- [~] 인출 게이트 ①⭐: `Codex`(덮고 떠올리기)·`Quiz`(백지 인출)에 인라인 구현(별도 `RecallStep.tsx` 대신). 추후 공통 컴포넌트로 추출 가능
- [x] `components/ConfidenceMeter.tsx` ⑦: 확신도 1~4 선택 UI
- [x] `components/ResultModal.tsx`: 점수/등급 + 모범 카피 + 보정 리포트 표시
- [x] `components/ReviewNudge.tsx` ⑤: "자고 내일 복습" 세션 종료 넛지
- [x] 공통 레이아웃/헤더(App.tsx), 즉각 피드백 색상(정답=초록/오답=빨강)

**DoD**: RecallStep이 인출 전 정답을 절대 노출하지 않음(게이트 동작). 컴포넌트가 Storybook 없이도 페이지에서 조립 가능.

---

## 6단계 — F1 카드 도감 + 인출 (M1) ①
> 목표: 카드 열람 후 단순 재읽기 방지 — 덮고 떠올리기.

- [x] `pages/Codex.tsx`: 12장 카드 그리드 + stage 필터(주목·신뢰·가치·행동)
- [x] 카드 탭 → 뒤집어 원리/예시/효과/적용위치 표시
- [x] 카드 확인 후 "덮고 떠올리기" 미니 인출(이름/원리 떠올려 입력) 유도 → 결과를 store에 기록
- [x] 📱 모바일 그리드/스크롤 확인

**DoD**: 12장 열람 + 미니 인출 1회가 store에 attempt로 남고 SRS 박스에 반영됨.

---

## 7단계 — F2 인출 퀴즈 + F4 확신도 보정 (M2) ①⑦⭐
> 목표: 예시 카피 → 백지 인출 → 확신도 → 보기 확인 → 피드백.

- [x] `pages/Quiz.tsx`: 세트(5문항) 진행 구조
- [x] (1) `RecallStep`으로 백지 인출 → (2) `ConfidenceMeter` 확신도 → (3) 4지선다 보기 노출
- [x] 선택 즉시 정/오답 + 해설 카드(원리·예시) 공개
- [x] 과신+오답("착각 경고") 표시 + 해당 카드 복습 큐 우선 투입(박스1)
- [x] 세트 종료: 점수/정답률 + `calibrationReport`(과신 N/과소 N) 표시
- [x] 결과 `saveRound()` 저장

**DoD**: 인출→확신도→보기→피드백 풀 루프 동작, 보정 리포트 출력, 착각 카드가 복습 큐에 반영.

---

## 8단계 — F3 9섹션 빌더 (M3) ①④⭐ (Flagship)
> 목표: 미션 → 인출/배치 → 채점 → 모범 카피 → 미리보기.

- [x] `components/MissionPanel.tsx`: TPPGE 미션 카드 표시
- [x] `components/SectionSlot.tsx` + `components/Hand.tsx`: dnd-kit 드래그앤드롭 배치
- [x] 섹션별 "어떤 기법?" 먼저 인출 → 카드 배치 (+선택: `writtenCopy` 직접 작성)
- [x] 손글씨 넛지 문구("헤드라인은 손으로 적어보세요") ④
- [x] '카피 완성' → `scoreBuilder` 채점 → 섹션별 ✓/✗ + 각 섹션 모범 카피 공개
- [x] `components/CopyPreview.tsx`: 9섹션을 한 편 상세페이지로 세로 렌더
- [x] 결과 저장 + 세션 종료 시 `ReviewNudge`
- [x] 📱 모바일 드래그 동작 확인(터치)

**DoD**: 미션→배치→채점→모범카피→미리보기 전체가 모바일에서 끊김 없이 1라운드 완주.

---

## 9단계 — F5 오늘의 복습 (분산 SRS) + 홈 (M4) ②⭐
> 목표: 망각 직전 카드 재등장 — MVP 완성점.

- [x] `pages/Review.tsx`: `getDueCards()`로 due 카드 큐 구성 → 인출 → `updateMastery` 박스 이동
- [x] `pages/Home.tsx`: "오늘 복습할 카드 N장" 배지 + 연속일(streak) + 추천 모드
- [x] 복습 큐 소진 시 보상/완료 표시
- [x] 날짜 변경(자정) 기준 due 재계산 검증(localStorage 날짜 비교)
- [x] 🧪 due 산정·박스 이동 시나리오 테스트

**DoD(=MVP DoD)**: F1~F5 동작 + 백지 인출 루프 + Leitner 복습 큐가 실제로 돌고, 새로고침/날짜경과 후 due가 정확.

---

## 10단계 — F6·F7·F9 적응형/페이싱/진행도 + 폴리시 & 배포 (M5) ③⑤
> 목표: 학습 효율 강화 메커닉 + 출시.

- [ ] F6 ③ `pages/Quiz`에 `buildDeck()` 연동: 카테고리 정답률 < 0.8 블록 / 이상 혼합 출제
- [ ] F7 ⑤ 세션 페이싱: 8~12분 타이머 → 종료 넛지("자고 내일 복습") 노출
- [ ] F9 `pages/Progress.tsx`: 숙련도(박스 분포)·보정 리포트·배지·연속일 표시
- [ ] 배지 규칙: "9섹션 인출 완주" "확신도 보정 달인" "복습 7일 연속" 등 해금 로직
- [ ] 📱 반응형 폴리시: 모션·로딩·빈 상태·에러 처리
- [ ] 접근성 점검(대비·포커스·터치 타깃), 라이트하우스 기본 점검
- [ ] 정적 빌드 `pnpm build` → Vercel/Netlify 배포

**DoD**: 블록→혼합 전환 동작, 세션 넛지·배지·진행도 표시, 배포 URL에서 전체 플레이 가능.

---

## 부록 — 전체 진행 요약

| 단계 | 내용 | 마일스톤 | MVP |
|------|------|----------|-----|
| 1 | 셋업·인프라 | M0 | ✅ |
| 2 | 데이터 모델·시드 | M0~M1 | ✅ |
| 3 | 코어 학습 로직 🧪 | M1~M4 | ✅ |
| 4 | 전역 상태·영속화 | M1 | ✅ |
| 5 | 공용 컴포넌트(인출/확신도) | M1~M2 | ✅ |
| 6 | F1 카드 도감+인출 | M1 | ✅ |
| 7 | F2 인출 퀴즈 + F4 보정 | M2 | ✅ |
| 8 | F3 9섹션 빌더 | M3 | ✅ |
| 9 | F5 오늘의 복습(SRS) | M4 | ✅ **(MVP 완성 — DoD 충족)** |
| 10 | F6·F7·F9 + 폴리시·배포 | M5 | 권장 |

> **검증 우선순위(학습 과학 핵심):** 3단계(로직)와 5단계(RecallStep 게이트)가 게임의 차별점.
> 이 둘이 정확해야 "인출 우선·분산·보정"이 실제로 작동한다 — 테스트로 반드시 보증할 것.
