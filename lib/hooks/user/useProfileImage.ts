import { useMemo } from 'react';
import { StaticImageData } from 'next/image';
import DummyUser from '@/public/images/dummies/dummy_user.png';

interface UseProfileImageProps {
  profileImgUrl?: string;
  fallbackImage?: StaticImageData;
}

export const useProfileImage = ({ 
  profileImgUrl, 
  fallbackImage = DummyUser 
}: UseProfileImageProps) => {
  const profileImageUrl = useMemo(() => {
    return profileImgUrl || fallbackImage.src;
  }, [profileImgUrl, fallbackImage]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error('[ProfileImage] 이미지 로드 실패:', profileImgUrl);
    // 이미지 로드 실패 시 더미 이미지로 대체
    const target = e.target as HTMLImageElement;
    target.src = fallbackImage.src;
  };

  return {
    profileImageUrl,
    handleImageError
  };
}; 