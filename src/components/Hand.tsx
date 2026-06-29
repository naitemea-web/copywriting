import { useDraggable } from '@dnd-kit/core';
import type { TechniqueCard } from '@/types';
import { techniqueCards } from '@/data/techniqueCards';
import { STAGE_META } from '@/lib/stage';

interface HandProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
}

// 핸드: 12장 기법 카드. 드래그(dnd-kit) + 탭 선택(터치 대체) 둘 다 지원.
export default function Hand({ selectedId, onSelect }: HandProps) {
  return (
    <div className="flex flex-col gap-sm">
      <p className="caption text-ink/65">카드를 끌어다 놓거나, 카드를 탭해서 고른 뒤 섹션을 탭하세요</p>
      <div className="grid grid-cols-2 gap-xs sm:grid-cols-3 lg:grid-cols-4">
        {techniqueCards.map((card) => (
          <HandCard
            key={card.id}
            card={card}
            selected={selectedId === card.id}
            onSelect={() => onSelect(card.id)}
          />
        ))}
      </div>
    </div>
  );
}

function HandCard({
  card,
  selected,
  onSelect,
}: {
  card: TechniqueCard;
  selected: boolean;
  onSelect: () => void;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: card.id });
  const stage = STAGE_META[card.stage];
  return (
    <button
      ref={setNodeRef}
      type="button"
      onClick={onSelect}
      {...listeners}
      {...attributes}
      className={`min-h-[56px] touch-none rounded-md border p-sm text-left transition-colors ${
        selected ? 'border-primary bg-surface-soft' : 'border-hairline bg-canvas'
      } ${isDragging ? 'opacity-40' : ''}`}
    >
      <span className={`caption rounded-pill px-xs ${stage.chip} ${stage.text}`}>
        {stage.label}
      </span>
      <p className="mt-xxs text-body-sm font-540">
        {card.icon} {card.name}
      </p>
    </button>
  );
}
