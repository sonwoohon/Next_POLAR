import { useEffect, useRef, useState } from 'react';

export const useHeaderScroll = () => {
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        setHidden(true); // 아래로 스크롤하면 숨김
      } else {
        setHidden(false); // 위로 스크롤하면 보임
      }
      lastScrollY.current = currentScrollY;

      // 스크롤 멈춤 감지
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => {
        setHidden(false); // 스크롤 멈추면 다시 보임
      }, 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, []);

  return { hidden };
}; 