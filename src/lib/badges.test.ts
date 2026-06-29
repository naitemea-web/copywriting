import { describe, expect, it } from 'vitest';
import type { PlayerProgress } from '@/types';
import { evaluateBadges } from './badges';

function baseProgress(over: Partial<PlayerProgress> = {}): PlayerProgress {
  return {
    highScores: { codex: 0, quiz: 0, builder: 0, review: 0 },
    totalPlays: 0,
    mastery: {},
    streakDays: 0,
    lastPlayedDate: '',
    unlockedBadges: [],
    history: [],
    ...over,
  };
}

describe('evaluateBadges', () => {
  it('신규 진행도는 어떤 배지도 충족하지 않는다', () => {
    expect(evaluateBadges(baseProgress())).toEqual([]);
  });

  it('첫 라운드 완료 시 first_step 해금', () => {
    expect(evaluateBadges(baseProgress({ totalPlays: 1 }))).toContain('first_step');
  });

  it('빌더 85점 이상이면 copy_architect 해금', () => {
    const p = baseProgress({
      totalPlays: 1,
      highScores: { codex: 0, quiz: 0, builder: 90, review: 0 },
    });
    expect(evaluateBadges(p)).toContain('copy_architect');
  });

  it('3일 연속이면 streak_3 해금', () => {
    expect(evaluateBadges(baseProgress({ streakDays: 3 }))).toContain('streak_3');
  });
});
