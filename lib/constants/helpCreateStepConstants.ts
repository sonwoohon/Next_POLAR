import styles from '@/app/(pola)/helps/create/components/Step1Help/Step1HelpType.module.css';

export const helpTypes = [
  {
    description: '무거운 짐을 들거나, 젊은 친구가 힘을 써야 해요!',
    iconClass: styles.optionIconHeavy,
    subCategoryId: 6, // 짐 나르기
  },
  {
    description: '청소나 정리가 필요해요!',
    iconClass: styles.optionIconClean,
    subCategoryId: 7, // 청소
  },
  {
    description: '농경 보조 작업을 도와주세요!',
    iconClass: styles.optionIconHeavy,
    subCategoryId: 8, // 수확(농경 보조)
  },
  {
    description: '재난/재해 봉사 활동을 도와주세요!',
    iconClass: styles.optionIconHeavy,
    subCategoryId: 9, // 재난/재해 봉사
  },
  {
    description: '김장 작업을 도와주세요!',
    iconClass: styles.optionIconHeavy,
    subCategoryId: 10, // 김장
  },
  {
    description: '스마트폰 사용에 대해 질문이 있어요!',
    iconClass: styles.optionIconDifficult,
    subCategoryId: 11, // 스마트폰 질문
  },
  {
    description: '대리 상담을 도와주세요!',
    iconClass: styles.optionIconComplex,
    subCategoryId: 12, // 대리 상담
  },
  {
    description: '재능 기부를 도와주세요!',
    iconClass: styles.optionIconLearn,
    subCategoryId: 13, // 재능기부
  },
  {
    description: '가벼운 배달을 도와주세요!',
    iconClass: styles.optionIconErrand,
    subCategoryId: 14, // 가벼운 배달
  },
  {
    description: '장보기를 도와주세요!',
    iconClass: styles.optionIconErrand,
    subCategoryId: 15, // 장보기(편의점 등)
  },
  {
    description: '콘서트 예매를 도와주세요!',
    iconClass: styles.optionIconErrand,
    subCategoryId: 16, // 콘서트 예매
  },
  {
    description: '가벼운 대화와 교감을 나누고 싶어요!',
    iconClass: styles.optionIconLearn,
    subCategoryId: 17, // 가벼운 대화(교감)
  },
  {
    description: '간단한 상담을 받고 싶어요!',
    iconClass: styles.optionIconComplex,
    subCategoryId: 18, // 간단한 상담
  },
  {
    description: '티켓팅 줄 서기를 도와주세요!',
    iconClass: styles.optionIconErrand,
    subCategoryId: 19, // 티켓팅 줄 서기
  },
] as const;

export const timeTypes = [
  {
    id: 'now',
    label: '지금 당장',
    description: '바로 도움이 필요해요',
  },
  {
    id: 'tomorrow',
    label: '내일',
    description: '내일 도움이 필요해요',
  },
  {
    id: 'specific',
    label: '특정 날짜',
    description: '원하는 날짜와 시간을 선택해요',
  },
] as const;

export const timeSlots = [
  '07:00',
  '07:30',
  '08:00',
  '08:30',
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '12:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
  '18:00',
  '18:30',
  '19:00',
  '19:30',
  '20:00',
  '20:30',
  '21:00',
  '21:30',
  '22:00',
] as const;
