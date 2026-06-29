import { sections } from '@/data/sections';

// 완성본 미리보기 — 9섹션 모범 카피를 한 편의 상세페이지로 세로 렌더.
export default function CopyPreview() {
  return (
    <article className="flex flex-col gap-md rounded-lg border border-hairline p-lg">
      <p className="caption text-ink/65">완성된 상세페이지 (모범 답안)</p>
      {sections.map((s) => (
        <section key={s.id} className="border-t border-hairline-soft pt-sm first:border-t-0 first:pt-0">
          <p className="caption text-ink/60">
            {s.order}. {s.name}
          </p>
          <p className="mt-xxs text-body font-400 leading-relaxed">{s.modelCopy}</p>
        </section>
      ))}
    </article>
  );
}
