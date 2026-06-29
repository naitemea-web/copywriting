# 카피 마스터 (Copy Master) — 카피라이팅 학습 카드게임 spec.md

> AI 코딩 에이전트(Claude Code · Cursor)가 그대로 구현할 수 있도록 작성한 MVP 기술 명세서.
> **버전 v2.0** — 학습 과학(인출·분산·인터리빙·메타인지) 메커닉 반영.
> 콘텐츠 출처: 「카피라이팅 바이블」 / 학습 설계 출처: 「2026년 기준 최적 학습 프로토콜」.
> 제품 요구사항은 `PRD.md` 참조.

---

## 0. 한 줄 요약

> **"백지에 떠올리고(인출), 잊을 때쯤 다시 보고(분산), 착각을 보정(메타인지)하며
> 9섹션 카피를 완성하는 — 학습 과학으로 설계한 카피라이팅 카드게임."**

- **타겟**: 카피라이팅 입문자(비전공 · AI 1인창업 · 마케팅 주니어)
- **MVP 한 문장**: 백엔드 없는 싱글플레이 웹앱. **인출 퀴즈 · 9섹션 빌더 · 오늘의 복습(SRS)** 으로 핵심 기법을 장기 기억에 정착.
- **v1.0 대비 핵심 변화**: 재인(보기 고르기) 중심 → **인출(먼저 떠올리기) + 확신도 보정 + Leitner 분산 복습**.

---

## 1. 핵심 기능 리스트 (Core Features)

### 1.1 MVP 범위

| # | 기능 | 설명 | 학습원리 | 우선순위 |
|---|------|------|----------|----------|
| F1 | **카드 도감 + 인출** | 12장 기법 카드 열람 후 "덮고 떠올리기" 미니 인출. | ① | P0 |
| F2 | **인출 퀴즈** | 예시 카피 → (1)백지 인출 → (2)확신도 → (3)보기 확인 → 즉시 피드백. | ①⑦ | P0 |
| F3 | **9섹션 빌더** | 미션 → 섹션별 기법 인출/배치(+카피 직접 작성) → 채점 → 모범 카피 공개 → 미리보기. | ①④ | P0 |
| F4 | **확신도 보정 & 점수** | 확신도(1~4) vs 실제 정오 → 보정 리포트, 점수/등급, 영속. | ⑦ | P0 |
| F5 | **오늘의 복습(SRS)** | Leitner 5박스(1·2·4·7·14일)로 약한 카드 재등장. | ② | P0 |
| F6 | **적응형 덱** | 블록 학습 → 정답률 임계 도달 시 혼합(인터리빙) 출제. | ③ | P1 |
| F7 | **세션 페이싱·넛지** | 8~12분 권장, 종료 시 "자고 내일 복습" 넛지. | ⑤ | P1 |
| F9 | **진행도·배지·연속일** | 숙련도/streak/배지, localStorage 영속. | ②⑤ | P1 |

### 1.2 MVP 제외 (Out of Scope)

- **AI 카피 대필**(인지적 위임 차단 — 영구 비목표). AI 코치(F8)는 Post-MVP, 역할 제한형.
- 멀티플레이·계정·서버 DB·결제·푸시 알림·BGM·랭킹.

---

## 2. 게임 콘텐츠 설계 (카피라이팅 → 카드)

> 모든 콘텐츠는 PDF 「카피라이팅 바이블」에서 추출. `src/data/*.ts`에 정적 시드로 저장.

### 2.1 4단계 설득 회로 (Stage)
| stage | 한글 | 목표 | AIDA |
|-------|------|------|------|
| `attention` | 주목 | 3초 안에 멈춰 세우기 | Attention |
| `trust` | 신뢰 | 의심 제거 / 신뢰 구축 | Interest |
| `value` | 가치 | "갖고 싶다" 욕구 생성 | Desire |
| `action` | 행동 | 즉시 행동 유도 | Action |

