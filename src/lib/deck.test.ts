import { describe, expect, it } from 'vitest';
import type { CardMastery, TechniqueCard } from '@/types';
import { buildDeck, categoryAccuracy, deckMode } from './deck';
import { initMastery } from './srs';

const NOW = 1_700_000_000_000;

const cards: TechniqueCard[] = [
  { id: 'p1', category: 'psych_button', name: 'p1', principle: '', stage: 'attention', example: '', effect: '', icon: '' , tip: '' },
  { id: 'p2', category: 'psych_button', name: 'p2', principle: '', stage: 'trust', example: '', effect: '', icon: '', tip: '' },
  { id: 'h1', category: 'hook', name: 'h1', principle: '', stage: 'attention', example: '', effect: '', icon: '', tip: '' },
];

function masteryWithBox(id: string, box: CardMastery['box']): CardMastery {
  return { ...initMastery(id, NOW), box };
}

describe('categoryAccuracy', () => {
  it('박스1은 0, 박스5는 1로 환산한다', () => {
    const mastery = { p1: masteryWithBox('p1', 5), p2: masteryWithBox('p2', 5), h1: masteryWithBox('h1', 1) };
    const acc = categoryAccuracy(mastery, cards);
    expect(acc.psych_button).toBe(1);
    expect(acc.hook).toBe(0);
  });
});

describe('deckMode', () => {
  it('두 카테고리 모두 임계 이상이면 interleave', () => {
    expect(deckMode({ psych_button: 0.9, hook: 0.85 })).toBe('interleave');
  });
  it('하나라도 미만이면 block', () => {
    expect(deckMode({ psych_button: 0.9, hook: 0.3 })).toBe('block');
  });
});

describe('buildDeck', () => {
  it('미숙련 카드는 원래 순서(블록), 숙련 카드는 뒤로 분리한다', () => {
    const acc = { psych_button: 0.9, hook: 0 }; // psych는 숙련 → 뒤로, hook은 블록 → 앞
    const deck = buildDeck(cards, acc);
    expect(deck[deck.length - 1].category).toBe('psych_button');
    expect(deck[0].category).toBe('hook');
  });
});
