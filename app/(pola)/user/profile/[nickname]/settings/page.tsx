"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useForm, SubmitHandler } from "react-hook-form";
import DaumPostcode, { Address } from "react-daum-postcode";
import styles from "./page.module.css";
import { UserProfileResponseDto } from "@/backend/common/dtos/UserDto";

import {
  useUserProfileForUpdate,
  useUpdateUserProfile,
  useUpdateUserProfileImage,
  useDeleteUserProfileImage,
  useChangeUserPassword,
} from "@/lib/hooks/profileUpdate";

export default function UserSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const nickname = params.nickname as string;

  // API에서 사용자 프로필 데이터 가져오기 (새로운 훅 사용)
  const { data: userProfile, isLoading } = useUserProfileForUpdate(nickname);

  // 닉네임과 나이를 제외하고 프로필 이미지를 파일로 처리하는 타입 정의
  type EditableUserData = Omit<
    UserProfileResponseDto,
    "nickname" | "age" | "profileImgUrl"
  > & {
    profileImage?: File;
  };

  const { register, handleSubmit, setValue } = useForm<EditableUserData>({
    defaultValues: {
      name: "",
      address: "",
    },
  });

  // API 데이터가 로드되면 폼 데이터 업데이트
  useEffect(() => {
    if (userProfile) {
      // 닉네임과 나이를 제외한 필드들만 폼에 설정
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { nickname, age, ...editableData } = userProfile;
      Object.entries(editableData).forEach(([key, value]) => {
        setValue(key as keyof EditableUserData, value);
      });
      // 주소 값도 설정
      if (userProfile.address) {
        setAddressValue(userProfile.address);
      }
    }
  }, [userProfile, setValue]);

  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  const [passwordData, setPasswordData] = useState<{
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // DaumPostcode 관련 상태
  const [isAddressOpen, setIsAddressOpen] = useState<boolean>(false);
  const [addressValue, setAddressValue] = useState<string>("");
  const daumPostcodeRef = useRef<HTMLDivElement>(null);

  // 프로필 이미지 관련 상태
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showImageMenu, setShowImageMenu] = useState<boolean>(false);
  const imageMenuRef = useRef<HTMLDivElement>(null);

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // API 훅들
  const updateProfileMutation = useUpdateUserProfile();
  const updateImageMutation = useUpdateUserProfileImage();
  const deleteImageMutation = useDeleteUserProfileImage();
  const changePasswordMutation = useChangeUserPassword();

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

      alert("프로필이 성공적으로 업데이트되었습니다.");
      router.push(`/user/profile/${nickname}`);
    } catch (error) {
      console.error("프로필 업데이트 실패:", error);
      alert("프로필 업데이트에 실패했습니다.");
    }
  };

  const handleChangePassword = async () => {
    // 비밀번호 확인 검증
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert("새 비밀번호는 최소 6자 이상이어야 합니다.");
      return;
    }

    try {
      await changePasswordMutation.mutateAsync({
        nickname,
        passwordData: {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
      });

      alert("비밀번호가 성공적으로 변경되었습니다.");
      setShowPasswordModal(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("비밀번호 변경 실패:", error);
      alert("비밀번호 변경에 실패했습니다.");
    }
  };

  const handleProfileImageChange = () => {
    fileInputRef.current?.click();
    setShowImageMenu(false);
  };

  const handleRemoveProfileImage = async () => {
    try {
      await deleteImageMutation.mutateAsync(nickname);
      alert("프로필 이미지가 삭제되었습니다.");
      setShowImageMenu(false);
    } catch (error) {
      console.error("프로필 이미지 삭제 실패:", error);
      alert("프로필 이미지 삭제에 실패했습니다.");
    }
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // 파일 유효성 검사
      if (!file.type.startsWith("image/")) {
        alert("이미지 파일만 선택할 수 있습니다.");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        // 5MB 제한
        alert("파일 크기는 5MB 이하여야 합니다.");
        return;
      }

      // 미리보기 URL 생성
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      // react-hook-form에 파일 설정
      setValue("profileImage", file);
    }
  };

  // 드롭다운 메뉴 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (imageMenuRef.current && !imageMenuRef.current.contains(event.target as Node)) {
        setShowImageMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // DaumPostcode 관련 함수들
  const handleAddressClick = () => {
    setIsAddressOpen(true);
  };

  const handleComplete = (data: Address) => {
    setAddressValue(data.address);
    setValue("address", data.address); // react-hook-form 값도 동기화
    setIsAddressOpen(false);
  };

  useEffect(() => {
    if (isAddressOpen && daumPostcodeRef.current) {
      daumPostcodeRef.current.focus();
    }
  }, [isAddressOpen]);

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
      <div className={styles.profileImageSection}>
        <div className={styles.profileImageContainer}>
          <Image
            src={
              previewUrl ||
              userProfile?.profileImgUrl ||
              "/images/dummies/dummy_user.png"
            }
            alt="Profile"
            width={120}
            height={120}
            className={styles.profileImage}
          />
          <button
            className={styles.editButton}
            onClick={() => setShowImageMenu(!showImageMenu)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M18.5 2.50023C18.8978 2.1025 19.4374 1.87891 20 1.87891C20.5626 1.87891 21.1022 2.1025 21.5 2.50023C21.8978 2.898 22.1214 3.43762 22.1214 4.00023C22.1214 4.56284 21.8978 5.10246 21.5 5.50023L12 15.0002L8 16.0002L9 12.0002L18.5 2.50023Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Edit</span>
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
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          style={{ display: "none" }}
        />
      </div>

      {/* Form Fields */}
      <form className={styles.formContainer} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.formField}>
          <label className={styles.label}>이름</label>
          <input type="text" className={styles.input} {...register("name")} />
        </div>

        <div className={styles.formField}>
          <label className={styles.label}>나이</label>
          <input
            type="number"
            className={styles.input}
            value={userProfile?.age || 0}
            readOnly
            disabled
          />
        </div>

        <div className={styles.formField}>
          <label className={styles.label}>주소</label>
          <input
            type="text"
            className={styles.input}
            value={addressValue}
            readOnly
            onClick={handleAddressClick}
            {...register("address")}
          />
        </div>

        <div className={styles.formField}>
          <label className={styles.label}>닉네임</label>
          <input
            type="text"
            className={styles.input}
            value={userProfile?.nickname || ""}
            readOnly
            disabled
          />
        </div>

        {/* Password Change Button */}
        <div className={styles.formField}>
          <button
            type="button"
            className={styles.passwordButton}
            onClick={() => setShowPasswordModal(true)}
          >
            <span>비밀번호 변경</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 12L15 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 9L12 15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Save Button */}
        <button type="submit" className={styles.saveButton}>
          변경사항 저장
        </button>
      </form>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>비밀번호 변경</h2>
              <button
                className={styles.closeButton}
                onClick={() => setShowPasswordModal(false)}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            <div className={styles.modalContent}>
              <div className={styles.formField}>
                <label className={styles.label}>현재 비밀번호</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    handlePasswordChange("currentPassword", e.target.value)
                  }
                  className={styles.input}
                />
              </div>

              <div className={styles.formField}>
                <label className={styles.label}>새 비밀번호</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    handlePasswordChange("newPassword", e.target.value)
                  }
                  className={styles.input}
                />
              </div>

              <div className={styles.formField}>
                <label className={styles.label}>새 비밀번호 확인</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    handlePasswordChange("confirmPassword", e.target.value)
                  }
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                className={styles.cancelButton}
                onClick={() => setShowPasswordModal(false)}
              >
                취소
              </button>
              <button
                className={styles.confirmButton}
                onClick={handleChangePassword}
              >
                비밀번호 변경
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DaumPostcode Modal */}
      {isAddressOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal} ref={daumPostcodeRef} tabIndex={-1}>
            <div className={styles.modalHeader}>
              <h2>주소 검색</h2>
              <button
                className={styles.closeButton}
                onClick={() => setIsAddressOpen(false)}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            <div className={styles.modalContent}>
              <DaumPostcode onComplete={handleComplete} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
