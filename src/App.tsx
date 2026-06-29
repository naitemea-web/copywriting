import { NavLink, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Codex from './pages/Codex';
import Quiz from './pages/Quiz';
import Builder from './pages/Builder';
import Review from './pages/Review';
import Progress from './pages/Progress';

const NAV = [
  { to: '/', label: '홈', end: true },
  { to: '/review', label: '오늘의 복습' },
  { to: '/codex', label: '카드 도감' },
  { to: '/quiz', label: '인출 퀴즈' },
  { to: '/builder', label: '9섹션 빌더' },
  { to: '/progress', label: '내 기록' },
];

export default function App() {
  return (
    <div className="min-h-dvh bg-canvas text-ink">
      {/* top-nav: 스티키 화이트 바 (design.md) */}
      <header className="sticky top-0 z-10 flex h-14 items-center gap-lg border-b border-hairline-soft bg-canvas px-lg">
        <NavLink to="/" className="text-card-title font-700 tracking-tight">
          카피 마스터
        </NavLink>
        <nav className="flex flex-1 items-center gap-md overflow-x-auto">
          {NAV.slice(1).map((n) => (
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
      </header>

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
