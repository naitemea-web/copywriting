import { useState } from 'react';
import { motion } from 'framer-motion';
import type { TechniqueCard } from '@/types';
import { STAGE_META } from '@/lib/stage';

interface CardProps {
  card: TechniqueCard;
  /** 외부에서 뒤집힘 상태를 제어하고 싶을 때(미제어 시 클릭으로 토글) */
  flipped?: boolean;
  onFlip?: (flipped: boolean) => void;
}

// 기법 카드 — 클릭 시 앞/뒷면 뒤집기 (Framer Motion). design.md 레벨1(hairline).
export default function Card({ card, flipped, onFlip }: CardProps) {
  const [internal, setInternal] = useState(false);
  const isFlipped = flipped ?? internal;
  const stage = STAGE_META[card.stage];

  const toggle = () => {
    const next = !isFlipped;
    if (flipped === undefined) setInternal(next);
    onFlip?.(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`${card.name} 카드 뒤집기`}
      className="group relative h-64 w-full [perspective:1200px]"
    >
      <motion.div
        className="relative h-full w-full [transform-style:preserve-3d]"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.45, ease: 'easeInOut' }}
      >
        {/* 앞면 */}
        <div className="absolute inset-0 flex flex-col rounded-lg border border-hairline bg-canvas p-lg [backface-visibility:hidden]">
          <div className="flex items-center justify-between">
            <span className={`caption rounded-pill px-sm py-xxs ${stage.chip} ${stage.text}`}>
              {stage.label}
            </span>
            <span className="text-3xl" aria-hidden>
              {card.icon}
            </span>
          </div>
          <div className="mt-auto">
            <p className="caption text-ink/65">
              {card.category === 'hook' ? '후킹 무기' : '심리 버튼'}
            </p>
            <h3 className="mt-xxs text-card-title font-700">{card.name}</h3>
            <p className="mt-xxs text-body-sm font-400 text-ink/70">{card.principle}</p>
          </div>
          <p className="caption mt-md text-ink/60">탭하여 뒤집기 →</p>
        </div>

        {/* 뒷면 */}
        <div className="absolute inset-0 flex flex-col gap-xs rounded-lg border border-hairline bg-surface-soft p-lg text-left [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <p className="caption text-ink/65">예시 카피</p>
          <p className="text-body-sm font-540 leading-snug">"{card.example}"</p>
          <div className="mt-auto flex flex-col gap-xxs">
            <p className="text-body-sm font-400">
              <span className="text-ink/65">효과 </span>
              {card.effect}
            </p>
            {card.position && (
              <p className="text-body-sm font-400">
                <span className="text-ink/65">적용 </span>
                {card.position}
              </p>
            )}
            <p className="text-body-sm font-400 text-ink/70">💡 {card.tip}</p>
          </div>
        </div>
      </motion.div>
    </button>
  );
}
