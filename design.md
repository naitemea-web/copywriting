# design.md — 카피 마스터 디자인 기준

> 참조 시스템: **Figma 마케팅 캔버스**(모노크롬 코어 + 오버사이즈 파스텔 컬러블록).
> 이 문서는 그 어휘를 카피 마스터(학습 카드게임)에 맞게 적용한 단일 디자인 기준이다.
> 토큰 구현체: `tailwind.config.js` · `src/index.css`. **값 변경 시 이 문서와 함께 갱신한다.**

---

## Overview

카피 마스터는 시스템 레벨에서 **에디토리얼처럼 깨끗한 흑백 프레임**이다. 크롬(상단 내비,
본문 타입, 푸터, 기본 CTA)은 모노크롬이다. 헤드라인은 `figmaSans` 대체 폰트(**Inter**)로
크게 세팅하고 음수 트래킹을 공격적으로 준다. 본문은 같은 가변 폰트의 weight 320–340 부근,
작은 모노(`figmaMono` → **JetBrains Mono**) 라벨은 대문자·양수 트래킹으로 섹션 마커 역할만 한다.
모든 CTA는 알약(pill) 모양이고, 사이트 전역의 기본 액션은 동일한 검정 `button-primary` /
흰색 `button-secondary` 쌍이다.

이 디자인의 정체성은 그 흑백 북엔드 **사이**에서 일어난다. 페이지는 반복적으로 **오버사이즈
파스텔 컬러블록**(라임·라일락·크림·민트·핑크·코랄·딥네이비)으로 떨어진다. 블록은 콘텐츠 폭
전체를 차지하고 `rounded.lg` 모서리와 `spacing.xxl` 내부 패딩을 가진다. 카피 마스터에서
**이 컬러블록은 곧 학습의 4단계 설득 회로(주목·신뢰·가치·행동)를 색으로 구분하는 장치**다.
블록은 장식이 아니라 화면 하나만큼의 세로 공간을 점유하는 "거대한 스티키 노트"다.

대비로 작동하는 시스템이다. 모노크롬 크롬이 컬러블록을 "의도적"으로 보이게 하고, 컬러블록이
크롬을 "엔터프라이즈 SaaS가 아닌 에디토리얼 종이"처럼 보이게 한다. 그림자·그라데이션에
기대지 않는다 — 색과 자신감 있는 타이포가 그 일을 한다.

**핵심 특징**
- 모노크롬 코어: `primary`(검정)·`canvas`(흰색)가 모든 CTA·본문·푸터를 책임진다.
- 오버사이즈 파스텔 컬러블록이 모든 롱폼 화면의 서사 리듬을 만든다.
- 버튼은 오직 pill — 텍스트 CTA는 `rounded.pill`, 아이콘 버튼은 `rounded.full`. 사각 버튼 없음.
- Inter를 미세 weight(320·330·340·450·480·540·700)로 운용 — 다중 weight 패밀리가 아니라 "하나의 목소리가 휘는" 느낌.
- 디스플레이 사이즈에 강한 음수 자간(-1.72px@86px) → 에디토리얼 운율.
- 모노는 본문이 아니라 **분류(taxonomy)** — 아이브로·캡션 전용, 항상 대문자.

---

## 학습 4단계 ↔ 컬러블록 매핑 (카피 마스터 고유)

> 가장 중요한 결정: 새 섹션을 만들 때 **먼저 어느 stage(색)인지** 정한다.

| stage | 한글 | 컬러블록 토큰 | 텍스트 | 용도 |
|-------|------|---------------|--------|------|
| `attention` | 주목 | `block-coral` | `ink` | 후킹·인출 퀴즈 시작 |
| `trust` | 신뢰 | `block-lilac` | `ink` | 사회적 증거·권위·증거 섹션 |
| `value` | 가치 | `block-lime` | `ink` | 솔루션·오퍼·9섹션 빌더 |
| `action` | 행동 | `block-navy` | `inverse-ink` | CTA·긴급성·결과(유일한 다크 블록) |
| — | 보조 | `block-cream`·`block-mint`·`block-pink` | `ink` | 도감/기록 등 중립 섹션 배경 |

규칙: **한 화면(viewport) 안에 컬러블록은 하나만** 보이게 하고, 블록 사이는 흰 캔버스로 되돌린다.

