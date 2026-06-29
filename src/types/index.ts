// 카피 마스터 도메인 타입 — spec.md §5 단일 출처.
// 콘텐츠(카드/섹션/미션) + 학습 상태(SRS·인출·확신도)를 분리한다.

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
  position?: string; // 심리 버튼만
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
  modelCopy: string; // 모범 카피(인출 후 공개)
}

export interface MissionCard {
  id: string;
  product: string;
  target: string;
  goal: string;
  problem: string;
  emotion: string;
  promise: string;
  usp: string;
}

export interface QuizQuestion {
  id: string;
  prompt: string; // 예시 카피
  answerCardId: string; // 정답 기법
  choiceCardIds: string[]; // 보기 4개(정답 포함)
  explanation: string;
}

// ===== 학습 과학 상태 =====

// ⑦ 메타인지: 확신도 1(찍음)~4(확실)
export type Confidence = 1 | 2 | 3 | 4;

// ① 인출 1회 시도
export interface RecallAttempt {
  itemId: string; // cardId 또는 sectionId
  recalledText?: string; // 백지 인출 입력(선택)
  confidence: Confidence;
  correct: boolean;
  overconfident: boolean; // 확신도>=3 && !correct → 착각 경고
  attemptedAt: number;
}

// ② 분산: 카드별 Leitner 박스 상태
export interface CardMastery {
  cardId: string;
  box: 1 | 2 | 3 | 4 | 5;
  dueAt: number; // 다음 복습 예정(timestamp)
  lastReviewedAt: number;
  streak: number; // 연속 정답
  lapses: number; // 누적 오답
}

// ===== 게임 세션 / 진행 =====
export type GameMode = 'codex' | 'quiz' | 'builder' | 'review';
export type Grade = 'F' | 'D' | 'C' | 'B' | 'A' | 'S';

export interface BuilderPlacement {
  sectionId: string;
  placedCardId: string | null;
  writtenCopy?: string; // ① 사용자가 직접 쓴 카피(선택)
}

export interface RoundResult {
  mode: GameMode;
  score: number; // 0~100
  grade: Grade;
  detail: Record<string, boolean>;
  attempts: RecallAttempt[];
  completedAt: number;
}

export interface PlayerProgress {
  highScores: Record<GameMode, number>;
  totalPlays: number;
  mastery: Record<string, CardMastery>; // cardId → 박스 상태
  streakDays: number;
  lastPlayedDate: string; // 'YYYY-MM-DD'
  unlockedBadges: string[];
  history: RoundResult[];
}
