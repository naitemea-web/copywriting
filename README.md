# 카피 마스터 (Copy Master)

학습 과학(인출·분산·메타인지)으로 설계한 **카피라이팅 학습 카드게임**. 백엔드 없는 싱글플레이 웹앱(React + TypeScript + Vite).

## 문서

| 문서 | 내용 |
|------|------|
| [`PRD.md`](./PRD.md) | 제품 요구·학습 과학 원칙·KPI (무엇을·왜) |
| [`spec.md`](./spec.md) | 기술 스택·데이터 구조·로직·화면 (어떻게) |
| [`todo.md`](./todo.md) | 1~10단계 구현 체크리스트 |
| [`design.md`](./design.md) | 디자인 토큰·컴포넌트·반응형 기준 |
| [`agents.md`](./agents.md) | AI 코딩 에이전트 작업 규칙 |

## 시작하기

```bash
npm install
npm run dev        # 개발 서버
npm run typecheck  # 타입 체크
npm run test       # 단위 테스트
npm run build      # 프로덕션 빌드
```

## 폴더 구조

```
src/
├─ data/        # 카드·섹션·미션·퀴즈 정적 시드
├─ types/       # 도메인 타입 (spec.md §5)
├─ store/       # Zustand 진행도/SRS (localStorage 영속)
├─ lib/         # 학습 로직: scoring·srs·calibration·deck·session (순수 함수, 테스트 동반)
├─ components/  # 재사용 UI (Card·RecallStep·ConfidenceMeter 등)
├─ pages/       # 라우트 화면 (Home·Codex·Quiz·Builder·Review·Progress)
├─ App.tsx      # 라우팅
└─ main.tsx
```

현재 상태: **M0 스캐폴드 완료** — 6개 라우트·데이터 시드·학습 로직·테스트·빌드 동작. 다음은 `todo.md` 6단계(카드 도감)부터.
