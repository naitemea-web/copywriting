import { describe, expect, it } from 'vitest';
import { BOX_INTERVAL_DAYS, DAY, getDueCards, initMastery, updateMastery } from './srs';

const NOW = 1_700_000_000_000; // 고정 타임스탬프(결정적 테스트)

describe('updateMastery', () => {
  it('정답이면 박스를 +1 하고 dueAt을 간격만큼 미룬다', () => {
    const m = initMastery('curiosity', NOW);
    const next = updateMastery(m, true, NOW);
    expect(next.box).toBe(2);
    expect(next.streak).toBe(1);
    expect(next.dueAt).toBe(NOW + BOX_INTERVAL_DAYS[2] * DAY);
  });

  it('박스 5에서 정답이어도 5를 넘지 않는다', () => {
    const m = { ...initMastery('x', NOW), box: 5 as const };
    expect(updateMastery(m, true, NOW).box).toBe(5);
  });

  it('오답이면 박스를 1로 리셋하고 lapses를 늘린다', () => {
    const m = { ...initMastery('x', NOW), box: 4 as const, streak: 3 };
    const next = updateMastery(m, false, NOW);
    expect(next.box).toBe(1);
    expect(next.streak).toBe(0);
    expect(next.lapses).toBe(1);
    expect(next.dueAt).toBe(NOW + BOX_INTERVAL_DAYS[1] * DAY);
  });
});

describe('getDueCards', () => {
  it('dueAt <= now 인 카드만 반환한다', () => {
    const mastery = {
      a: { ...initMastery('a', NOW), dueAt: NOW - 1 },
      b: { ...initMastery('b', NOW), dueAt: NOW + DAY },
    };
    expect(getDueCards(mastery, NOW)).toEqual(['a']);
  });
});
