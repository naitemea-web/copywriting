import type { PlayerProgress } from '@/types';
import { calibrationReport } from './calibration';

// F9 — 배지/도전과제. PDF 로드맵 + 학습 과학 기반 가벼운 메타 보상.
export interface BadgeDef {
  id: string;
  label: string;
  desc: string;
  test: (p: PlayerProgress) => boolean;
}

export const BADGES: BadgeDef[] = [
  {
    id: 'first_step',
    label: '첫 발 떼기',
    desc: '첫 라운드 완료',
    test: (p) => p.totalPlays >= 1,
  },
  {
    id: 'codex_explorer',
    label: '도감 탐험가',
    desc: '12장 모두 1회 이상 인출 성공',
    test: (p) => Object.values(p.mastery).length > 0 && Object.values(p.mastery).every((m) => m.box >= 2),
  },
  {
    id: 'copy_architect',
    label: '카피 설계자',
    desc: '9섹션 빌더 A등급(85점) 이상',
    test: (p) => p.highScores.builder >= 85,
  },
  {
    id: 'calibration_master',
    label: '메타인지 달인',
    desc: '퀴즈 확신도 보정 정확도 90% 이상',
    test: (p) =>
      p.history.some(
        (r) => r.mode === 'quiz' && r.attempts.length >= 3 && calibrationReport(r.attempts).accuracy >= 0.9
      ),
  },
  {
    id: 'streak_3',
    label: '꾸준함의 시작',
    desc: '3일 연속 학습',
    test: (p) => p.streakDays >= 3,
  },
];

// 현재 진행도로 충족된 배지 id 목록
export function evaluateBadges(p: PlayerProgress): string[] {
  return BADGES.filter((b) => b.test(p)).map((b) => b.id);
}
