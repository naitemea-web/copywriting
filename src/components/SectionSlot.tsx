import { useDroppable } from '@dnd-kit/core';
import type { FrameworkSection } from '@/types';
import { cardById } from '@/data/techniqueCards';
import { STAGE_META } from '@/lib/stage';

interface SectionSlotProps {
  section: FrameworkSection;
  placedCardId: string | null;
  onTap: () => void; // 탭 배치/해제
}

// 9섹션 보드의 한 칸 — dnd-kit 드롭 타깃 + 탭 배치.
export default function SectionSlot({ section, placedCardId, onTap }: SectionSlotProps) {
  const { setNodeRef, isOver } = useDroppable({ id: section.id });
  const stage = STAGE_META[section.stage];
  const placed = placedCardId ? cardById[placedCardId] : null;

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col gap-xs rounded-md border p-md transition-colors ${
        isOver ? 'border-primary bg-surface-soft' : 'border-hairline bg-canvas'
      }`}
    >
      <div className="flex items-center gap-xs">
        <span className="caption text-ink/40">{section.order}</span>
        <span className="text-body-sm font-540">{section.name}</span>
        <span className={`caption ml-auto rounded-pill px-xs ${stage.chip} ${stage.text}`}>
          {stage.label}
        </span>
      </div>
      <p className="caption text-ink/50">{section.goal}</p>
      <button
        type="button"
        onClick={onTap}
        className={`min-h-[44px] rounded-md border border-dashed text-body-sm font-480 ${
          placed ? 'border-primary bg-surface-soft' : 'border-hairline text-ink/40'
        }`}
      >
        {placed ? `${placed.icon} ${placed.name}` : '여기에 카드 배치'}
      </button>
    </div>
  );
}
