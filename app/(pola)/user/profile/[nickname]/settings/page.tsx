"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useForm, SubmitHandler } from "react-hook-form";
import DaumPostcode, { Address } from "react-daum-postcode";
import styles from "./page.module.css";
import { UserProfileResponseDto } from "@/backend/common/dtos/UserDto";
import { useApiQuery } from "@/lib/hooks/useApi";

export default function UserSettingsPage() {
  const params = useParams();
  const nickname = params.nickname as string;

  // API에서 사용자 프로필 데이터 가져오기
  const { data: userProfile, isLoading } = useApiQuery<UserProfileResponseDto>(
    ["userProfile", nickname],
    `/api/users/${nickname}`,
    {
      enabled: !!nickname,
    }
  );

  // 닉네임을 제외하고 프로필 이미지를 파일로 처리하는 타입 정의
  type EditableUserData = Omit<
    UserProfileResponseDto,
    "nickname" | "profileImgUrl"
  > & {
    profileImage?: File;
  };

  const { register, handleSubmit, setValue } = useForm<EditableUserData>({
    defaultValues: {
      name: "",
      age: 0,
      address: "",
    },
  });

  // API 데이터가 로드되면 폼 데이터 업데이트
  useEffect(() => {
    if (userProfile?.data) {
      // 닉네임을 제외한 필드들만 폼에 설정
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { nickname, ...editableData } = userProfile.data;
      Object.entries(editableData).forEach(([key, value]) => {
        setValue(key as keyof EditableUserData, value);
      });
      // 주소 값도 설정
      if (userProfile.data.address) {
        setAddressValue(userProfile.data.address);
      }
    }
  }, [userProfile, setValue]);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // DaumPostcode 관련 상태
  const [isAddressOpen, setIsAddressOpen] = useState(false);
  const [addressValue, setAddressValue] = useState("");
  const daumPostcodeRef = useRef<HTMLDivElement>(null);

  // 프로필 이미지 관련 상태
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const onSubmit: SubmitHandler<EditableUserData> = (data) => {
    // TODO: API 호출하여 프로필 정보 저장
    console.log("프로필 정보 저장:", data);

    // FormData를 사용하여 파일과 함께 전송
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("age", data.age.toString());
    formData.append("address", data.address);

    if (data.profileImage) {
      formData.append("profileImage", data.profileImage);
    }

    console.log("FormData:", formData);
  };

  const handleChangePassword = () => {
    // TODO: API 호출하여 비밀번호 변경
    console.log("비밀번호 변경:", passwordData);
    setShowPasswordModal(false);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleProfileImageChange = () => {
    fileInputRef.current?.click();
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
              userProfile?.data?.profileImgUrl ||
              "/images/dummies/dummy_user.png"
            }
            alt="Profile"
            width={120}
            height={120}
            className={styles.profileImage}
          />
          <button
            className={styles.cameraButton}
            onClick={handleProfileImageChange}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M23 19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 21.5304 21 21 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8C1 7.46957 1.21071 6.96086 1.58579 6.58579C1.96086 6.21071 2.46957 6 3 6H7L9 3H15L17 6H21C21.5304 6 22.0391 6.21071 22.4142 6.58579C22.7893 6.96086 23 7.46957 23 8V19Z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 17C14.2091 17 16 15.2091 16 13C16 10.7909 14.2091 9 12 9C9.79086 9 8 10.7909 8 13C8 15.2091 9.79086 17 12 17Z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
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
            {...register("age", { valueAsNumber: true })}
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
            value={userProfile?.data?.nickname || ""}
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