### 2.2 기법 카드 — 7가지 심리 버튼
| id | 이름 | 원리 | stage | 예시 카피 | 효과 | 적용 위치 |
|----|------|------|-------|-----------|------|-----------|
| `curiosity` | 호기심 | 정보 격차 이론 | attention | "왜 부자들은 가계부를 안 쓸까?" | 클릭률 3배 | 제목/헤드라인 |
| `orienting` | 오리엔팅 | 예상 오류 자극 | attention | "당신이 가난한 이유는 너무 열심히 일하기 때문" | 시선 집중 0.2초 | 첫 문장 |
| `social_proof` | 사회적 증거 | 동조 심리 | trust | "누적 판매 1,423건, 5차 재입고 완료" | 전환율 60–70% | 리뷰/후기 |
| `authority` | 권위 | 전문가 신뢰 | trust | "토익 만점 15회, 강남 YBM 1타 강사" | 신뢰도 65%↑ | 자격/경력 |
| `anchoring` | 참조점 | 앵커 효과 | value | "정상가 180,000 → 특별가 39,000" | 가치 인식 2배 | 가격 제시 |
| `framing` | 프레이밍 | 틀 재구성 | value | "수강료 30만 원" → "월 수익 자산 투자 30만 원" | 구매 의사 40%↑ | 가치 제안 |
| `loss_aversion` | 손실 회피 | 전망 이론 | action | "지금 안 사면 40% 할인이 사라집니다" | 구매 전환 2배 | CTA/마감 |

### 2.3 기법 카드 — 후킹 5무기 (모두 `stage: attention`)
| id | 이름 | 공식 | 예시 카피 |
|----|------|------|-----------|
| `hook_number` | 숫자로 끌어당기기 | 구체적 숫자+기간+결과 | "하루 2시간 투자로 3개월 만에 월 200만 원 버는 법" |
| `hook_reverse` | 상식 뒤집기 | 통념 부정+새 진실 | "당신이 가난한 이유는 너무 열심히 일하기 때문입니다" |
| `hook_pain` | 고민 건드리기 | 치명적 실수+손실 경고 | "이걸 모르면, 열심히 살아도 결국 가난해집니다" |
| `hook_mystery` | 궁금증 자극하기 | 놀라운 결과+숨겨진 원인 | "월 1,000만 원 버는 사람들은 '이것' 하나에 목숨 겁니다" |
| `hook_expert` | 전문성 보여주기 | 권위·기관·데이터+주장 | "워런 버핏이 주식 투자 전 반드시 체크하는 3가지" |

### 2.4 9섹션 프레임워크
| order | id | 섹션 | 목표 | stage | 권장 기법 |
|-------|----|------|------|-------|-----------|
| 1 | `hook` | 후킹 | 3초 안에 멈춰 세우기 | attention | 후킹 5무기 / 호기심 / 오리엔팅 |
| 2 | `problem` | 문제 제기 | 문제 인식 | trust | 고민 건드리기 / 오리엔팅 |
| 3 | `empathy` | 공감 | 신뢰 구축 | trust | 사회적 증거 |
| 4 | `solution` | 솔루션 | 해결책 제시(FAB) | value | 프레이밍 |
| 5 | `evidence` | 증거 | 신뢰 확보 | trust | 사회적 증거 / 권위 |
| 6 | `offer` | 오퍼 | 거절 못 할 제안 | value | 참조점 / 프레이밍 |
| 7 | `objection` | 반론 처리 | 저항 제거 | action | 권위 / 사회적 증거 |
| 8 | `urgency` | 긴급성 | 미루는 습관 끊기 | action | 손실 회피 |
| 9 | `cta` | CTA | 명확한 행동 지시 | action | 손실 회피 |

### 2.5 미션 카드 (TPPGE) — 빌더 입력
PDF의 TPPGE(Target·Goal·Problem·Emotion·Promise·USP) 사용. 예시 시드 3종:
1. 온라인 영어회화 / 영어 울렁증 직장인 / 무료체험 신청
2. 다이어트 보조제 / 30대 출산 후 여성 / 첫 구매 전환
3. 재테크 전자책 / 사회초년생 / 구매

---

## 3. 학습 과학 메커닉 매핑 (Learning Mechanics) ⭐ v2.0 신규

> 「2026 최적 학습 프로토콜」의 7원리를 코드 레벨로 어디에 구현하는지의 단일 출처.

