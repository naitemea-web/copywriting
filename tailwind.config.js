/** @type {import('tailwindcss').Config} */
// 디자인 토큰의 단일 출처는 design.md. 값 변경 시 design.md와 동기화할 것.
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // ===== Monochrome core =====
        primary: '#0A0A0A', // black — 모든 primary CTA·헤드라인·본문
        canvas: '#FFFFFF', // white — 기본 배경
        ink: '#0A0A0A', // 라이트 표면 위 모든 텍스트(weight로 위계)
        'inverse-canvas': '#0A0A0A', // footer·marquee·다크 표면
        'inverse-ink': '#FFFFFF',
        'surface-soft': '#F5F5F4', // 오프화이트 타일(아이콘 버튼·카드)
        hairline: '#E5E5E5',
        'hairline-soft': '#F0F0F0',
        'accent-magenta': '#F31E7A', // 단발성 프로모 CTA 전용

        // ===== Pastel color blocks (서사 리듬) =====
        'block-lime': '#DCF26B',
        'block-lilac': '#E2D8FB',
        'block-cream': '#F4EEDD',
        'block-mint': '#C7F0D8',
        'block-pink': '#FAD6E5',
        'block-coral': '#FBC4AE',
        'block-navy': '#1E2140',

        // ===== Semantic =====
        'semantic-success': '#1FA463', // 정답·체크
        'semantic-danger': '#E5484D', // 오답·착각 경고
      },
      borderRadius: {
        xs: '2px',
        sm: '6px',
        md: '8px',
        lg: '24px',
        xl: '32px',
        pill: '50px',
        full: '9999px',
      },
      spacing: {
        hair: '1px',
        xxs: '4px',
        xs: '8px',
        sm: '12px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        xxl: '48px',
        section: '96px',
      },
      fontFamily: {
        // 한글 가시성을 위해 Pretendard 우선, 영문은 Inter, 그 외 시스템 한글 폰트로 폴백
        sans: [
          'Pretendard',
          'Inter',
          'system-ui',
          '"Apple SD Gothic Neo"',
          '"Malgun Gothic"',
          'sans-serif',
        ],
        mono: ['"JetBrains Mono"', '"SF Mono"', 'menlo', 'monospace'],
      },
      fontSize: {
        // [size, { lineHeight, letterSpacing }]
        'display-xl': ['86px', { lineHeight: '1.0', letterSpacing: '-1.72px' }],
        'display-lg': ['64px', { lineHeight: '1.1', letterSpacing: '-0.96px' }],
        headline: ['26px', { lineHeight: '1.35', letterSpacing: '-0.26px' }],
        subhead: ['26px', { lineHeight: '1.35', letterSpacing: '-0.26px' }],
        'card-title': ['24px', { lineHeight: '1.45', letterSpacing: '0' }],
        'body-lg': ['20px', { lineHeight: '1.4', letterSpacing: '-0.14px' }],
        body: ['18px', { lineHeight: '1.45', letterSpacing: '-0.26px' }],
        'body-sm': ['16px', { lineHeight: '1.45', letterSpacing: '-0.14px' }],
        link: ['20px', { lineHeight: '1.4', letterSpacing: '-0.10px' }],
        button: ['20px', { lineHeight: '1.4', letterSpacing: '-0.10px' }],
        eyebrow: ['18px', { lineHeight: '1.3', letterSpacing: '0.54px' }],
        caption: ['12px', { lineHeight: '1.0', letterSpacing: '0.60px' }],
      },
      fontWeight: {
        // 한글 가시성을 위해 표준 weight 사용
        320: '320',
        400: '400',
        500: '500',
        600: '600',
        330: '330',
        340: '340',
        450: '450',
        480: '480',
        540: '540',
        700: '700',
      },
      maxWidth: {
        content: '1280px',
      },
      boxShadow: {
        soft: '0 4px 16px rgba(0,0,0,0.06)', // 레벨2: 떠 있는 타일·드롭다운만
      },
    },
  },
  plugins: [],
};
