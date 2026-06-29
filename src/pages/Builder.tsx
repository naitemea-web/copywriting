import { useMemo, useState } from 'react';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { sections } from '@/data/sections';
import { missions } from '@/data/missions';
import { scoreBuilder, toGrade } from '@/lib/scoring';
import { useGameStore } from '@/store/gameStore';
import MissionPanel from '@/components/MissionPanel';
import Hand from '@/components/Hand';
import SectionSlot from '@/components/SectionSlot';
import ResultModal from '@/components/ResultModal';

type Placements = Record<string, string | null>;

const emptyPlacements = (): Placements =>
  Object.fromEntries(sections.map((s) => [s.id, null]));

// F3 — 9섹션 빌더 (todo 8단계)
export default function Builder() {
  const saveRound = useGameStore((s) => s.saveRound);
  const [missionIdx, setMissionIdx] = useState(0);
  const [placements, setPlacements] = useState<Placements>(emptyPlacements);
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<{ score: number } | null>(null);

  const mission = missions[missionIdx];
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const placedCount = useMemo(
    () => Object.values(placements).filter(Boolean).length,
    [placements]
  );

  const assign = (sectionId: string, cardId: string) => {
    setPlacements((p) => ({ ...p, [sectionId]: cardId }));
    setSelected(null);
  };

  const onDragEnd = (e: DragEndEvent) => {
    const sectionId = e.over?.id as string | undefined;
    const cardId = e.active.id as string;
    if (sectionId && cardId) assign(sectionId, cardId);
  };

  // 탭 배치: 카드 선택 후 슬롯 탭 → 배치 / 채워진 슬롯 탭 → 해제
  const onSlotTap = (sectionId: string) => {
    if (selected) {
      assign(sectionId, selected);
    } else if (placements[sectionId]) {
      setPlacements((p) => ({ ...p, [sectionId]: null }));
    }
  };

  const complete = () => {
    const placementArr = sections.map((s) => ({
      sectionId: s.id,
      placedCardId: placements[s.id],
    }));
    const score = scoreBuilder(placementArr, sections);
    saveRound({
      mode: 'builder',
      score,
      grade: toGrade(score),
      detail: Object.fromEntries(
        sections.map((s) => [
          s.id,
          Boolean(placements[s.id] && s.recommendedCardIds.includes(placements[s.id]!)),
        ])
      ),
      attempts: [],
      completedAt: Date.now(),
    });
    setResult({ score });
  };

  const nextMission = () => {
    setResult(null);
    setPlacements(emptyPlacements());
    setSelected(null);
    setMissionIdx((i) => (i + 1) % missions.length);
  };

  return (
    <DndContext sensors={sensors} onDragEnd={onDragEnd}>
      <div className="flex flex-col gap-lg">
        <header className="flex flex-col gap-xs">
          <p className="eyebrow text-ink/60">9-SECTION BUILDER</p>
          <h1 className="text-display-lg font-500">9섹션 빌더</h1>
          <p className="text-body-sm font-400 text-ink/60">
            ✍️ 1번 후킹 문구는 손으로도 적어 보면 더 오래 기억에 남아요.
          </p>
        </header>

        <MissionPanel mission={mission} />

        {/* 9섹션 보드 */}
        <div className="grid gap-xs sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((s) => (
            <SectionSlot
              key={s.id}
              section={s}
              placedCardId={placements[s.id]}
              onTap={() => onSlotTap(s.id)}
            />
          ))}
        </div>

        <Hand selectedId={selected} onSelect={(id) => setSelected((cur) => (cur === id ? null : id))} />

        <div className="sticky bottom-0 flex items-center gap-sm border-t border-hairline-soft bg-canvas py-sm">
          <p className="caption text-ink/65">{placedCount}/9칸 채움</p>
          <button
            type="button"
            disabled={placedCount === 0}
            onClick={complete}
            className="btn-primary ml-auto disabled:opacity-40"
          >
            완성하고 채점받기
          </button>
        </div>
      </div>

      {result && (
        <ResultModal
          score={result.score}
          grade={toGrade(result.score)}
          sections={sections}
          placements={placements}
          onClose={() => setResult(null)}
          onRetry={nextMission}
        />
      )}
    </DndContext>
  );
}
