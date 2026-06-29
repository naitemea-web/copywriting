import type { BuilderPlacement, FrameworkSection, Grade } from '@/types';

// 빌더: 섹션마다 배치된 카드가 recommendedCardIds에 포함되면 정답
export function scoreBuilder(
  placements: BuilderPlacement[],
  sections: FrameworkSection[]
): number {
  if (sections.length === 0) return 0;
  const correct = placements.filter((p) => {
    const sec = sections.find((s) => s.id === p.sectionId);
    return Boolean(p.placedCardId && sec?.recommendedCardIds.includes(p.placedCardId));
  }).length;
  return Math.round((correct / sections.length) * 100);
}

export function toGrade(score: number): Grade {
  if (score >= 95) return 'S';
  if (score >= 85) return 'A';
  if (score >= 70) return 'B';
  if (score >= 55) return 'C';
  if (score >= 40) return 'D';
  return 'F';
}
