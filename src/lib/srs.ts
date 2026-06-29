import type { CardMastery } from '@/types';

// ② 분산 반복 — Leitner 5박스. index = box(1~5), 간격(일).
export const BOX_INTERVAL_DAYS = [0, 1, 2, 4, 7, 14] as const;
export const DAY = 24 * 60 * 60 * 1000;

// 신규 카드의 초기 mastery (모든 카드 박스1, 즉시 due)
export function initMastery(cardId: string, now: number): CardMastery {
  return { cardId, box: 1, dueAt: now, lastReviewedAt: now, streak: 0, lapses: 0 };
}

// 복습 결과를 박스에 반영. 정답이면 박스+1, 오답이면 박스1로 리셋.
export function updateMastery(m: CardMastery, correct: boolean, now: number): CardMastery {
  const box = (correct ? Math.min(5, m.box + 1) : 1) as CardMastery['box'];
  return {
    ...m,
    box,
    dueAt: now + BOX_INTERVAL_DAYS[box] * DAY,
    lastReviewedAt: now,
    streak: correct ? m.streak + 1 : 0,
    lapses: correct ? m.lapses : m.lapses + 1,
  };
}

// 오늘 복습할 카드 = dueAt <= now
export function getDueCards(mastery: Record<string, CardMastery>, now: number): string[] {
  return Object.values(mastery)
    .filter((m) => m.dueAt <= now)
    .map((m) => m.cardId);
}
