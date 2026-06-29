import type { MissionCard } from '@/types';

// 미션 카드(TPPGE) 표시 — 빌더 입력
export default function MissionPanel({ mission }: { mission: MissionCard }) {
  const rows: [string, string][] = [
    ['Target 타겟', mission.target],
    ['Goal 목표', mission.goal],
    ['Problem 고통', mission.problem],
    ['Emotion 감정', mission.emotion],
    ['Promise 약속', mission.promise],
    ['USP 차별점', mission.usp],
  ];
  return (
    <div className="color-block bg-block-cream">
      <p className="caption text-ink/60">MISSION · {mission.product}</p>
      <h2 className="mt-xs text-headline font-540">{mission.product}</h2>
      <dl className="mt-md grid gap-x-lg gap-y-xs sm:grid-cols-2">
        {rows.map(([k, v]) => (
          <div key={k} className="flex flex-col">
            <dt className="caption text-ink/65">{k}</dt>
            <dd className="text-body-sm font-400">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
