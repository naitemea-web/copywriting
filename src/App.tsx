import { useEffect, useState } from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Codex from './pages/Codex';
import Quiz from './pages/Quiz';
import Builder from './pages/Builder';
import Review from './pages/Review';
import Progress from './pages/Progress';
import { shouldNudgeRest } from './lib/session';
import { evaluateBadges } from './lib/badges';
import { useGameStore } from './store/gameStore';

const NAV = [
  { to: '/review', label: '오늘의 복습' },
  { to: '/codex', label: '카드 도감' },
  { to: '/quiz', label: '인출 퀴즈' },
  { to: '/builder', label: '9섹션 빌더' },
  { to: '/progress', label: '내 기록' },
];

export default function App() {
  const pacing = useSessionPacing();
  useBadgeUnlocks();

  return (
    <div className="min-h-dvh bg-canvas text-ink">
      <header className="sticky top-0 z-10 flex h-14 items-center gap-lg border-b border-hairline-soft bg-canvas px-lg">
        <NavLink to="/" className="text-card-title font-700 tracking-tight">
          카피 마스터
        </NavLink>
        <nav className="flex flex-1 items-center gap-md overflow-x-auto">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                `whitespace-nowrap text-body-sm font-330 ${
                  isActive ? 'font-540 text-ink' : 'text-ink/70'
                }`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>
        {pacing.minutes > 0 && (
          <span className="caption hidden shrink-0 text-ink/40 sm:inline">
            세션 {pacing.minutes}분
          </span>
        )}
      </header>

      {/* ⑤ 세션 페이싱 넛지 — 12분 초과 시 */}
      {pacing.showNudge && (
        <div className="flex items-center gap-sm bg-block-lilac px-lg py-sm">
          <p className="text-body-sm font-480">
            🌙 {pacing.minutes}분째 집중 중! 한 세트만 더 마치고 쉬면 기억에 더 잘 남아요.
          </p>
          <button
            type="button"
            onClick={pacing.dismiss}
            className="caption ml-auto rounded-pill bg-canvas px-sm py-xxs"
          >
            알겠어요
          </button>
        </div>
      )}

      <main className="mx-auto max-w-content px-lg py-section">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/review" element={<Review />} />
          <Route path="/codex" element={<Codex />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/builder" element={<Builder />} />
          <Route path="/progress" element={<Progress />} />
        </Routes>
      </main>
    </div>
  );
}

// ⑤ 세션 8~12분 페이싱 — 경과 시간 추적 + 12분 초과 넛지
function useSessionPacing() {
  const [start] = useState(() => Date.now());
  const [now, setNow] = useState(() => Date.now());
  const [dismissed, setDismissed] = useState(false);
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(t);
  }, []);
  return {
    minutes: Math.floor((now - start) / 60_000),
    showNudge: shouldNudgeRest(start, now) && !dismissed,
    dismiss: () => setDismissed(true),
  };
}

// 진행도 변화 시 새로 충족된 배지를 자동 해금
function useBadgeUnlocks() {
  const totalPlays = useGameStore((s) => s.totalPlays);
  const streakDays = useGameStore((s) => s.streakDays);
  const unlockBadge = useGameStore((s) => s.unlockBadge);
  useEffect(() => {
    const earned = evaluateBadges(useGameStore.getState());
    earned.forEach(unlockBadge);
  }, [totalPlays, streakDays, unlockBadge]);
}
