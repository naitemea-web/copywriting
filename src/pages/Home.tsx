import { Link } from 'react-router-dom';
import { useGameStore } from '@/store/gameStore';

// 홈: 오늘 복습 N장 · 연속일 · 모드 진입 (todo 9단계에서 완성)
export default function Home() {
  const dueCount = useGameStore((s) => s.dueCount());
  const streak = useGameStore((s) => s.streakDays);

  return (
    <div className="flex flex-col gap-section">
      <section className="flex flex-col gap-md">
        <p className="eyebrow text-ink/60">COPY MASTER · 학습 과학 카드게임</p>
        <h1 className="text-display-lg font-340">
          공부했다는 느낌이 아니라,
          <br />
          떠올릴 수 있는가.
        </h1>
        <p className="max-w-2xl text-body-lg font-330 text-ink/80">
          인출 · 분산 · 메타인지로 카피라이팅을 장기 기억에 새깁니다.
        </p>
        <div className="mt-md flex flex-wrap gap-sm">
          <Link to="/review" className="btn-primary">
            오늘의 복습 {dueCount}장
          </Link>
          <Link to="/codex" className="btn-secondary border border-hairline">
            카드 도감 보기
          </Link>
        </div>
        {streak > 0 && (
          <p className="caption text-ink/60">🔥 {streak}일 연속 학습 중</p>
        )}
      </section>

      <section className="grid gap-lg sm:grid-cols-2">
        <Link to="/quiz" className="color-block bg-block-coral">
          <p className="eyebrow text-ink/60">RETRIEVAL</p>
          <h2 className="mt-xs text-headline font-540">인출 퀴즈</h2>
          <p className="mt-xs text-body font-320">먼저 떠올리고, 확신도를 매기고, 확인한다.</p>
        </Link>
        <Link to="/builder" className="color-block bg-block-lime">
          <p className="eyebrow text-ink/60">BUILD</p>
          <h2 className="mt-xs text-headline font-540">9섹션 빌더</h2>
          <p className="mt-xs text-body font-320">미션을 받아 한 편의 카피를 직접 설계한다.</p>
        </Link>
      </section>
    </div>
  );
}
