import { useMemo, useState } from 'react';
import type { Stage, TechniqueCard } from '@/types';
import { techniqueCards } from '@/data/techniqueCards';
import { STAGE_META, STAGE_ORDER } from '@/lib/stage';
import { useGameStore } from '@/store/gameStore';
import Card from '@/components/Card';

type Filter = Stage | 'all';

// F1 — 카드 도감 + 인출 (todo 6단계)
export default function Codex() {
  const [filter, setFilter] = useState<Filter>('all');
  const [recallMode, setRecallMode] = useState(false);

  const cards = useMemo(
    () => (filter === 'all' ? techniqueCards : techniqueCards.filter((c) => c.stage === filter)),
    [filter]
  );

  return (
    <div className="flex flex-col gap-xl">
      <header className="flex flex-col gap-sm">
        <p className="eyebrow text-ink/60">CARD CODEX · 기법 카드 12장</p>
        <h1 className="text-display-lg font-500">카드 도감</h1>
        <p className="max-w-2xl text-body font-400 text-ink/80">
          심리 버튼 7개 + 후킹 무기 5개. 카드를 본 다음엔{' '}
          <strong className="font-700">‘덮고 떠올리기’</strong>로 직접 떠올려 보세요. 눈으로 다시
          읽기만 하면 기억에 잘 남지 않아요.
        </p>
      </header>

      {/* stage 필터 */}
      <div className="flex flex-wrap items-center gap-xs">
        <FilterPill active={filter === 'all'} onClick={() => setFilter('all')}>
          전체
        </FilterPill>
        {STAGE_ORDER.map((s) => (
          <FilterPill key={s} active={filter === s} onClick={() => setFilter(s)}>
            {STAGE_META[s].label}
          </FilterPill>
        ))}
        <button type="button" onClick={() => setRecallMode(true)} className="btn-primary ml-auto">
          덮고 떠올리기 ({cards.length})
        </button>
      </div>

      <div className="grid grid-cols-2 gap-md sm:grid-cols-3 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.id} card={card} />
        ))}
      </div>

      {recallMode && <RecallSession cards={cards} onClose={() => setRecallMode(false)} />}
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-[44px] rounded-pill px-md text-body-sm font-500 transition-colors ${
        active ? 'bg-primary text-inverse-ink' : 'border border-hairline bg-canvas text-ink'
      }`}
    >
      {children}
    </button>
  );
}

// ① 덮고 떠올리기 — 정답(이름)을 가리고 단서만 보여준 뒤 스스로 떠올리게 한다.
function RecallSession({ cards, onClose }: { cards: TechniqueCard[]; onClose: () => void }) {
  const applyAttempt = useGameStore((s) => s.applyAttempt);
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [done, setDone] = useState(0);

  const card = cards[idx];
  const stage = STAGE_META[card.stage];

  const grade = (correct: boolean) => {
    applyAttempt({
      itemId: card.id,
      confidence: correct ? 3 : 1,
      correct,
      overconfident: false,
      attemptedAt: Date.now(),
    });
    const next = idx + 1;
    setDone((d) => d + 1);
    if (next >= cards.length) {
      onClose();
      return;
    }
    setIdx(next);
    setRevealed(false);
  };

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-primary/60 p-lg">
      <div className="w-full max-w-md rounded-lg bg-canvas p-xl">
        <div className="flex items-center justify-between">
          <p className="caption text-ink/65">
            덮고 떠올리기 {done + 1}/{cards.length}
          </p>
          <button type="button" onClick={onClose} className="caption text-ink/65">
            닫기 ✕
          </button>
        </div>

        <span
          className={`caption mt-md inline-block rounded-pill px-sm py-xxs ${stage.chip} ${stage.text}`}
        >
          {stage.label} · {card.category === 'hook' ? '후킹 무기' : '심리 버튼'}
        </span>

        <p className="mt-lg caption text-ink/65">이 카피에 쓰인 기법은 무엇일까요?</p>
        <p className="mt-xs text-headline font-540 leading-snug">"{card.example}"</p>

        {!revealed ? (
          <button
            type="button"
            onClick={() => setRevealed(true)}
            className="btn-primary mt-xl w-full"
          >
            다 떠올렸어요, 정답 보기
          </button>
        ) : (
          <div className="mt-xl flex flex-col gap-sm">
            <div className="rounded-md bg-surface-soft p-md">
              <p className="text-card-title font-700">{card.name}</p>
              <p className="mt-xxs text-body-sm font-400 text-ink/70">
                {card.principle} · {card.tip}
              </p>
            </div>
            <div className="flex gap-xs">
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
    </div>
  );
}