| 원리(등급) | 구현 위치 | 핵심 규칙 |
|------------|-----------|-----------|
| ① 인출 🟢A | `RecallStep` 컴포넌트 + 모든 모드 | 정답/보기 노출 **전** `recalledText` 입력 또는 "떠올림" 확인 강제 |
| ② 분산 🟢A | `lib/srs.ts` (Leitner) | 박스 1~5, 간격 [1,2,4,7,14]일, 정답 박스+1 / 오답 박스 1로 리셋 |
| ③ 인터리빙 🟢A | `lib/deck.ts` | 카테고리 정답률 < 임계 → 블록, 이상 → 혼합 셔플 |
| ④ 손글씨 🟡C | 빌더 UI 넛지 | 강제 아님. "헤드라인은 손으로" 안내 + 인출 입력으로 대체 |
| ⑤ 수면·운동 🟢A | `lib/session.ts` | 세션 8~12분 타이머, 종료 시 복습 넛지 모달 |
| ⑥ AI 활용 🔵B | (Post-MVP) AI 코치 경계 | 카피 본문 생성 API 금지. 피드백/미션 생성만 |
| ⑦ 메타인지 🟢A | `Confidence` + `lib/calibration.ts` | 확신도(1~4) 수집 → 과신(고확신·오답) 카드 복습 우선 |

---

## 4. 기술 스택 (Tech Stack)

> 선정 기준: 백엔드 0 · 정적 배포 · 표준 스택 · 카드 인터랙션(뒤집기/드래그)·SRS 상태 관리.

| 영역 | 선택 | 사유 |
|------|------|------|
| 언어 | **TypeScript** | 타입 안정성, 에이전트 친화 |
| 프레임워크 | **React 18 + Vite** | 빠른 개발, 정적 빌드 |
| 스타일 | **Tailwind CSS** | 카드 UI·디자인 토큰 |
| 상태관리 | **Zustand (+persist)** | 세션·점수·**SRS 박스** 전역/영속 |
| 애니메이션 | **Framer Motion** | 카드 뒤집기·인출/채점 모션 |
| 드래그앤드롭 | **@dnd-kit/core** | 9섹션 배치 |
| 라우팅 | **React Router** | 모드 전환 |
| 영속화 | **localStorage** | 진행도·SRS·확신도 기록 (서버 불필요, 날짜 비교로 분산 구현) |
| 테스트 | **Vitest + RTL** | 채점·SRS·보정 로직 단위 테스트(중요) |
| 배포 | **Vercel / Netlify** | 정적, 무료 |

```bash
pnpm create vite copy-master --template react-ts
pnpm add zustand framer-motion @dnd-kit/core react-router-dom
pnpm add -D tailwindcss postcss autoprefixer vitest @testing-library/react
```

---

## 5. 데이터 구조 (Data Structures)

> `src/types/index.ts` — 카드/미션/세션 + **학습 상태(SRS·인출·확신도)** 분리.

