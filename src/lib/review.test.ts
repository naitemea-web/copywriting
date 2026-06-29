import { describe, expect, it } from 'vitest';
import type { CardMastery } from '@/types';
import { DAY, getDueCards, initMastery, updateMastery } from './srs';

const NOW = 1_700_000_000_000;

// 9단계 — 오늘의 복습(분산 SRS) 시나리오: due 산정 + 박스 이동 + 날짜 경과 재등장
describe('spaced review 시나리오', () => {
  function freshDeck(ids: string[], now: number): Record<string, CardMastery> {
    return Object.fromEntries(ids.map((id) => [id, initMastery(id, now)]));
  }

  it('신규 덱은 전부 즉시 due 이다', () => {
    const deck = freshDeck(['a', 'b', 'c'], NOW);
    expect(getDueCards(deck, NOW).sort()).toEqual(['a', 'b', 'c']);
  });

  it('복습 직후 같은 날에는 due 가 비워진다 (재복습 방지)', () => {
    let deck = freshDeck(['a', 'b'], NOW);
    // a 정답(box2 → 2일 후), b 오답(box1 → 1일 후)
    deck = { ...deck, a: updateMastery(deck.a, true, NOW), b: updateMastery(deck.b, false, NOW) };
    expect(getDueCards(deck, NOW)).toEqual([]);
  });

  it('다음 날에는 오답 카드(box1)만 다시 due 가 된다', () => {
    let deck = freshDeck(['a', 'b'], NOW);
    deck = { ...deck, a: updateMastery(deck.a, true, NOW), b: updateMastery(deck.b, false, NOW) };
    const tomorrow = NOW + DAY + 1;
    expect(getDueCards(deck, tomorrow)).toEqual(['b']); // a는 2일 후라 아직 안 뜸
  });

  it('연속 정답이면 간격이 누적되어 더 늦게 due 가 된다', () => {
    let m = initMastery('a', NOW);
    m = updateMastery(m, true, NOW); // box2, +2일
    const t2 = m.dueAt;
    m = updateMastery(m, true, t2); // box3, +4일
    expect(m.box).toBe(3);
    expect(m.dueAt).toBe(t2 + 4 * DAY);
  });
});
