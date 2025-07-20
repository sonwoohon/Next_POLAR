'use client';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

// Header를 숨길 페이지들
const hideHeaderPaths = [
  '/login',
  '/sign-up',
  '/find-password',
  '/',
];

// Footer를 숨길 페이지들
const hideFooterPaths = [
  '/login',
  '/sign-up',
  '/user/hall-of-fame',
  '/find-password',
  '/',
];

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  
  const shouldShowHeader = !hideHeaderPaths.includes(pathname);
  const shouldShowFooter = !hideFooterPaths.includes(pathname);

  return (
    <>
      {shouldShowHeader && <Header />}
      <main className='main-container'>{children}</main>
      {shouldShowFooter && <Footer />}
    </>
  );
} 