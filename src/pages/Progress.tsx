import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { calibrationReport } from '@/lib/calibration';
import { BADGES } from '@/lib/badges';
import { useGameStore } from '@/store/gameStore';

// F9 — 내 기록 (todo 10단계): 숙련도·점수·보정·배지·연속일
export default function Progress() {
  const mastery = useGameStore((s) => s.mastery);
  const streakDays = useGameStore((s) => s.streakDays);
  const totalPlays = useGameStore((s) => s.totalPlays);
  const highScores = useGameStore((s) => s.highScores);
  const unlockedBadges = useGameStore((s) => s.unlockedBadges);
  const history = useGameStore((s) => s.history);
  const resetProgress = useGameStore((s) => s.resetProgress);

  // 박스 분포(1~5)
  const boxes = useMemo(() => {
    const counts = [0, 0, 0, 0, 0];
    Object.values(mastery).forEach((m) => (counts[m.box - 1] += 1));
    return counts;
  }, [mastery]);
  const totalCards = Object.values(mastery).length || 1;

  // 누적 확신도 보정(퀴즈 history)
  const cal = useMemo(() => {
    const attempts = history.filter((r) => r.mode === 'quiz').flatMap((r) => r.attempts);
    return calibrationReport(attempts);
  }, [history]);

  return (
    <div className="flex flex-col gap-xl">
      <header className="flex flex-col gap-sm">
        <p className="eyebrow text-ink/60">MY PROGRESS</p>
        <h1 className="text-display-lg font-340">내 기록</h1>
      </header>

      {/* 요약 스탯 */}
      <div className="grid grid-cols-2 gap-md sm:grid-cols-4">
        <Stat label="연속 학습일" value={`${streakDays}일`} accent="bg-block-coral" />
        <Stat label="총 플레이" value={`${totalPlays}회`} accent="bg-block-lime" />
        <Stat label="퀴즈 최고점" value={`${highScores.quiz}점`} accent="bg-block-lilac" />
        <Stat label="빌더 최고점" value={`${highScores.builder}점`} accent="bg-block-mint" />
      </div>

      {/* 숙련도 박스 분포 */}
      <section className="rounded-lg border border-hairline p-lg">
        <p className="caption text-ink/50">숙련도 분포 (Leitner 박스 · 높을수록 장기 기억)</p>
        <div className="mt-md flex flex-col gap-xs">
          {boxes.map((n, i) => (
            <div key={i} className="flex items-center gap-sm">
              <span className="caption w-16 text-ink/50">박스 {i + 1}</span>
              <div className="h-4 flex-1 overflow-hidden rounded-pill bg-surface-soft">
                <div
                  className="h-full rounded-pill bg-primary"
                  style={{ width: `${(n / totalCards) * 100}%` }}
                />
              </div>
              <span className="caption w-8 text-right text-ink/60">{n}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 확신도 보정 */}
      <section className="rounded-lg border border-hairline p-lg">
        <p className="caption text-ink/50">확신도 보정 (누적)</p>
        <ul className="mt-sm flex flex-col gap-xs text-body font-320">
          <li>
            ⚠️ 과신: <strong className="font-540">{cal.overconfident}건</strong> · 💡 과소:{' '}
            <strong className="font-540">{cal.underconfident}건</strong>
          </li>
          <li>
            🎯 보정 정확도: <strong className="font-540">{Math.round(cal.accuracy * 100)}%</strong>
          </li>
        </ul>
      </section>

      {/* 배지 */}
      <section className="flex flex-col gap-sm">
        <p className="caption text-ink/50">배지 ({unlockedBadges.length}/{BADGES.length})</p>
        <div className="grid gap-xs sm:grid-cols-2">
          {BADGES.map((b) => {
            const earned = unlockedBadges.includes(b.id);
            return (
              <div
                key={b.id}
                className={`rounded-md border p-md ${
                  earned ? 'border-primary bg-surface-soft' : 'border-hairline-soft opacity-50'
                }`}
              >
                <p className="text-body-sm font-540">
                  {earned ? '🏅' : '🔒'} {b.label}
                </p>
                <p className="caption mt-xxs text-ink/60">{b.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-sm">
        <Link to="/review" className="btn-primary">
          오늘의 복습 하러 가기
        </Link>
        <button
          type="button"
          onClick={() => {
            if (confirm('모든 학습 기록을 초기화할까요?')) resetProgress();
          }}
          className="caption ml-auto text-ink/40 underline"
        >
          기록 초기화
        </button>
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className={`rounded-lg p-md ${accent}`}>
      <p className="caption text-ink/60">{label}</p>
      <p className="mt-xxs text-card-title font-700">{value}</p>
    </div>
  );
}
