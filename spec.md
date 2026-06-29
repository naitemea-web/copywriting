# 카피 마스터 (Copy Master) — 카피라이팅 입문 카드게임 spec.md

> AI 코딩 에이전트(Claude Code · Cursor)가 그대로 구현할 수 있도록 작성한 MVP 명세서.
> 출처: 첨부 PDF **「카피라이팅 바이블」** + 검증된 카피라이팅 프레임워크(AIDA / PAS / FAB / Cialdini 설득 원칙).

---

## 0. 한 줄 요약

> **"카드를 모으고, 후킹을 맞추고, 9섹션으로 한 편의 카피를 완성하며 배우는 카피라이팅 입문 웹 카드게임."**

- **타겟**: 카피라이팅 입문자(비전공자 · AI 1인창업 · 마케팅 주니어)
- **목표**: 추상적인 "글 잘 쓰는 법"을 **카드 = 기법** 으로 손에 잡히게 만들고, 게임 루프로 반복 학습시킨다.
- **MVP 한 문장**: 백엔드 없이 동작하는 싱글플레이 웹앱. 카드 도감 → 후킹 퀴즈 → 9섹션 빌더 3개 모드로 핵심 기법을 체득한다.

---

## 1. 핵심 기능 리스트 (Core Features)

### 1.1 MVP 범위 (반드시 포함)

| # | 기능 | 설명 | 우선순위 |
|---|------|------|----------|
| F1 | **카드 도감 (Card Codex)** | 12장 기법 카드(7 심리 버튼 + 5 후킹 무기)를 카드 형태로 열람. 앞면(이름/아이콘) → 뒤집기 → 뒷면(원리/예시/효과). | P0 |
| F2 | **후킹 퀴즈 (Hook Quiz)** | 예시 카피 1줄 제시 → "어떤 기법인가?" 4지선다. 3초 후킹 감각 + 기법 식별 훈련. 정답 시 해설 카드 공개. | P0 |
| F3 | **9섹션 빌더 (9-Section Builder)** | 미션(상품·타겟·목표) 제시 → 9개 섹션 슬롯에 알맞은 기법 카드를 배치 → 채점 + 모범 카피 공개 → 완성 상세페이지 미리보기. | P0 |
| F4 | **점수 · 등급 · 진행도** | 라운드별 점수 합산, 등급(F~S), localStorage에 진행도/최고점 저장. | P0 |
| F5 | **결과 피드백 & 학습 카드** | 오답/저득점 시 "왜 틀렸는지" + 관련 원리 카드 재노출. | P1 |
| F6 | **배지/도전과제** | "스와이프 100", "헤드라인 10개" 등 PDF 로드맵 기반 가벼운 메타 보상. | P1 |

### 1.2 MVP 제외 (Out of Scope — 향후 확장)

- 멀티플레이 / 실시간 대전, 로그인·계정·서버 DB
- AI(LLM) 기반 카피 자동 채점 (MVP는 **태그 매칭 룰 기반 채점**)
- 결제 / 카드 구매 / 가챠, 사운드 BGM, 리더보드 랭킹

---

## 2. 게임 콘텐츠 설계 (카피라이팅 → 카드)

> 모든 콘텐츠는 PDF 「카피라이팅 바이블」에서 추출. 데이터는 `src/data/*.ts`에 정적 시드로 저장한다.

### 2.1 4단계 설득 회로 (Stage)

게임 전체를 관통하는 분류 축. 카드·섹션·미션 모두 이 `stage`를 키로 매칭한다.

| stage | 한글 | 목표 | AIDA |
|-------|------|------|------|
| `attention` | 주목 | 3초 안에 멈춰 세우기 | Attention |
| `trust` | 신뢰 | 의심 제거 / 신뢰 구축 | Interest |
| `value` | 가치 | "갖고 싶다" 욕구 생성 | Desire |
| `action` | 행동 | 즉시 행동 유도 | Action |

### 2.2 기법 카드 — 7가지 심리 버튼 (Psychological Buttons)

