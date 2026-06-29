import { useState } from 'react';
import type { FrameworkSection, Grade } from '@/types';
import { cardById } from '@/data/techniqueCards';
import CopyPreview from './CopyPreview';

interface ResultModalProps {
  score: number;
  grade: Grade;
  sections: FrameworkSection[];
  placements: Record<string, string | null>;
  onClose: () => void;
  onRetry: () => void;
}

// 빌더 결과 — 점수/등급 + 섹션별 ✓/✗ + 모범 카피 + 완성본 미리보기.
export default function ResultModal({
  score,
  grade,
  sections,
  placements,
  onClose,
  onRetry,
}: ResultModalProps) {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="fixed inset-0 z-20 overflow-y-auto bg-primary/60 p-lg">
      <div className="mx-auto my-section flex w-full max-w-2xl flex-col gap-lg rounded-lg bg-canvas p-xl">
        <div className="color-block bg-block-navy text-inverse-ink">
          <p className="caption text-inverse-ink/70">BUILDER RESULT</p>
          <p className="mt-sm text-display-xl font-500 leading-none">{grade}</p>
          <p className="mt-xs text-body-lg font-400">{score}점 / 100</p>
        </div>

        <ul className="flex flex-col gap-xs">
          {sections.map((s) => {
            const placed = placements[s.id];
            const correct = Boolean(placed && s.recommendedCardIds.includes(placed));
            return (
              <li
                key={s.id}
                className="flex items-start gap-sm rounded-md border border-hairline-soft p-sm"
              >
                <span className={correct ? 'text-semantic-success' : 'text-semantic-danger'}>
                  {correct ? '✓' : '✕'}
                </span>
                <div className="flex flex-col">
                  <p className="text-body-sm font-540">
                    {s.order}. {s.name}
                    <span className="ml-xs font-400 text-ink/65">
                      {placed ? `→ ${cardById[placed].name}` : '→ 안 놓음'}
                    </span>
                  </p>
                  <p className="mt-xxs text-body-sm font-400 text-ink/70">모범: "{s.modelCopy}"</p>
                </div>
              </li>
            );
          })}
        </ul>

        {showPreview && <CopyPreview />}

        <div className="flex flex-wrap gap-xs">
          <button
            type="button"
            onClick={() => setShowPreview((v) => !v)}
            className="btn-secondary border border-hairline"
          >
            {showPreview ? '미리보기 닫기' : '완성본 미리보기'}
          </button>
          <button type="button" onClick={onRetry} className="btn-secondary border border-hairline">
            다른 미션 도전
          </button>
          <button type="button" onClick={onClose} className="btn-primary ml-auto">
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
