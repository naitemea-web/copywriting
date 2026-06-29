import { useMemo, useState } from 'react';
import type { Confidence, QuizQuestion, RecallAttempt } from '@/types';
import { quizQuestions } from '@/data/quizQuestions';
import { cardById, techniqueCards } from '@/data/techniqueCards';
import { buildDeck, categoryAccuracy, deckMode, shuffle } from '@/lib/deck';
import { isOverconfident, calibrationReport } from '@/lib/calibration';
import { toGrade } from '@/lib/scoring';
import { useGameStore } from '@/store/gameStore';
import ConfidenceMeter from '@/components/ConfidenceMeter';

const SET_SIZE = 5;
type Phase = 'recall' | 'choose' | 'feedback' | 'result';

// F2 — 인출 퀴즈 + F4 확신도 보정 (todo 7단계)
export default function Quiz() {
  const applyAttempt = useGameStore((s) => s.applyAttempt);
  const saveRound = useGameStore((s) => s.saveRound);

  const [seed, setSeed] = useState(1);
  // ③ 적응형 덱 — 카테고리 정답률로 블록→혼합 순서 결정 (세션 시작 시 mastery 스냅샷)
  const [mastery] = useState(() => useGameStore.getState().mastery);
  const accuracy = useMemo(() => categoryAccuracy(mastery, techniqueCards), [mastery]);
  const mode = deckMode(accuracy);
  const questions = useMemo(() => {
    const deck = buildDeck(techniqueCards, accuracy, seed);
    const order = new Map(deck.map((c, i) => [c.id, i]));
    return [...quizQuestions]
      .sort((a, b) => (order.get(a.answerCardId) ?? 99) - (order.get(b.answerCardId) ?? 99))
      .slice(0, SET_SIZE);
  }, [accuracy, seed]);

  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>('recall');
  const [recalled, setRecalled] = useState('');
  const [confidence, setConfidence] = useState<Confidence | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const [attempts, setAttempts] = useState<RecallAttempt[]>([]);

  const q = questions[idx];
  const choices = useMemo(() => (q ? shuffle(q.choiceCardIds, idx + 1) : []), [q, idx]);

  const reset = () => {
    setSeed((s) => s + 1);
    setIdx(0);
    setPhase('recall');
    setRecalled('');
    setConfidence(null);
    setPicked(null);
    setAttempts([]);
  };

  if (phase === 'result') {
    return <Result attempts={attempts} onRetry={reset} />;
  }

  const correct = picked === q.answerCardId;

  const choose = (cardId: string) => {
    if (phase !== 'choose') return;
    const isCorrect = cardId === q.answerCardId;
    const attempt: RecallAttempt = {
      itemId: q.answerCardId,
      recalledText: recalled.trim() || undefined,
      confidence: confidence!,
      correct: isCorrect,
      overconfident: isOverconfident({ confidence: confidence!, correct: isCorrect }),
      attemptedAt: Date.now(),
    };
    setPicked(cardId);
    setAttempts((a) => [...a, attempt]);
    applyAttempt(attempt);
    setPhase('feedback');
  };

  const next = () => {
    const collected = attempts;
    const isLast = idx + 1 >= questions.length;
    if (isLast) {
      const score = Math.round((collected.filter((a) => a.correct).length / collected.length) * 100);
      saveRound({
        mode: 'quiz',
        score,
        grade: toGrade(score),
        detail: Object.fromEntries(collected.map((a, i) => [`q${i}`, a.correct])),
        attempts: collected,
        completedAt: Date.now(),
      });
      setPhase('result');
      return;
    }
    setIdx((i) => i + 1);
    setPhase('recall');
    setRecalled('');
    setConfidence(null);
    setPicked(null);
  };

  return (
    <div className="flex flex-col gap-lg">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-xs">
          <p className="eyebrow text-ink/60">RETRIEVAL QUIZ</p>
          <span className="caption rounded-pill bg-surface-soft px-sm py-xxs text-ink/60">
            {mode === 'block' ? '블록 학습' : '혼합 출제'}
          </span>
        </div>
        <p className="caption text-ink/50">
          {idx + 1} / {questions.length}
        </p>
      </header>

      {/* 제시: 예시 카피 */}
      <div className="color-block bg-block-coral">
        <p className="caption text-ink/60">이 카피가 쓰는 기법은?</p>
        <p className="mt-sm text-headline font-540 leading-snug">"{q.prompt}"</p>
      </div>

      {/* ① 백지 인출 + ⑦ 확신도 — 보기 노출 게이트 */}
      {phase === 'recall' && (
        <div className="flex flex-col gap-md rounded-lg border border-hairline p-lg">
          <label className="flex flex-col gap-xs">
            <span className="caption text-ink/50">먼저 떠올려 적어보세요 (보기는 그 다음)</span>
            <textarea
              value={recalled}
              onChange={(e) => setRecalled(e.target.value)}
              rows={2}
              placeholder="예: 호기심? 손실 회피?"
              className="w-full rounded-md border border-hairline p-sm text-body font-320 focus:border-primary"
            />
          </label>
          <ConfidenceMeter value={confidence} onChange={setConfidence} />
          <button
            type="button"
            disabled={confidence === null}
            onClick={() => setPhase('choose')}
            className="btn-primary w-full disabled:opacity-40"
          >
            보기 확인하기
          </button>
        </div>
      )}

      {/* 보기 선택 + 피드백 */}
      {(phase === 'choose' || phase === 'feedback') && (
        <div className="flex flex-col gap-sm">
          <div className="grid gap-xs sm:grid-cols-2">
            {choices.map((cardId) => {
              const card = cardById[cardId];
              const isAnswer = cardId === q.answerCardId;
              const isPicked = cardId === picked;
              let cls = 'border-hairline bg-canvas';
              if (phase === 'feedback') {
                if (isAnswer) cls = 'border-semantic-success bg-block-mint';
                else if (isPicked) cls = 'border-semantic-danger bg-block-pink';
              }
              return (
                <button
                  key={cardId}
                  type="button"
                  onClick={() => choose(cardId)}
                  disabled={phase === 'feedback'}
                  className={`min-h-[56px] rounded-md border p-md text-left text-body font-480 transition-colors ${cls}`}
                >
                  {card.icon} {card.name}
                </button>
              );
            })}
          </div>

          {phase === 'feedback' && (
            <Feedback
              q={q}
              correct={correct}
              overconfident={attempts[attempts.length - 1]?.overconfident}
              onNext={next}
            />
          )}
        </div>
      )}
    </div>
  );
}

