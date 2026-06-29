import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CardMastery, GameMode, PlayerProgress, RecallAttempt, RoundResult } from '@/types';
import { techniqueCards } from '@/data/techniqueCards';
import { getDueCards, initMastery, updateMastery } from '@/lib/srs';
import { updateStreak } from '@/lib/session';

const STORE_VERSION = 1;

function initialMastery(now: number): Record<string, CardMastery> {
  return Object.fromEntries(techniqueCards.map((c) => [c.id, initMastery(c.id, now)]));
}

function initialProgress(now: number): PlayerProgress {
  return {
    highScores: { codex: 0, quiz: 0, builder: 0, review: 0 },
    totalPlays: 0,
    mastery: initialMastery(now),
    streakDays: 0,
    lastPlayedDate: '',
    unlockedBadges: [],
    history: [],
  };
}

interface GameState extends PlayerProgress {
  // 액션
  applyAttempt: (attempt: RecallAttempt, now?: number) => void;
  saveRound: (result: RoundResult, now?: number) => void;
  unlockBadge: (badge: string) => void;
  resetProgress: () => void;
  // 셀렉터(파생값)
  dueCount: (now?: number) => number;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      ...initialProgress(Date.now()),

      applyAttempt: (attempt, now = Date.now()) =>
        set((state) => {
          const current = state.mastery[attempt.itemId] ?? initMastery(attempt.itemId, now);
          return {
            mastery: {
              ...state.mastery,
              [attempt.itemId]: updateMastery(current, attempt.correct, now),
            },
          };
        }),

      saveRound: (result, now = Date.now()) =>
        set((state) => ({
          totalPlays: state.totalPlays + 1,
          highScores: {
            ...state.highScores,
            [result.mode]: Math.max(state.highScores[result.mode] ?? 0, result.score),
          },
          streakDays: updateStreak(state.streakDays, state.lastPlayedDate, now),
          lastPlayedDate: new Date(now).toISOString().slice(0, 10),
          history: [...state.history, result].slice(-50),
        })),

      unlockBadge: (badge) =>
        set((state) =>
          state.unlockedBadges.includes(badge)
            ? state
            : { unlockedBadges: [...state.unlockedBadges, badge] }
        ),

      resetProgress: () => set(initialProgress(Date.now())),

      dueCount: (now = Date.now()) => getDueCards(get().mastery, now).length,
    }),
    {
      name: 'copy-master-progress',
      version: STORE_VERSION,
    }
  )
);

export { type GameMode };
