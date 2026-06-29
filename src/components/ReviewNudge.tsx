import { Link } from 'react-router-dom';

// ⑤ 세션 종료 넛지 — "자고 내일 복습" (수면 응고화 + 분산).
export default function ReviewNudge({ message }: { message?: string }) {
  return (
    <div className="rounded-lg bg-block-lilac p-lg">
      <p className="caption text-ink/60">오늘은 여기까지</p>
      <p className="mt-xs text-headline font-540">{message ?? '잘 했어요. 자고 내일 또 만나요 🌙'}</p>
      <p className="mt-xs text-body-sm font-330 text-ink/70">
        한 번에 몰아치기보다, 며칠에 나눠 복습할 때 기억이 가장 오래 남습니다.
      </p>
      <Link to="/" className="btn-primary mt-md inline-flex">
        홈으로
      </Link>
    </div>
  );
}
