import type { QuizQuestion } from '@/types';

// 인출 퀴즈 시드: 예시 카피 → 어떤 기법인가? 출처: 「카피라이팅 바이블」 예시.
export const quizQuestions: QuizQuestion[] = [
  {
    id: 'q_curiosity',
    prompt: '왜 부자들은 가계부를 안 쓸까?',
    answerCardId: 'curiosity',
    choiceCardIds: ['curiosity', 'authority', 'loss_aversion', 'anchoring'],
    explanation: '아는 것과 알고 싶은 것 사이 빈칸을 만든 호기심(정보 격차 이론).',
  },
  {
    id: 'q_social_proof',
    prompt: '누적 판매 1,423건, 5차 재입고 완료',
    answerCardId: 'social_proof',
    choiceCardIds: ['social_proof', 'framing', 'curiosity', 'orienting'],
    explanation: '다수의 선택을 보여주는 사회적 증거(동조 심리).',
  },
  {
    id: 'q_anchoring',
    prompt: '정상가 180,000 → 특별가 39,000',
    answerCardId: 'anchoring',
    choiceCardIds: ['anchoring', 'loss_aversion', 'social_proof', 'authority'],
    explanation: '처음 본 숫자에 닻을 내리게 하는 참조점(앵커 효과).',
  },
  {
    id: 'q_loss_aversion',
    prompt: '지금 안 사면 40% 할인이 사라집니다',
    answerCardId: 'loss_aversion',
    choiceCardIds: ['loss_aversion', 'anchoring', 'framing', 'curiosity'],
    explanation: '잃는 고통을 자극하는 손실 회피(전망 이론).',
  },
  {
    id: 'q_authority',
    prompt: '토익 만점 15회, 강남 YBM 1타 강사',
    answerCardId: 'authority',
    choiceCardIds: ['authority', 'social_proof', 'framing', 'hook_number'],
    explanation: '전문가 앞에서 판단을 유보하게 하는 권위.',
  },
  {
    id: 'q_framing',
    prompt: '수강료 30만 원 → 월 수익 자산 투자 30만 원',
    answerCardId: 'framing',
    choiceCardIds: ['framing', 'anchoring', 'loss_aversion', 'authority'],
    explanation: '같은 사실을 다른 틀에 담아 인식을 바꾸는 프레이밍.',
  },
  {
    id: 'q_hook_number',
    prompt: '하루 2시간 투자로 3개월 만에 월 200만 원 버는 법',
    answerCardId: 'hook_number',
    choiceCardIds: ['hook_number', 'hook_mystery', 'hook_reverse', 'curiosity'],
    explanation: '구체적 숫자+기간+결과로 즉시 이미지화하는 후킹.',
  },
  {
    id: 'q_hook_reverse',
    prompt: '당신이 가난한 이유는 너무 열심히 일하기 때문입니다',
    answerCardId: 'hook_reverse',
    choiceCardIds: ['hook_reverse', 'hook_pain', 'orienting', 'hook_expert'],
    explanation: '통념을 부정해 반사적 집중을 유도하는 상식 뒤집기.',
  },
];
