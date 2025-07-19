import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from './useAuth';

interface MenuItem {
  name: string;
  path: string;
  position: number;
  label: string;
}

export const useFooterNavigation = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser } = useAuth();
  const [activeMenu, setActiveMenu] = useState<string>('home');
  const [slidePosition, setSlidePosition] = useState(2);

  // 메뉴 아이템을 동적으로 생성 (마이페이지 경로에 닉네임 포함)
  const getMenuItems = (): MenuItem[] => [
    { name: 'home', path: '/main', position: 0, label: '헬프메인' },
    { name: 'hall-of-fame', path: '/user/hall-of-fame', position: 1, label: '명예의 전당' },
    { name: 'chats', path: '/chats/list', position: 2, label: '채팅' },
    { 
      name: 'profile', 
      path: currentUser?.nickname ? `/user/profile/${currentUser.nickname}` : '/user/profile', 
      position: 3, 
      label: '마이페이지' 
    }
  ];

  const menuItems = getMenuItems();

  // 현재 경로에 따라 활성 메뉴 설정
  useEffect(() => {
    const currentMenuItem = menuItems.find(item => {
      if (item.name === 'home') {
        return pathname.includes('/main') || pathname === '/';
      } else if (item.name === 'chats') {
        return pathname.includes('/chats');
      }
      return pathname.includes(item.path);
    });

    if (currentMenuItem) {
      setActiveMenu(currentMenuItem.name);
      setSlidePosition(currentMenuItem.position);
    } else {
      // 기본값 설정
      setActiveMenu('home');
      setSlidePosition(0);
    }
  }, [pathname, menuItems]);

  const handleMenuClick = (menuName: string, path: string, position: number) => {
    setActiveMenu(menuName);
    setSlidePosition(position);
    router.push(path);
  };

  return {
    activeMenu,
    slidePosition,
    handleMenuClick,
    menuItems
  };
}; 