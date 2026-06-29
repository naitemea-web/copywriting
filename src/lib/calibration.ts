import type { Confidence, RecallAttempt } from '@/types';

// ⑦ 메타인지 — 확신했는데 틀림 = 유창함의 착각
export function isOverconfident(a: { confidence: Confidence; correct: boolean }): boolean {
  return a.confidence >= 3 && !a.correct;
}

export interface CalibrationReport {
  overconfident: number; // 확신(≥3)했지만 틀림
  underconfident: number; // 자신없음(≤2)이지만 맞음
  accuracy: number; // 확신과 실제 정오의 일치율 0~1
}

// 보정 리포트: 과신/과소 건수 + 보정 정확도
export function calibrationReport(attempts: RecallAttempt[]): CalibrationReport {
  const overconfident = attempts.filter((a) => a.confidence >= 3 && !a.correct).length;
  const underconfident = attempts.filter((a) => a.confidence <= 2 && a.correct).length;
  const aligned = attempts.filter((a) => (a.confidence >= 3) === a.correct).length;
  return { overconfident, underconfident, accuracy: aligned / (attempts.length || 1) };
}
