import type { CardCategory, TechniqueCard } from '@/types';

// ③ 인터리빙 — 카테고리 정답률이 임계 이상이면 혼합(섞기), 미만이면 블록(묶음).
export const INTERLEAVE_THRESHOLD = 0.8;

// 결정적 셔플(시드 기반) — Date.now()/Math.random() 의존 없이 테스트 가능.
export function shuffle<T>(items: T[], seed = 1): T[] {
  const arr = [...items];
  let s = seed;
  for (let i = arr.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff; // LCG
    const j = s % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function buildDeck(
  cards: TechniqueCard[],
  accuracyByCategory: Record<CardCategory, number>,
  seed = 1
): TechniqueCard[] {
  const mastered = (c: TechniqueCard) =>
    (accuracyByCategory[c.category] ?? 0) >= INTERLEAVE_THRESHOLD;
  const newCards = cards.filter((c) => !mastered(c)); // 블록(원래 순서 유지)
  const mixCards = shuffle(cards.filter(mastered), seed); // 혼합(인터리빙)
  return [...newCards, ...mixCards];
}