```ts
// ===== 콘텐츠 도메인 =====
export type Stage = 'attention' | 'trust' | 'value' | 'action';
export type CardCategory = 'psych_button' | 'hook';

export interface TechniqueCard {
  id: string;
  category: CardCategory;
  name: string;
  principle: string;
  stage: Stage;
  example: string;
  effect: string;
  position?: string;     // 심리 버튼만
  icon: string;
  tip: string;
}

export interface FrameworkSection {
  order: number;
  id: string;
  name: string;
  goal: string;
  stage: Stage;
  recommendedCardIds: string[]; // 채점 정답 후보(복수 허용)
  modelCopy: string;            // 모범 카피(인출 후 공개)
}

export interface MissionCard {
  id: string; product: string; target: string; goal: string;
  problem: string; emotion: string; promise: string; usp: string;
}

export interface QuizQuestion {
  id: string;
  prompt: string;          // 예시 카피
  answerCardId: string;    // 정답 기법
  choiceCardIds: string[]; // 보기 4개(정답 포함)
  explanation: string;
}

// ===== 학습 과학 상태 (v2.0 신규) =====

// ⑦ 메타인지: 확신도 1(찍음)~4(확실)
export type Confidence = 1 | 2 | 3 | 4;

// ① 인출 1회 시도
export interface RecallAttempt {
  itemId: string;          // cardId 또는 sectionId
  recalledText?: string;   // 백지 인출 입력(선택)
  confidence: Confidence;  // ⑦
  correct: boolean;
  overconfident: boolean;  // 확신도>=3 && !correct → 착각 경고
  attemptedAt: number;
}

// ② 분산: 카드별 Leitner 박스 상태
export interface CardMastery {
  cardId: string;
  box: 1 | 2 | 3 | 4 | 5;  // 박스 높을수록 숙련
  dueAt: number;           // 다음 복습 예정(timestamp)
  lastReviewedAt: number;
  streak: number;          // 연속 정답
  lapses: number;          // 누적 오답
}

// ===== 게임 세션 / 진행 =====
export type GameMode = 'codex' | 'quiz' | 'builder' | 'review';
export type Grade = 'F' | 'D' | 'C' | 'B' | 'A' | 'S';

export interface BuilderPlacement {
  sectionId: string;
  placedCardId: string | null;
  writtenCopy?: string;    // ① 사용자가 직접 쓴 카피(선택)
}

export interface RoundResult {
  mode: GameMode;
  score: number;           // 0~100
  grade: Grade;
  detail: Record<string, boolean>;
  attempts: RecallAttempt[];
  completedAt: number;
}

export interface PlayerProgress {
  highScores: Record<GameMode, number>;
  totalPlays: number;
  mastery: Record<string, CardMastery>; // ② cardId → 박스 상태
  streakDays: number;                    // ⑤ 연속 학습일
  lastPlayedDate: string;                // 'YYYY-MM-DD'
  unlockedBadges: string[];
  history: RoundResult[];
}
```

### 5.1 분산 복습 — Leitner SRS (`lib/srs.ts`) ⭐ 원리②

```ts
const BOX_INTERVAL_DAYS = [0, 1, 2, 4, 7, 14]; // index = box(1~5)
const DAY = 24 * 60 * 60 * 1000;

// 복습 결과를 박스에 반영
export function updateMastery(m: CardMastery, correct: boolean, now: number): CardMastery {
  const box = correct ? Math.min(5, m.box + 1) : 1; // 오답이면 박스 1로 리셋
  return {
    ...m, box,
    dueAt: now + BOX_INTERVAL_DAYS[box] * DAY,
    lastReviewedAt: now,
    streak: correct ? m.streak + 1 : 0,
    lapses: correct ? m.lapses : m.lapses + 1,
  };
}

// 오늘 복습할 카드 = dueAt <= now
export function getDueCards(mastery: Record<string, CardMastery>, now: number): string[] {
  return Object.values(mastery).filter(m => m.dueAt <= now).map(m => m.cardId);
}
```

### 5.2 메타인지 보정 (`lib/calibration.ts`) ⭐ 원리⑦

```ts
export function isOverconfident(a: { confidence: Confidence; correct: boolean }): boolean {
  return a.confidence >= 3 && !a.correct; // 확신했는데 틀림 = 착각
}

// 보정 리포트: 과신/과소 건수 + 보정 정확도(확신과 정답 일치율)
export function calibrationReport(attempts: RecallAttempt[]) {
  const overconfident = attempts.filter(a => a.confidence >= 3 && !a.correct).length;
  const underconfident = attempts.filter(a => a.confidence <= 2 && a.correct).length;
  const aligned = attempts.filter(a => (a.confidence >= 3) === a.correct).length;
  return { overconfident, underconfident, accuracy: aligned / (attempts.length || 1) };
}
```

### 5.3 적응형 덱 — 블록→인터리빙 (`lib/deck.ts`) ⭐ 원리③

```ts
const INTERLEAVE_THRESHOLD = 0.8; // 카테고리 정답률 80% 이상이면 혼합

export function buildDeck(
  cards: TechniqueCard[],
  accuracyByCategory: Record<CardCategory, number>
): TechniqueCard[] {
  const mastered = (c: TechniqueCard) =>
    (accuracyByCategory[c.category] ?? 0) >= INTERLEAVE_THRESHOLD;
  const newCards = cards.filter(c => !mastered(c));   // 블록(카테고리별 정렬 유지)
  const mixCards = shuffle(cards.filter(mastered));   // 혼합(인터리빙)
  return [...newCards, ...mixCards];
}
```