---

## Colors

> 구현: `tailwind.config.js` `theme.extend.colors`. 파스텔 hex는 참조 근사값(아래 Known Gaps).

### Brand & Accent
- **`primary`** `#0A0A0A` — 시스템 프라이머리. 모든 기본 CTA·헤드라인·본문·다크 표면의 잉크.
- **`canvas`** `#FFFFFF` — 기본 배경, 흰 카드 본문, `button-secondary` 전경.
- **`accent-magenta`** `#F31E7A` — 단발성 프로모 CTA 전용(페이지당 1회). 섹션 색 아님.

### Surface
- **`surface-soft`** `#F5F5F4` — 오프화이트 타일(아이콘 버튼·카드 썸네일·일러스트 타일).
- **`hairline`** `#E5E5E5` / **`hairline-soft`** `#F0F0F0` — 1px 보더·구분선.
- **컬러블록**: `block-lime` `#DCF26B` · `block-lilac` `#E2D8FB` · `block-cream` `#F4EEDD` · `block-mint` `#C7F0D8` · `block-pink` `#FAD6E5` · `block-coral` `#FBC4AE` · `block-navy` `#1E2140`.

### Text
- **`ink`** `#0A0A0A` — 라이트 표면 위 모든 헤드라인·본문·캡션. **미드그레이 텍스트 역할은 없다.** 위계는 불투명도가 아니라 **weight**가 만든다(본문은 항상 검정 320–340).
- **`inverse-ink`** `#FFFFFF` — 다크 표면(네이비 블록·푸터·marquee) 위 텍스트.
- 다크 표면 위 반투명은 `ink/70`처럼 렌더 시점 alpha로 처리(예: 보조 내비 링크).

### Semantic
- **`semantic-success`** `#1FA463` — 정답·체크 글리프(면이 아니라 글리프 색).
- **`semantic-danger`** `#E5484D` — 오답·**착각 경고(과신+오답)** 표시.

---

## Typography

### Font Family
- **Inter** (figmaSans 대체) — 가변 weight. fallback `system-ui, helvetica`. weight 축을 미세하게 운용(320·330·340·450·480·540·700)해 "하나의 목소리"로 읽히게 한다.
- **JetBrains Mono** (figmaMono 대체) — 아이브로·캡션 전용. 항상 대문자 + 양수 자간.
- OpenType `kern` 전 역할에 활성. *Inter는 x-height가 높아 line-height를 약 0.02 낮춰 보정.*

### Hierarchy (토큰 = `tailwind fontSize`)

| 토큰 | Size | Weight | Line H | 자간 | 용도 |
|------|------|--------|--------|------|------|
| `display-xl` | 86px | 340 | 1.00 | -1.72px | 히어로 헤드라인 |
| `display-lg` | 64px | 340 | 1.10 | -0.96px | 섹션 오프너 |
| `headline` | 26px | 540 | 1.35 | -0.26px | 컬러블록 내 스토리 타이틀 |
| `subhead` | 26px | 340 | 1.35 | -0.26px | 롱폼 인트로 문단 |
| `card-title` | 24px | 700 | 1.45 | 0 | 카드 타이틀(기법 카드 앞면 등) |
| `body-lg` | 20px | 330 | 1.40 | -0.14px | 히어로 리드 카피·폼 라벨 |
| `body` | 18px | 320 | 1.45 | -0.26px | 기본 본문 |
| `body-sm` | 16px | 330 | 1.45 | -0.14px | 카드 본문·내비·푸터 링크 |
| `link` / `button` | 20px | 480 | 1.40 | -0.10px | 인라인 링크·모든 pill 버튼 |
| `eyebrow` | 18px | 400 | 1.30 | 0.54px | JetBrains Mono 대문자 아이브로 |
| `caption` | 12px | 400 | 1.00 | 0.60px | 모노 대문자 캡션·푸터 헤드 |

### 원칙
- **본문 위계는 size가 아니라 weight.** 20px@330 옆 20px@480 링크로 강조를 읽힌다.
- **음수 자간은 size에 비례.** display-xl은 -1.72px, 본문은 거의 0.
- **모노는 분류 도구.** 문단에 JetBrains Mono를 쓰지 않는다.
- **디스플레이는 타이트(1.0–1.1), 본문은 넉넉(1.40–1.45).**

