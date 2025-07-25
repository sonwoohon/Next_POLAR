'use client';

import {
  UseFormRegister,
  UseFormSetValue,
  UseFormHandleSubmit,
} from 'react-hook-form';
import { UserProfileResponseDto } from '@/backend/common/dtos/UserDto';
import styles from '../page.module.css';

interface EditableUserData {
  name: string;
  address: string;
  profileImage?: File;
}

interface ProfileFormProps {
  userProfile: UserProfileResponseDto | undefined;
  addressValue: string;
  register: UseFormRegister<EditableUserData>;
  setValue: UseFormSetValue<EditableUserData>;
  handleSubmit: UseFormHandleSubmit<EditableUserData>;
  onSubmit: (data: EditableUserData) => void;
  onAddressClick: () => void;
  onPasswordChangeClick: () => void;
}

export default function ProfileForm({
  userProfile,
  addressValue,
  register,
  handleSubmit,
  onSubmit,
  onAddressClick,
  onPasswordChangeClick,
}: ProfileFormProps) {
  return (
    <form className={styles.formContainer} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.formField}>
        <label className={styles.label}>이름</label>
        <input type='text' className={styles.input} {...register('name')} />
      </div>

      <div className={styles.formField}>
        <label className={styles.label}>나이</label>
        <input
          type='number'
          className={styles.input}
          value={userProfile?.age || 0}
          readOnly
          disabled
        />
      </div>

      <div className={styles.formField}>
        <label className={styles.label}>주소</label>
        <input
          type='text'
          className={styles.input}
          value={addressValue}
          readOnly
          onClick={onAddressClick}
          {...register('address')}
        />
      </div>

      <div className={styles.formField}>
        <label className={styles.label}>닉네임</label>
        <input
          type='text'
          className={styles.input}
          value={userProfile?.nickname || ''}
          readOnly
          disabled
        />
      </div>

      {/* Password Change Button */}
      <div className={styles.formField}>
        <button
          type='button'
          className={styles.passwordButton}
          onClick={onPasswordChangeClick}
        >
          <span>비밀번호 변경</span>
          <svg width='16' height='16' viewBox='0 0 24 24' fill='none'>
            <path
              d='M9 12L15 12'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              d='M12 9L12 15'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </button>
      </div>

      {/* Save Button */}
      <button type='submit' className={styles.saveButton}>
        변경사항 저장
      </button>
    </form>
  );
}
