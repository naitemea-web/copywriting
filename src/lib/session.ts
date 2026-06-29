// ⑤ 세션 페이싱 — 8~12분 권장, 종료 시 "자고 내일 복습" 넛지. + 연속 학습일.

export const SESSION_MIN_MS = 8 * 60 * 1000;
export const SESSION_MAX_MS = 12 * 60 * 1000;

// 'YYYY-MM-DD' (로컬 자정 기준 날짜키). now는 주입형(테스트 용이).
export function dateKey(now: number): string {
  const d = new Date(now);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// 권장 세션 시간을 넘겼는지 → 복습 넛지 노출 트리거
export function shouldNudgeRest(sessionStartedAt: number, now: number): boolean {
  return now - sessionStartedAt >= SESSION_MAX_MS;
}

// 연속 학습일 갱신: 어제 학습했으면 +1, 오늘 재학습이면 유지, 그 외 1로 리셋.
export function updateStreak(streakDays: number, lastPlayedDate: string, now: number): number {
  const today = dateKey(now);
  if (lastPlayedDate === today) return streakDays || 1;
  const yesterday = dateKey(now - DAY);
  if (lastPlayedDate === yesterday) return streakDays + 1;
  return 1;
}

const DAY = 24 * 60 * 60 * 1000;
