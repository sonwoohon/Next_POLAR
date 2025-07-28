'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { UseFormSetValue } from 'react-hook-form';
import styles from '../page.module.css';

interface EditableUserData {
  name: string;
  address: string;
  profileImage?: File;
}

interface ProfileImageSectionProps {
  profileImgUrl?: string;
  setValue: UseFormSetValue<EditableUserData>;
  onImageUpdate: (file: File) => void;
  onImageDelete: () => void;
}

export default function ProfileImageSection({
  profileImgUrl,
  setValue,
  onImageUpdate,
  onImageDelete,
}: ProfileImageSectionProps) {
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showImageMenu, setShowImageMenu] = useState<boolean>(false);
  const imageMenuRef = useRef<HTMLDivElement>(null);

  const handleProfileImageChange = () => {
    fileInputRef.current?.click();
    setShowImageMenu(false);
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // 파일 유효성 검사
      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 선택할 수 있습니다.');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        // 5MB 제한
        alert('파일 크기는 5MB 이하여야 합니다.');
        return;
      }

      // 미리보기 URL 생성
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      // react-hook-form에 파일 설정
      setValue('profileImage', file);
      onImageUpdate(file);
    }
  };

  const handleRemoveProfileImage = async () => {
    try {
      await onImageDelete();
      setPreviewUrl('');
      setShowImageMenu(false);
    } catch (error) {
      console.error('프로필 이미지 삭제 실패:', error);
    }
  };

  // 드롭다운 메뉴 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        imageMenuRef.current &&
        !imageMenuRef.current.contains(event.target as Node)
      ) {
        setShowImageMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.profileImageSection}>
      <div className={styles.profileImageContainer}>
        <Image
          src={previewUrl || profileImgUrl || '/images/dummies/dummy_user.png'}
          alt='Profile'
          width={120}
          height={120}
          className={styles.profileImage}
        />
        <button
          className={styles.cameraButton}
          onClick={() => setShowImageMenu(!showImageMenu)}
        >
          <svg width='16' height='16' viewBox='0 0 24 24' fill='none'>
            <path
              d='M23 19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 21.5304 21 21 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8C1 7.46957 1.21071 6.96086 1.58579 6.58579C1.96086 6.21071 2.46957 6 3 6H7L9 3H15L17 6H21C21.5304 6 22.0391 6.21071 22.4142 6.58579C22.7893 6.96086 23 7.46957 23 8V19Z'
              stroke='white'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              d='M12 17C14.2091 17 16 15.2091 16 13C16 10.7909 14.2091 9 12 9C9.79086 9 8 10.7909 8 13C8 15.2091 9.79086 17 12 17Z'
              stroke='white'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </button>

        {/* Image Menu Dropdown */}
        {showImageMenu && (
          <div className={styles.imageMenu} ref={imageMenuRef}>
            <button
              className={styles.menuItem}
              onClick={handleProfileImageChange}
            >
              사진 업로드
            </button>
            <button
              className={styles.menuItem}
              onClick={handleRemoveProfileImage}
            >
              사진 삭제
            </button>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type='file'
        accept='image/*'
        onChange={handleImageSelect}
        style={{ display: 'none' }}
      />
    </div>
  );
}