| id | 이름 | 원리 | stage | 예시 카피 | 효과 | 적용 위치 |
|----|------|------|-------|-----------|------|-----------|
| `curiosity` | 호기심 | 정보 격차 이론 | attention | "왜 부자들은 가계부를 안 쓸까?" | 클릭률 3배 | 제목/헤드라인 |
| `orienting` | 오리엔팅 | 예상 오류 자극 | attention | "당신이 가난한 이유는 너무 열심히 일하기 때문" | 시선 집중 0.2초 | 첫 문장 |
| `social_proof` | 사회적 증거 | 동조 심리 | trust | "누적 판매 1,423건, 5차 재입고 완료" | 전환율 60–70% | 리뷰/후기 |
| `authority` | 권위 | 전문가 신뢰 | trust | "토익 만점 15회, 강남 YBM 1타 강사" | 신뢰도 65%↑ | 자격/경력 |
| `anchoring` | 참조점 | 앵커 효과 | value | "정상가 180,000 → 특별가 39,000" | 가치 인식 2배 | 가격 제시 |
| `framing` | 프레이밍 | 틀 재구성 | value | "수강료 30만 원" → "월 수익 자산 투자 30만 원" | 구매 의사 40%↑ | 가치 제안 |
| `loss_aversion` | 손실 회피 | 전망 이론 | action | "지금 안 사면 40% 할인이 사라집니다" | 구매 전환 2배 | CTA/마감 |

### 2.3 기법 카드 — 후킹 5무기 (Hook Weapons)

| id | 이름 | 공식 | 예시 카피 |
|----|------|------|-----------|
| `hook_number` | 숫자로 끌어당기기 | 구체적 숫자 + 기간 + 결과 | "하루 2시간 투자로 3개월 만에 월 200만 원 버는 법" |
| `hook_reverse` | 상식 뒤집기 | 통념 부정 + 새로운 진실 | "당신이 가난한 이유는 너무 열심히 일하기 때문입니다" |
| `hook_pain` | 고민 건드리기 | 치명적 실수 + 손실 경고 | "이걸 모르면, 열심히 살아도 결국 가난해집니다" |
| `hook_mystery` | 궁금증 자극하기 | 놀라운 결과 + 숨겨진 원인 | "월 1,000만 원 버는 사람들은 '이것' 하나에 목숨 겁니다" |
| `hook_expert` | 전문성 보여주기 | 권위·기관·데이터 + 주장 | "워런 버핏이 주식 투자 전 반드시 체크하는 3가지" |

> 후킹 5무기는 모두 `stage: attention` (1번 후킹 섹션 전용).

### 2.4 9섹션 프레임워크 (한 편 완성 설계도)

> 빌더 모드의 보드. 각 섹션은 권장 `stage`와 정답 기법 후보(`recommendedCards`)를 가진다.

| order | id | 섹션 | 목표 | stage | 권장 기법 |
|-------|----|------|------|-------|-----------|
| 1 | `hook` | 후킹 | 3초 안에 멈춰 세우기 | attention | 후킹 5무기 / 호기심 / 오리엔팅 |
| 2 | `problem` | 문제 제기 | 문제 인식 | trust | 고민 건드리기 / 오리엔팅 |
| 3 | `empathy` | 공감 | 신뢰 구축 ("나도 그랬어") | trust | 사회적 증거 |
| 4 | `solution` | 솔루션 | 해결책 제시 (FAB: 기능→혜택) | value | 프레이밍 |
| 5 | `evidence` | 증거 | 신뢰 확보 (데이터/후기/권위) | trust | 사회적 증거 / 권위 |
| 6 | `offer` | 오퍼 | 거절 못 할 제안 (앵커·보너스) | value | 참조점 / 프레이밍 |
| 7 | `objection` | 반론 처리 | 저항 제거 | action | 권위 / 사회적 증거 |
| 8 | `urgency` | 긴급성 | 미루는 습관 끊기 (희소성) | action | 손실 회피 |
| 9 | `cta` | CTA | 명확한 행동 지시 | action | 손실 회피 |