function Feedback({
  q,
  correct,
  overconfident,
  onNext,
}: {
  q: QuizQuestion;
  correct: boolean;
  overconfident?: boolean;
  onNext: () => void;
}) {
  return (
    <div className="flex flex-col gap-sm rounded-lg border border-hairline p-lg">
      <p
        className={`text-card-title font-700 ${
          correct ? 'text-semantic-success' : 'text-semantic-danger'
        }`}
      >
        {correct ? '정답 ✓' : '오답 ✕'}
      </p>
      {overconfident && (
        <p className="rounded-md bg-block-pink p-sm text-body-sm font-540 text-ink">
          ⚠️ 착각 경고 — 확신했지만 틀렸습니다. 이 카드를 우선 복습합니다.
        </p>
      )}
      <p className="text-body font-320 text-ink/80">
        정답: <strong className="font-540">{cardById[q.answerCardId].name}</strong> — {q.explanation}
      </p>
      <button type="button" onClick={onNext} className="btn-primary w-full">
        다음
      </button>
    </div>
  );
}

function Result({ attempts, onRetry }: { attempts: RecallAttempt[]; onRetry: () => void }) {
  const correct = attempts.filter((a) => a.correct).length;
  const score = Math.round((correct / attempts.length) * 100);
  const grade = toGrade(score);
  const cal = calibrationReport(attempts);

  return (
    <div className="flex flex-col gap-lg">
      <div className="color-block bg-block-navy text-inverse-ink">
        <p className="caption text-inverse-ink/70">QUIZ RESULT</p>
        <p className="mt-sm text-display-xl font-340 leading-none">{grade}</p>
        <p className="mt-xs text-body-lg font-330">
          {correct}/{attempts.length} 정답 · {score}점
        </p>
      </div>

      <div className="rounded-lg border border-hairline p-lg">
        <p className="caption text-ink/50">확신도 보정 리포트</p>
        <ul className="mt-sm flex flex-col gap-xs text-body font-320">
          <li>
            ⚠️ 과신(확신했지만 오답): <strong className="font-540">{cal.overconfident}건</strong>
          </li>
          <li>
            💡 과소(자신없었지만 정답): <strong className="font-540">{cal.underconfident}건</strong>
          </li>
          <li>
            🎯 보정 정확도: <strong className="font-540">{Math.round(cal.accuracy * 100)}%</strong>
          </li>
        </ul>
        <p className="mt-sm text-body-sm font-330 text-ink/60">
          "쉽게 느껴지면 의심하라" — 과신 카드는 복습 큐에서 먼저 만납니다.
        </p>
      </div>

      <button type="button" onClick={onRetry} className="btn-primary w-full">
        새 세트 풀기
      </button>
    </div>
  );
}
