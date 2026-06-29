import { useState } from 'react';
import { Link } from 'react-router-dom';
import { cardById } from '@/data/techniqueCards';
import { getDueCards } from '@/lib/srs';
import { toGrade } from '@/lib/scoring';
import { STAGE_META } from '@/lib/stage';
import { useGameStore } from '@/store/gameStore';
import ReviewNudge from '@/components/ReviewNudge';

const HOUR = 60 * 60 * 1000;

// F5 — 오늘의 복습(분산 SRS) (todo 9단계)
export default function Review() {
  const applyAttempt = useGameStore((s) => s.applyAttempt);
  const saveRound = useGameStore((s) => s.saveRound);

  // 세션 시작 시 due 큐를 한 번 고정 (이후 applyAttempt가 박스를 바꿔도 큐는 유지)
  const [start] = useState(() => Date.now());
  const [queue] = useState(() => getDueCards(useGameStore.getState().mastery, start));
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);
  const [done, setDone] = useState(false);

  // 빈 큐 — 오늘 복습할 카드 없음
  if (queue.length === 0) {
    return <EmptyQueue />;
  }

  // 완료 화면
  if (done) {
    const remembered = results.filter(Boolean).length;
    return (
      <div className="flex flex-col gap-lg">
        <div className="color-block bg-block-mint">
          <p className="caption text-ink/60">REVIEW COMPLETE</p>
          <p className="mt-sm text-display-lg font-500">
            {remembered}/{queue.length}장 기억해냈어요
          </p>
          <p className="mt-xs text-body font-400 text-ink/80">
            기억해낸 카드는 더 나중에, 놓친 카드는 곧 다시 보여드려요.
          </p>
        </div>
        <ReviewNudge />
      </div>
    );
  }

  const card = cardById[queue[idx]];
  const stage = STAGE_META[card.stage];

  const grade = (correct: boolean) => {
    applyAttempt({
      itemId: card.id,
      confidence: correct ? 3 : 1,
      correct,
      overconfident: false,
      attemptedAt: Date.now(),
    });
    const nextResults = [...results, correct];
    const next = idx + 1;
    if (next >= queue.length) {
      const score = Math.round((nextResults.filter(Boolean).length / queue.length) * 100);
      saveRound({
        mode: 'review',
        score,
        grade: toGrade(score),
        detail: Object.fromEntries(queue.map((id, i) => [id, nextResults[i]])),
        attempts: [],
        completedAt: Date.now(),
      });
      setResults(nextResults);
      setDone(true);
      return;
    }
    setResults(nextResults);
    setIdx(next);
    setRevealed(false);
  };

  return (
    <div className="flex flex-col gap-lg">
      <header className="flex items-center justify-between">
        <p className="eyebrow text-ink/60">SPACED REVIEW</p>
        <p className="caption text-ink/65">
          {idx + 1} / {queue.length}
        </p>
      </header>

      <div className="color-block bg-block-mint">
        <span
          className={`caption inline-block rounded-pill px-sm py-xxs ${stage.chip} ${stage.text}`}
        >
          {stage.label} · {card.category === 'hook' ? '후킹 무기' : '심리 버튼'}
        </span>
        <p className="mt-md caption text-ink/60">이 카피에 쓰인 기법은 무엇일까요?</p>
        <p className="mt-xs text-headline font-540 leading-snug">"{card.example}"</p>
      </div>

      {!revealed ? (
        <button type="button" onClick={() => setRevealed(true)} className="btn-primary w-full">
          다 떠올렸어요, 정답 보기
        </button>
      ) : (
        <div className="flex flex-col gap-sm rounded-lg border border-hairline p-lg">
          <p className="text-card-title font-700">{card.name}</p>
          <p className="text-body-sm font-400 text-ink/70">
            {card.principle} · 💡 {card.tip}
          </p>
          <div className="mt-xs flex gap-xs">
            <button
              type="button"
              onClick={() => grade(false)}
              className="min-h-[44px] flex-1 rounded-pill border border-hairline text-body-sm font-500 text-semantic-danger"
            >
              기억 안 나요
            </button>
            <button
              type="button"
              onClick={() => grade(true)}
              className="min-h-[44px] flex-1 rounded-pill bg-primary text-body-sm font-500 text-inverse-ink"
            >
              기억났어요 ✓
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// 오늘 복습할 카드가 없을 때 — 다음 복습 시점 안내
function EmptyQueue() {
  const mastery = useGameStore((s) => s.mastery);
  const now = Date.now();
  const nextDue = Math.min(...Object.values(mastery).map((m) => m.dueAt));
  const hours = Number.isFinite(nextDue) ? Math.max(0, Math.ceil((nextDue - now) / HOUR)) : 0;
  const when = hours <= 0 ? '곧' : hours < 24 ? `${hours}시간 후` : `${Math.ceil(hours / 24)}일 후`;

  return (
    <div className="flex flex-col gap-lg">
      <div className="color-block bg-block-mint">
        <p className="caption text-ink/60">ALL CAUGHT UP</p>
        <p className="mt-sm text-display-lg font-500">오늘 복습 끝! 🎉</p>
        <p className="mt-xs text-body font-400 text-ink/80">
          다음 복습은 <strong className="font-700">{when}</strong>예요. 잊어버릴 때쯤 다시
          알려드릴게요.
        </p>
      </div>
      <div className="flex flex-wrap gap-xs">
        <Link to="/quiz" className="btn-primary">
          인출 퀴즈 풀기
        </Link>
        <Link to="/builder" className="btn-secondary border border-hairline">
          9섹션 빌더
        </Link>
      </div>
    </div>
  );
}