### 2.5 미션 카드 (Mission Cards) — 빌더 모드 입력

PDF의 TPPGE 체크리스트(Target·Goal·Problem·Emotion·Promise·USP)를 미션 필드로 사용.

예시 시드 3종:
1. **온라인 영어회화** / 타겟: 영어 울렁증 직장인 / 목표: 무료체험 신청
2. **다이어트 보조제** / 타겟: 30대 출산 후 여성 / 목표: 첫 구매 전환
3. **재테크 전자책** / 타겟: 사회초년생 / 목표: 구매

---

## 3. 기술 스택 (Tech Stack)

> 선정 기준: **백엔드 0(제로) · 정적 배포 가능 · AI 에이전트가 익숙한 표준 스택 · 카드 인터랙션(뒤집기/드래그)에 강한 라이브러리.**

| 영역 | 선택 | 사유 |
|------|------|------|
| 언어 | **TypeScript** | 카드/데이터 타입 안정성, AI 에이전트 친화적 |
| 프레임워크 | **React 18 + Vite** | 빠른 개발, 정적 빌드 |
| 스타일 | **Tailwind CSS** | 카드 UI 빠르게, 디자인 토큰 일관성 |
| 상태관리 | **Zustand** | 가벼움. 게임 세션/점수/진행도 전역 관리 |
| 애니메이션 | **Framer Motion** | 카드 뒤집기, 등장/채점 모션 |
| 드래그앤드롭 | **@dnd-kit/core** | 9섹션 빌더의 카드 → 슬롯 배치 |
| 라우팅 | **React Router** | 모드 간 화면 전환 |
| 영속화 | **localStorage** (Zustand persist) | 진행도/최고점/배지 저장, 서버 불필요 |
| 테스트 | **Vitest + React Testing Library** | 채점 로직 등 단위 테스트 |
| 배포 | **Vercel / Netlify** (정적) | 무료, 푸시 시 자동 배포 |
| 패키지 매니저 | **pnpm** (또는 npm) | — |

```bash
# 초기 셋업 예시
pnpm create vite copy-master --template react-ts
pnpm add zustand framer-motion @dnd-kit/core react-router-dom
pnpm add -D tailwindcss postcss autoprefixer vitest @testing-library/react
```

---

## 4. 데이터 구조 (Data Structures)

> `src/types/index.ts` — 모든 도메인 타입. 카드/미션/세션을 명확히 분리.

```ts
// 4단계 설득 회로
export type Stage = 'attention' | 'trust' | 'value' | 'action';

// 카드 분류
export type CardCategory = 'psych_button' | 'hook';

// 기법 카드 (도감 · 퀴즈 · 빌더 공용)
export interface TechniqueCard {
  id: string;                 // 'curiosity', 'hook_number' ...
  category: CardCategory;     // 'psych_button' | 'hook'
  name: string;               // '호기심'
  principle: string;          // '정보 격차 이론'
  stage: Stage;               // 'attention'
  example: string;            // 예시 카피 한 줄
  effect: string;             // '클릭률 3배'
  position?: string;          // '제목/헤드라인' (심리 버튼만)
  icon: string;               // 이모지 또는 아이콘 키
  tip: string;                // 한 줄 적용 팁
}

// 9섹션 보드의 한 칸
export interface FrameworkSection {
  order: number;              // 1~9
  id: string;                 // 'hook', 'problem' ...
  name: string;               // '후킹'
  goal: string;               // '3초 안에 멈춰 세우기'
  stage: Stage;
  recommendedCardIds: string[]; // 정답 후보 카드 id 배열 (채점 기준)
  modelCopy: string;          // 모범 카피 예시 (정답 공개용)
}

// 미션 카드 (빌더 입력 — TPPGE)
export interface MissionCard {
  id: string;
  product: string;            // 상품
  target: string;             // Target: 누구에게
  goal: string;               // Goal: 어떤 행동
  problem: string;            // Problem: 진짜 고통
  emotion: string;            // Emotion: 현재 감정 온도
  promise: string;            // Promise: 어떤 변화
  usp: string;                // USP: 독보적 가치
}

// 후킹 퀴즈 1문항
export interface QuizQuestion {
  id: string;
  prompt: string;             // 예시 카피
  answerCardId: string;       // 정답 기법 id
  choiceCardIds: string[];    // 보기 4개 (정답 포함)
  explanation: string;        // 해설
}

// ---- 게임 세션 / 진행 상태 (Zustand store) ----

export type GameMode = 'codex' | 'quiz' | 'builder';
export type Grade = 'F' | 'D' | 'C' | 'B' | 'A' | 'S';

export interface BuilderPlacement {
  sectionId: string;
  placedCardId: string | null;
}

export interface RoundResult {
  mode: GameMode;
  score: number;              // 0~100
  grade: Grade;
  detail: Record<string, boolean>; // 섹션/문항별 정오
  completedAt: number;        // Date.now()
}

export interface PlayerProgress {
  highScores: Record<GameMode, number>;
  totalPlays: number;
  unlockedBadges: string[];
  history: RoundResult[];
}
```

