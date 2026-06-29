import type { CardCategory, CardMastery, TechniqueCard } from '@/types';

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

// 카테고리별 정답률(0~1) — Leitner 박스를 숙련도 프록시로 사용. box1→0, box5→1.
export function categoryAccuracy(
  mastery: Record<string, CardMastery>,
  cards: TechniqueCard[]
): Record<CardCategory, number> {
  const acc: Record<CardCategory, { sum: number; n: number }> = {
    psych_button: { sum: 0, n: 0 },
    hook: { sum: 0, n: 0 },
  };
  for (const c of cards) {
    const m = mastery[c.id];
    acc[c.category].sum += m ? (m.box - 1) / 4 : 0;
    acc[c.category].n += 1;
  }
  return {
    psych_button: acc.psych_button.n ? acc.psych_button.sum / acc.psych_button.n : 0,
    hook: acc.hook.n ? acc.hook.sum / acc.hook.n : 0,
  };
}

// 블록→혼합 모드 판정: 두 카테고리 모두 임계 이상이면 '혼합(인터리빙)'.
export function deckMode(accuracyByCategory: Record<CardCategory, number>): 'block' | 'interleave' {
  const all = Object.values(accuracyByCategory).every((a) => a >= INTERLEAVE_THRESHOLD);
  return all ? 'interleave' : 'block';
}
