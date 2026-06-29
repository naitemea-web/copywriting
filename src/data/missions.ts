import type { MissionCard } from '@/types';

// TPPGE 미션 시드. 출처: 「카피라이팅 바이블」 TPPGE 체크리스트 (spec.md §2.5)
export const missions: MissionCard[] = [
  {
    id: 'mission_english',
    product: '온라인 영어회화 강의',
    target: '영어 울렁증이 있는 30대 직장인',
    goal: '무료체험 신청',
    problem: '10년 공부했지만 외국인 앞에서 한마디도 못 한다',
    emotion: '답답함과 자기 비하',
    promise: '중학교 단어로도 외국인과 프리토킹',
    usp: '3단 패턴 공식 + 1:1 첨삭',
  },
  {
    id: 'mission_diet',
    product: '다이어트 보조제',
    target: '출산 후 체중이 늘어난 30대 여성',
    goal: '첫 구매 전환',
    problem: '운동할 시간도 의지도 없어 매번 실패한다',
    emotion: '거울 보기 싫은 좌절감',
    promise: '하루 한 알, 식단 없이 체지방 관리',
    usp: '식약처 인증 원료 + 환불 보장',
  },
  {
    id: 'mission_ebook',
    product: '재테크 입문 전자책',
    target: '월급만으로 불안한 사회초년생',
    goal: '전자책 구매',
    problem: '돈 공부는 해야겠는데 어디서 시작할지 모른다',
    emotion: '미래에 대한 막연한 불안',
    promise: '월급쟁이도 3개월 안에 첫 투자 시스템 완성',
    usp: '왕초보 전용 30일 실행 로드맵',
  },
];