### 4.1 채점 로직 (룰 기반, MVP 핵심)

```ts
// 빌더: 섹션마다 배치된 카드가 recommendedCardIds에 포함되면 정답
function scoreBuilder(
  placements: BuilderPlacement[],
  sections: FrameworkSection[]
): number {
  const correct = placements.filter(p => {
    const sec = sections.find(s => s.id === p.sectionId);
    return p.placedCardId && sec?.recommendedCardIds.includes(p.placedCardId);
  }).length;
  return Math.round((correct / sections.length) * 100);
}

function toGrade(score: number): Grade {
  if (score >= 95) return 'S';
  if (score >= 85) return 'A';
  if (score >= 70) return 'B';
  if (score >= 55) return 'C';
  if (score >= 40) return 'D';
  return 'F';
}
```

---

## 5. UI · UX 흐름 (UX Flow)

### 5.1 화면 맵 (Screen Map)

```
[홈/메인 메뉴]
   ├─ 카드 도감 (codex)        → 12장 카드 그리드 → 카드 상세(뒤집기)
   ├─ 후킹 퀴즈 (quiz)         → 문항 → 채점 → 결과 → (다음/종료)
   ├─ 9섹션 빌더 (builder)     → 미션 공개 → 카드 배치 → 채점 → 완성 미리보기
   └─ 내 기록 (progress)       → 최고점/배지/히스토리
```

### 5.2 메인 게임 루프 — 9섹션 빌더 (Flagship)

```
1) 미션 카드 공개      "온라인 영어회화 / 영어 울렁증 직장인 / 무료체험 신청"
        ↓
2) 하단 핸드(기법 카드 12장) + 상단 9섹션 보드(빈 슬롯) 표시
        ↓
3) [드래그앤드롭] 카드를 섹션 슬롯에 배치 (dnd-kit)
        ↓
4) '카피 완성' 버튼 → 룰 기반 채점
        ↓
5) 결과: 점수/등급 + 섹션별 ✓/✗ + 각 섹션 모범 카피 공개
        ↓
6) '완성 상세페이지 미리보기' → 9섹션 모범 카피를 세로로 이어 한 편으로 렌더
        ↓
7) 진행도 저장(localStorage) → 배지 체크 → [다시하기 / 메뉴]
```

### 5.3 후킹 퀴즈 루프

```
예시 카피 1줄 카드 등장 → 4지선다(기법 카드) →
선택 → 즉시 정/오답 피드백 + 해설 카드 플립 → 다음 문항 (총 5문항/세트)
```

### 5.4 UX 원칙

- **모바일 우선(Mobile-first)**: 카드게임은 한 손 세로 화면 기준. 카드 최소 터치 영역 44px+.
- **즉각 피드백**: 모든 선택에 0.3초 내 모션/색 변화(정답=초록, 오답=빨강).
- **학습 = 보상**: 채점 후 항상 "모범 카피 + 원리"를 보여줘 틀려도 배우게 한다.
- **3탭 이내 진입**: 홈 → 모드 → 플레이.
- **저글링 금지**: 화면당 1개 핵심 액션.