### 5.4 빌더 채점 + 등급 (`lib/scoring.ts`)

```ts
export function scoreBuilder(placements: BuilderPlacement[], sections: FrameworkSection[]): number {
  const correct = placements.filter(p => {
    const sec = sections.find(s => s.id === p.sectionId);
    return p.placedCardId && sec?.recommendedCardIds.includes(p.placedCardId);
  }).length;
  return Math.round((correct / sections.length) * 100);
}

export function toGrade(score: number): Grade {
  if (score >= 95) return 'S';
  if (score >= 85) return 'A';
  if (score >= 70) return 'B';
  if (score >= 55) return 'C';
  if (score >= 40) return 'D';
  return 'F';
}
```

---

## 6. UI · UX 흐름 (UX Flow)

### 6.1 화면 맵
```
[홈]  (오늘 복습 N장 · 연속일 streak · 추천 모드)
   ├─ 오늘의 복습 (review)   → due 카드 인출 → SRS 박스 갱신
   ├─ 카드 도감 (codex)      → 카드 확인 → 덮고 떠올리기
   ├─ 인출 퀴즈 (quiz)       → 인출→확신도→보기→피드백
   ├─ 9섹션 빌더 (builder)   → 미션→인출/배치→채점→미리보기
   └─ 내 기록 (progress)     → 숙련도/보정 리포트/배지
```

### 6.2 핵심 학습 루프 (모든 모드 공통) ⭐
```
제시(카피/섹션)
   ↓ ① 백지 인출: recalledText 입력 또는 "떠올렸다" 확인  ← 보기/정답 노출 차단
   ↓ ⑦ 확신도(1~4) 선택
   ↓ 정답 확인(보기 선택 or 배치)
   ↓ ① 즉시 피드백 + 모범 카피 + 원리 공개
   ↓ ② updateMastery() → SRS 박스 이동 / 착각 카드 우선 큐
```

### 6.3 9섹션 빌더 (Flagship)
```
1) 미션 카드 공개 (TPPGE)
2) 9섹션 보드 + 핸드(기법 카드). 섹션별로 "어떤 기법?" 먼저 인출
3) [dnd-kit] 카드 배치 (+선택: writtenCopy 직접 작성, 헤드라인 손글씨 넛지)
4) '카피 완성' → scoreBuilder 채점
5) 섹션별 ✓/✗ + 모범 카피 공개 + 확신도 보정 리포트
6) '완성 미리보기' → 9섹션을 한 편 상세페이지로 렌더
7) 진행도/SRS 저장 → 세션 페이싱 넛지("자고 내일 복습")
```

### 6.4 UX 원칙
- **인출 우선**: 보기/정답은 스스로 떠올린 뒤에만 노출(유창함의 착각 차단).
- **틀려도 배운다**: 채점 후 항상 모범 카피 + 원리(피드백 동반 인출).
- **바람직한 어려움**: 약간 어렵게. 단 초반은 블록·힌트로 보호.
- **세션 페이싱**: 8~12분, 종료 시 분산 복습 넛지.
- **모바일 우선**, 화면당 핵심 액션 1개, 터치 영역 44px+.

---

## 7. 컴포넌트 / 디렉토리 구조