---

## Layout

- **Base unit 8px.** 토큰: `hair`1 · `xxs`4 · `xs`8 · `sm`12 · `md`16 · `lg`24 · `xl`32 · `xxl`48 · `section`96.
- **컬러블록 내부 패딩** `xxl`(48px), **카드 내부 패딩** `lg`(24px).
- **버튼 패딩** pill 기준 세로 `xs`(8px)·가로 `lg`(24px), 최소 탭 높이 44px.
- **컨테이너 최대폭 `content`(1280px)**, 사이드 거터는 데스크톱 `xxl` → 모바일 `lg`.
- **섹션 간 리듬 상수 `section`(96px)** — 모든 롱폼 화면에서 동일.
- 컬러블록은 컬럼 그리드를 깨고 콘텐츠 폭을 꽉 채운 뒤, 그 안에 헤드라인+본문 1열을 둔다.
- **여백 철학**: 컬러블록을 "의도적"으로 보이게 하려고 블록과 블록 사이에 흰 캔버스 96px을 둔다. 블록 안에서는 타입에 넉넉한 좌우 마진을 줘 "포스터"처럼 읽히게 한다.

---

## Elevation & Depth

| 레벨 | 처리 | 용도 |
|------|------|------|
| 0 (flat) | 그림자·보더 없음 | 컬러블록·다크 푸터·히어로 (기본) |
| 1 (hairline) | `canvas` 위 1px `hairline` 보더 | 기법 카드·폼 인풋·결과 행 |
| 2 (soft) | `shadow-soft` (0 4px 16px rgba(0,0,0,.06)) | 떠 있는 타일·드롭다운만 |
| 3 (modal) | 강한 그림자 + 60% 스크림 | 결과 모달·라이트박스 |

그림자는 최대한 아낀다 — **색이 곧 깊이 장치**다. 흰 카드를 그림자로 띄우는 대신
채도 있는 배경 패널(컬러블록)로 주의를 만든다.

---

## Shapes (Border Radius)

| 토큰 | 값 | 용도 |
|------|-----|------|
| `xs` | 2px | 링크 장식 |
| `sm` | 6px | 칩·서브탭·스티키노트 모서리 |
| `md` | 8px | 폼 인풋·이미지 프레임·썸네일 타일 |
| `lg` | 24px | 카드·컬러블록 섹션·큰 컨테이너 |
| `xl` | 32px | 히어로 패널·대형 콜아웃 |
| `pill` | 50px | 모든 텍스트 CTA·탭 토글 |
| `full` | 9999px | 원형 아이콘 버튼·체크 글리프 |

이미지 프레임은 `md`(8px). 아바타 원형은 마케팅/게임 화면에 쓰지 않는다(인격화 회피).

---

## Components

### Buttons
- **`btn-primary`** — 검정 pill, 텍스트 `inverse-ink`, `button` 타이포, 패딩 8/24, `rounded-pill`, 최소높이 44px. 누름 상태는 micro-scale(`active:scale-[0.98]`). 구현: `index.css .btn-primary`.
- **`btn-secondary`** — 흰 pill + 검정 텍스트. primary의 시각적 짝. 보더 없음(또는 `hairline` 1px).
- **`button-icon-circular`** — 40px 원형(`surface-soft` 배경). 다크 표면 위에서는 반투명 흰색.
- **`button-magenta-promo`** — `accent-magenta` pill. 이미 색이 깔린 패널 위 단발성 프로모 CTA 전용.

### 학습 전용 컴포넌트 (카피 마스터 고유)
- **`Card`** (기법 카드) — 앞면: `card-title`(이름)+아이콘+stage 색 라벨. 뒷면: 원리·예시·효과. 뒤집기는 Framer Motion. 레벨1(hairline) 또는 stage 컬러 톤.
- **`RecallStep`** ① — **인출 게이트.** 정답/보기를 가린 입력/확인 영역. 통과 전에는 절대 정답 노출 안 함. 시각적으로 "가림막"이 분명해야 한다.
- **`ConfidenceMeter`** ⑦ — 확신도 1~4 선택. pill 4개 토글(선택 = `primary` 면, 비선택 = `canvas`+hairline). 선택 = 프라이머리 표면 규칙을 그대로 적용.
- **`SectionSlot` / `Hand`** — 9섹션 드롭 슬롯(빈 슬롯은 `surface-soft`+점선 hairline)과 핸드. dnd-kit.
- **`ResultModal`** — 레벨3. 점수/등급 + 모범 카피 + 보정 리포트. 과신 항목은 `semantic-danger`로 표시.
- **`ReviewNudge`** ⑤ — 세션 종료 넛지. 라일락/크림 톤 배너 + 1개 CTA.

