interface OnboardingSlide {
  title: string;
  desc: string;
}

export const useOnboardingData = () => {
  const slides: OnboardingSlide[] = [
    {
      title: '함께하는 마음, 두 세대의 연결',
      desc: '도움이 필요한 실버와\n따뜻한 손길을 내미는 주니어가\n서로를 만나는 공간입니다.'
    },
    {
      title: '요청과 도움, 모두의 성장',
      desc: '주니어의 작은 요청이\n주니어의 소중한 경험이 됩니다.\n서로의 일상에 힘이 되어주세요.'
    },
    {
      title: '정성스러운 봉사, 소중한 보상',
      desc: '주니어의 진심 어린 도움에는\n폴라 스코어로 감사의 마음을 전합니다.'
    },
    {
      title: '안전하고 따뜻한 소통',
      desc: '믿을 수 있는 채팅과\n투명한 시스템으로\n모두가 안심할 수 있습니다.'
    }
  ];

  const swiperConfig = {
    modules: ['Autoplay', 'Pagination'],
    spaceBetween: 30,
    slidesPerView: 1,
    autoplay: { delay: 30000000, disableOnInteraction: false },
    pagination: { clickable: true },
    loop: true,
  };

  return {
    slides,
    swiperConfig,
  };
}; 