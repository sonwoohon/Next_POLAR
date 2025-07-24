'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import styles from './page.module.css';
import { ROUTES } from '@/lib/constants/routes';

import {
  useUserProfileForUpdate,
  useUpdateUserProfile,
  useUpdateUserProfileImage,
  useDeleteUserProfileImage,
  useChangeUserPassword,
} from '@/lib/hooks';

import ProfileImageSection from './_components/ProfileImageSection';
import ProfileForm from './_components/ProfileForm';
import PasswordChangeModal from './_components/PasswordChangeModal';
import AddressModal from './_components/AddressModal';

// 편집 가능한 사용자 데이터 타입 정의
interface EditableUserData {
  name: string;
  address: string;
  profileImage?: File;
}

export default function UserSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const nickname = params.nickname as string;

  // API에서 사용자 프로필 데이터 가져오기
  const { data: userProfile, isLoading } = useUserProfileForUpdate(nickname);

  const { register, handleSubmit, setValue } = useForm<EditableUserData>({
    defaultValues: {
      name: '',
      address: '',
    },
  });

  // 모달 상태 관리
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  const [isAddressOpen, setIsAddressOpen] = useState<boolean>(false);
  const [addressValue, setAddressValue] = useState<string>('');

  // API 훅들
  const updateProfileMutation = useUpdateUserProfile();
  const updateImageMutation = useUpdateUserProfileImage();
  const deleteImageMutation = useDeleteUserProfileImage();
  const changePasswordMutation = useChangeUserPassword();

  // API 데이터가 로드되면 폼 데이터 업데이트
  useEffect(() => {
    if (userProfile) {
      // 편집 가능한 필드들만 폼에 설정
      setValue('name', userProfile.name || '');
      setValue('address', userProfile.address || '');
      // 주소 값도 설정
      if (userProfile.address) {
        setAddressValue(userProfile.address);
      }
    }
  }, [userProfile, setValue]);

  const onSubmit: SubmitHandler<EditableUserData> = async (data) => {
    try {
      // 프로필 정보 업데이트
      const profileData = {
        name: data.name,
        address: data.address,
      };

      await updateProfileMutation.mutateAsync({
        nickname,
        profileData,
      });

      // 프로필 이미지가 있는 경우 별도로 업데이트
      if (data.profileImage) {
        await updateImageMutation.mutateAsync({
          nickname,
          imageFile: data.profileImage,
        });
      }

      alert('프로필이 성공적으로 업데이트되었습니다.');
      router.push(ROUTES.USER_PROFILE(nickname));
    } catch (error) {
      console.error('프로필 업데이트 실패:', error);
      alert('프로필 업데이트에 실패했습니다.');
    }
  };

  const handleChangePassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    try {
      await changePasswordMutation.mutateAsync({
        nickname,
        passwordData: {
          currentPassword,
          newPassword,
        },
      });

      alert('비밀번호가 성공적으로 변경되었습니다.');
    } catch (error) {
      console.error('비밀번호 변경 실패:', error);
      alert('비밀번호 변경에 실패했습니다.');
      throw error;
    }
  };

  const handleImageUpdate = async (file: File) => {
    try {
      await updateImageMutation.mutateAsync({
        nickname,
        imageFile: file,
      });
      alert('프로필 이미지가 성공적으로 업데이트되었습니다.');
    } catch (error) {
      console.error('프로필 이미지 업데이트 실패:', error);
      alert('프로필 이미지 업데이트에 실패했습니다.');
    }
  };

  const handleImageDelete = async () => {
    try {
      await deleteImageMutation.mutateAsync(nickname);
      alert('프로필 이미지가 삭제되었습니다.');
    } catch (error) {
      console.error('프로필 이미지 삭제 실패:', error);
      alert('프로필 이미지 삭제에 실패했습니다.');
      throw error;
    }
  };

  const handleAddressComplete = (address: string) => {
    setAddressValue(address);
    setValue('address', address);
  };

  // 로딩 중일 때 표시할 내용
  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>사용자 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Profile Image Section */}
      <ProfileImageSection
        profileImgUrl={userProfile?.profileImgUrl}
        setValue={setValue}
        onImageUpdate={handleImageUpdate}
        onImageDelete={handleImageDelete}
      />

      {/* Profile Form */}
      <ProfileForm
        userProfile={userProfile}
        addressValue={addressValue}
        register={register}
        setValue={setValue}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        onAddressClick={() => setIsAddressOpen(true)}
        onPasswordChangeClick={() => setShowPasswordModal(true)}
      />

      {/* Password Change Modal */}
      <PasswordChangeModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSubmit={handleChangePassword}
      />

      {/* Address Modal */}
      <AddressModal
        isOpen={isAddressOpen}
        onClose={() => setIsAddressOpen(false)}
        onComplete={handleAddressComplete}
      />
    </div>
  );
}