### Feedback 색 규칙
정답/맞음 = `semantic-success`, 오답/착각 = `semantic-danger`. 0.3초 내 색·모션 반응(즉각 피드백).

---

## Do's & Don'ts

### Do
- 새 섹션은 **먼저 stage(컬러블록)** 를 정하고 콘텐츠 폭 전체에 `rounded-lg`+`xxl` 패딩으로 깐다.
- 타입은 Inter 가변 weight 집합(320·330·340·480·540·700)에서만 고른다.
- JetBrains Mono는 아이브로·캡션에만, 항상 대문자.
- 모든 CTA = pill, 모든 아이콘 버튼 = 원. 선택 상태 = 프라이머리 면(`ConfidenceMeter` 선택 등).
- 두 컬러블록 사이는 흰 캔버스 `section`(96px)으로 되돌린다.

### Don't
- 미드그레이 본문 텍스트 도입(위계는 weight로). 컬러블록에 드롭섀도 추가.
- 토큰 밖 새 액센트 색 도입(`block-*`·`accent-magenta` 외 금지).
- 한 viewport에 컬러블록 2개 동시 노출. 사각형 CTA. 본문에 모노.
- **인출 게이트를 시각적으로 약화**(정답이 비치거나 미리 보이게) — 학습 메커닉 훼손.

---

## Responsive Behavior

| 이름 | 폭 | 핵심 변화 |
|------|-----|-----------|
| Desktop | ≥1280px | 최대폭 1280px, 거터 `xxl` |
| Tablet | 960px | 내비 햄버거화, 그리드 2-up |
| Mobile-L | 768px | 컬러블록 풀블리드(모서리 제거, 포스터 효과) |
| Mobile | 560px | `display-xl` 86→~48px, pill CTA 풀폭 |

- **모바일 우선.** 카드게임은 세로 한 손 기준. 모든 탭 타깃 ≥44px(폼 인풋 48px).
- 768px 미만에서 컬러블록은 뷰포트 끝까지 블리드(모서리 제거). 이상에서는 캔버스 여백으로 둥근 모서리가 보이게.
- 드래그앤드롭(9섹션 빌더)은 터치에서 동작 확인 필수.

---

## Iteration Guide

1. 한 번에 컴포넌트 하나씩, 토큰 이름으로 참조한다(`btn-primary`, `color-block` 등).
2. 새 섹션은 **stage(컬러블록) 결정**이 가장 중요한 선택.
3. 본문 기본은 `body`. 컬러블록 안에서만 `subhead`/`headline`으로 키운다.
4. `primary`는 희소하게. 한 viewport에 `btn-primary`가 둘이면 한쪽을 `btn-secondary`로 중화.
5. `accent-magenta`는 페이지당 1회.
6. 토큰을 바꾸면 `tailwind.config.js` → 이 문서 순서로 동기화.

---

## Known Gaps

- 파스텔 `block-*` hex는 참조 스크린샷 기반 **근사값**이다. 실제 브랜드 토큰과 다를 수 있으니 충실한 근사로 취급한다.
- 다크 모드는 별도 정의하지 않는다(가장 가까운 것은 `block-navy`·다크 푸터).
- 폼 에러/검증 스타일은 미정(인풋은 hairline 보더 + `rounded-md`만 확정).
- marquee·컬러블록 등장 애니메이션 디테일은 이 문서 범위 밖(구현 시 Framer Motion으로).
- 폰트 대체: figmaSans/figmaMono 미보유로 **Inter / JetBrains Mono** 사용. 라이선스 확보 시 교체 가능하나 weight 축·자간 규칙은 유지한다.
