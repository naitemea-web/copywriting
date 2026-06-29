import type { Stage } from '@/types';

// 4단계 설득 회로 ↔ 컬러블록 매핑 (design.md "학습 4단계 ↔ 컬러블록").
export interface StageMeta {
  label: string;
  block: string; // 배경 클래스
  chip: string; // 작은 칩 배경
  text: string; // 텍스트 색 클래스
}

export const STAGE_META: Record<Stage, StageMeta> = {
  attention: { label: '주목', block: 'bg-block-coral', chip: 'bg-block-coral', text: 'text-ink' },
  trust: { label: '신뢰', block: 'bg-block-lilac', chip: 'bg-block-lilac', text: 'text-ink' },
  value: { label: '가치', block: 'bg-block-lime', chip: 'bg-block-lime', text: 'text-ink' },
  action: {
    label: '행동',
    block: 'bg-block-navy',
    chip: 'bg-block-navy',
    text: 'text-inverse-ink',
  },
};

export const STAGE_ORDER: Stage[] = ['attention', 'trust', 'value', 'action'];
