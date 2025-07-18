import type { Metadata } from 'next';
import { gangwonEdu, pretendard } from '@/public/fonts/fonts';
import './globals.css';
import { QueryProvider } from '@/app/_components/QueryProvider';
import { ImageProvider } from '@/lib/contexts/ImageContext';
import AuthWrapper from '@/app/_components/layout/AuthWrapper';
import { HelpVerificationProvider } from '@/lib/contexts/HelpVerificationContext';
import VerificationModalWrapper from './_components/VerificationModalWrapper';

export const metadata: Metadata = {
  title: 'POLAR',
  description: '봉사활동이 즐거워지는 곳',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${gangwonEdu.variable} ${pretendard.variable}`}>
        <QueryProvider>
          <ImageProvider>
            <AuthWrapper>
              <HelpVerificationProvider>
                <main className='main-container'>{children}</main>
                <VerificationModalWrapper />
              </HelpVerificationProvider>
            </AuthWrapper>
          </ImageProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
