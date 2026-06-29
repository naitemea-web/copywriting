import type { Confidence } from '@/types';

interface ConfidenceMeterProps {
  value: Confidence | null;
  onChange: (c: Confidence) => void;
}

const LEVELS: { value: Confidence; label: string }[] = [
  { value: 1, label: '그냥 찍음' },
  { value: 2, label: '가물가물' },
  { value: 3, label: '꽤 확신' },
  { value: 4, label: '확실해요' },
];

// ⑦ 메타인지 — 확신도 1~4. 선택 = 프라이머리 면 (design.md 선택 상태 규칙).
export default function ConfidenceMeter({ value, onChange }: ConfidenceMeterProps) {
  return (
    <div className="flex flex-col gap-xs">
      <p className="caption text-ink/65">얼마나 확신하나요?</p>
      <div className="flex flex-wrap gap-xs">
        {LEVELS.map((lv) => {
          const active = value === lv.value;
          return (
            <button
              key={lv.value}
              type="button"
              onClick={() => onChange(lv.value)}
              className={`min-h-[44px] rounded-pill px-md text-body-sm font-500 transition-colors ${
                active
                  ? 'bg-primary text-inverse-ink'
                  : 'border border-hairline bg-canvas text-ink hover:bg-surface-soft'
              }`}
            >
              {lv.value} · {lv.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