---

## 6. 컴포넌트 / 디렉토리 구조

```
src/
├─ data/
│  ├─ techniqueCards.ts     # 12장 기법 카드 시드 (2.2 + 2.3)
│  ├─ sections.ts           # 9섹션 + recommendedCardIds + modelCopy
│  ├─ missions.ts           # 미션 카드 시드 3종
│  └─ quizQuestions.ts      # 후킹 퀴즈 문항 시드
├─ types/
│  └─ index.ts              # 4장의 타입 정의
├─ store/
│  └─ gameStore.ts          # Zustand: 세션/점수/진행도 (persist)
├─ lib/
│  └─ scoring.ts            # scoreBuilder / scoreQuiz / toGrade
├─ components/
│  ├─ Card.tsx              # 뒤집기 가능한 기법 카드 (Framer Motion)
│  ├─ SectionSlot.tsx       # 9섹션 드롭 슬롯 (dnd-kit)
│  ├─ Hand.tsx              # 하단 핸드(드래그 소스)
│  ├─ MissionPanel.tsx      # 미션 카드 표시
│  ├─ ResultModal.tsx       # 점수/등급/모범 카피
│  └─ CopyPreview.tsx       # 완성 상세페이지 미리보기
├─ pages/
│  ├─ Home.tsx
│  ├─ Codex.tsx             # F1 카드 도감
│  ├─ Quiz.tsx              # F2 후킹 퀴즈
│  ├─ Builder.tsx           # F3 9섹션 빌더
│  └─ Progress.tsx          # F4/F6 기록·배지
├─ App.tsx                  # 라우팅
└─ main.tsx
```

---

## 7. 개발 단계 (Build Milestones)

| 단계 | 산출물 | 완료 기준 |
|------|--------|-----------|
| **M0 셋업** | Vite+TS+Tailwind+라우팅 골격 | 빈 4개 페이지 라우팅 동작 |
| **M1 데이터+도감(F1)** | `data/*.ts`, `Card.tsx`, `Codex.tsx` | 12장 카드 뒤집기 열람 가능 |
| **M2 후킹 퀴즈(F2)** | `Quiz.tsx`, `scoring.ts` | 5문항 풀이 + 채점 + 해설 |
| **M3 9섹션 빌더(F3)** | dnd-kit 배치 + 채점 + 미리보기 | 미션→배치→점수→모범카피 풀 루프 |
| **M4 진행도/배지(F4·F6)** | Zustand persist, `Progress.tsx` | 새로고침 후 최고점/배지 유지 |
| **M5 폴리시(F5)** | 모션·반응형·오답 피드백 | 모바일에서 끊김 없이 플레이 |

---

## 8. 향후 확장 (Post-MVP Vision)

- **AI 채점**: LLM으로 플레이어가 직접 쓴 카피를 9섹션 기준 평가(Claude API).
- **스와이프 파일**: 성공 카피 수집/필사 모드(PDF 초급 로드맵).
- **육성 시퀀스/퍼널 모드**: 5단계 퍼널·육성 레터 3~5통 설계 게임(중급).
- **멀티플레이 카피 배틀**: 같은 미션에 서로 카피 작성 → 투표.
- **카드 확장팩**: FAB·PAS·4U 등 추가 프레임워크 카드.

---

### 부록 A. 참고 프레임워크 (카드 콘텐츠 근거)

- **AIDA** (Attention·Interest·Desire·Action) — 4단계 설득 회로의 뼈대 (PDF).
- **PAS** (Problem·Agitate·Solution) — 9섹션의 문제→공감→솔루션 흐름.
- **FAB** (Feature·Advantage·Benefit) — 솔루션 섹션 "기능이 아닌 변화를 팔아라".
- **Cialdini 설득 6원칙** — 사회적 증거·권위·희소성이 7 심리 버튼과 직결.
- **4U** (Useful·Urgent·Unique·Ultra-specific) — 후킹 5무기의 평가 기준.