```
src/
├─ data/
│  ├─ techniqueCards.ts     # 12장 기법 카드 (2.2+2.3)
│  ├─ sections.ts           # 9섹션 + recommendedCardIds + modelCopy
│  ├─ missions.ts           # 미션 시드
│  └─ quizQuestions.ts      # 인출 퀴즈 문항
├─ types/
│  └─ index.ts              # 콘텐츠 + 학습상태 타입
├─ store/
│  └─ gameStore.ts          # Zustand persist: 세션·점수·mastery·streak
├─ lib/
│  ├─ scoring.ts            # scoreBuilder / toGrade
│  ├─ srs.ts                # ② Leitner: updateMastery / getDueCards
│  ├─ calibration.ts        # ⑦ 확신도 보정 리포트
│  ├─ deck.ts               # ③ 블록→인터리빙 적응형 덱
│  └─ session.ts            # ⑤ 세션 타이머·복습 넛지·streak 갱신
├─ components/
│  ├─ Card.tsx              # 뒤집기 카드 (Framer Motion)
│  ├─ RecallStep.tsx        # ① 백지 인출 입력/확인 (보기 노출 게이트)
│  ├─ ConfidenceMeter.tsx   # ⑦ 확신도 1~4 선택
│  ├─ SectionSlot.tsx       # 9섹션 드롭 슬롯 (dnd-kit)
│  ├─ Hand.tsx              # 핸드(드래그 소스)
│  ├─ MissionPanel.tsx      # 미션 카드
│  ├─ ResultModal.tsx       # 점수/등급/모범 카피/보정 리포트
│  ├─ CopyPreview.tsx       # 완성 상세페이지 미리보기
│  └─ ReviewNudge.tsx       # ⑤ "자고 내일 복습" 넛지
├─ pages/
│  ├─ Home.tsx              # 오늘 복습 N장 · streak · 추천
│  ├─ Review.tsx            # F5 오늘의 복습(SRS)
│  ├─ Codex.tsx             # F1
│  ├─ Quiz.tsx              # F2
│  ├─ Builder.tsx           # F3
│  └─ Progress.tsx          # F4/F9
├─ App.tsx
└─ main.tsx
```

---

## 8. 개발 단계 (Build Milestones)

| 단계 | 산출물 | 완료 기준 |
|------|--------|-----------|
| **M0 셋업** | Vite+TS+Tailwind+라우팅 | 빈 화면 라우팅 동작 |
| **M1 도감+인출(F1)** | `data/*`, `Card`, `RecallStep`, `Codex` | 카드 열람 후 덮고 떠올리기 동작 |
| **M2 인출 퀴즈+보정(F2·F4)** | `Quiz`, `ConfidenceMeter`, `calibration.ts` | 인출→확신도→보기→피드백+보정 리포트 |
| **M3 9섹션 빌더(F3)** | dnd-kit 배치+채점+미리보기 | 미션→인출/배치→채점→모범카피 풀 루프 |
| **M4 분산 SRS(F5)** | `srs.ts`, `Review`, store persist | due 카드 재등장·박스 이동·새로고침 유지 |
| **M5 적응형·페이싱·진행(F6·F7·F9)** | `deck.ts`, `session.ts`, `Progress` | 블록→혼합 전환, 세션 넛지, 배지·streak |

**MVP DoD**: F1~F5 동작 + **백지 인출 루프**와 **Leitner 복습 큐**가 실제로 돌고,
모바일에서 8~12분 세션 완주 가능. 채점/SRS/보정 로직은 Vitest 단위 테스트 통과.

---

## 9. 향후 확장 (Post-MVP)
- **AI 학습 코치(F8)**: 미션 생성·카피 피드백·약점 진단만. **카피 대필 금지**(Claude API, 원리⑥).
- **푸시 알림 분산 복습**(원리②), **스와이프·필사 모드**(원리④), **퍼널/육성 모드**, **카피 배틀(멀티)**, **카드 확장팩(PAS·FAB·4U)**.

---

### 부록 A. 참고 프레임워크 (콘텐츠 근거)
- **AIDA / 9섹션 / TPPGE / FAB / PAS / Cialdini / 4U** — 카드·섹션 콘텐츠의 근거(PDF).

### 부록 B. 학습 과학 근거 (설계 근거)
- ① 인출·② 분산 🟢A: Dunlosky et al.(2013), Murray et al.(2025).
- ③ 인터리빙 🟢A(조건부): Brunmair & Richter(2019) — 유사 재료에 효과, 블록 선행.
- ⑦ 메타인지 🟢A: Yang et al.(2022), Bjork & Bjork(바람직한 어려움).
- ⑥ AI 활용 🔵B: 능동 협업은 증폭, 수동 위임은 손상 → **카피 대필 금지** 설계 근거.
- (상세 DOI·등급은 「2026 최적 학습 프로토콜」 자료 참조)
