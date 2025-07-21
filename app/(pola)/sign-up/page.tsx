'use client';
import Image from 'next/image';

import Logo from '@/public/images/logos/POLAR.png';
import { useForm, SubmitHandler } from 'react-hook-form';
import { SignUpDto } from '@/backend/users/signup/applications/dtos/SignUpDto';
import DaumPostcode, { Address } from 'react-daum-postcode';
import { useState, useRef, useEffect } from 'react';
import { useSignup } from '@/lib/hooks/useSignup';
import styles from './_styles/signUp.module.css';

interface SignupFormData extends SignUpDto {
  passwordConfirm: string;
}

const SignupPage: React.FC = () => {
  const { register, handleSubmit, setValue } = useForm<SignupFormData>();
  const [isAddressOpen, setIsAddressOpen] = useState(false);
  const [addressValue, setAddressValue] = useState('');
  const daumPostcodeRef = useRef<HTMLDivElement>(null);
  const signupMutation = useSignup();

  const signupSubmitHandler: SubmitHandler<SignupFormData> = (data) => {
    // 비밀번호 확인 검증
    if (data.password !== data.passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    // 필수 필드 검증
    if (
      !data.name ||
      !data.phone_number ||
      !data.password ||
      !data.age ||
      !data.address
    ) {
      alert('필수 입력 사항을 모두 입력해주세요.');
      return;
    }

    // SignUpDto 형식으로 변환
    const signupData: SignUpDto = {
      name: data.name,
      nickname: '', // 서버에서 자동 생성
      phone_number: data.phone_number,
      password: data.password,
      email: data.email,
      age: data.age,
      address: data.address,
    };

    // 회원가입 API 호출
    signupMutation.mutate(signupData);
  };

  const handleAddressClick = () => {
    setIsAddressOpen(true);
  };

  const handleComplete = (data: Address) => {
    setAddressValue(data.address);
    setValue('address', data.address); // react-hook-form 값도 동기화
    setIsAddressOpen(false);
  };

  useEffect(() => {
    if (isAddressOpen && daumPostcodeRef.current) {
      daumPostcodeRef.current.focus();
    }
  }, [isAddressOpen]);

  return (
    <div className={styles.signupContainer}>
      <section className={styles.titleSection}>
        <div className={styles.logoContainer}>
          <Image src={Logo} alt='POLAR' />
        </div>
        <h1>회원가입</h1>
      </section>

      <form
        className={styles.formContainer}
        onSubmit={handleSubmit(signupSubmitHandler)}
      >
        <p>
          <span>*</span>는 필수 입력 사항입니다.
        </p>
        <div className={styles.inputContainer}>
          <label htmlFor='name'>
            <span>*</span>이름
          </label>
          <input
            type='text'
            id='name'
            className={styles.commonInput}
            {...register('name')}
            required
          />
        </div>
        <div className={styles.inputContainer}>
          <label htmlFor='email'>이메일</label>
          <input
            type='email'
            id='email'
            className={styles.commonInput}
            {...register('email')}
          />
        </div>

        <div className={styles.inputContainer}>
          <label htmlFor='phone'>
            <span>*</span>휴대폰번호 (- 제외)
          </label>
          <input
            type='phone'
            id='phone'
            className={styles.commonInput}
            {...register('phone_number')}
            required
          />
        </div>

        <div className={styles.inputContainer}>
          <label htmlFor='password'>
            <span>*</span>비밀번호
          </label>
          <input
            type='password'
            id='password'
            className={styles.commonInput}
            {...register('password')}
            required
          />
        </div>

        <div className={styles.inputContainer}>
          <label htmlFor='passwordConfirm'>
            <span>*</span>비밀번호 확인
          </label>
          <input
            type='password'
            id='passwordConfirm'
            className={styles.commonInput}
            {...register('passwordConfirm')}
            required
          />
        </div>

        <div className={styles.inputContainer}>
          <label htmlFor='age'>
            <span>*</span>나이
          </label>
          <input
            type='number'
            id='age'
            className={styles.commonInput}
            {...register('age')}
            required
          />
        </div>

        <div className={styles.inputContainer}>
          <label htmlFor='address'>
            <span>*</span>주소
          </label>
          <input
            type='text'
            id='address'
            className={styles.commonInput}
            value={addressValue}
            readOnly
            onClick={handleAddressClick}
            required
            {...register('address')}
          />
        </div>

        {isAddressOpen && (
          <div className={styles.addressModalOverlay}>
            <div
              className={styles.addressModal}
              ref={daumPostcodeRef}
              tabIndex={-1}
            >
              <DaumPostcode onComplete={handleComplete} />
              <button type='button' onClick={() => setIsAddressOpen(false)}>
                닫기
              </button>
            </div>
          </div>
        )}
        <button
          type='submit'
          className={styles.commonButton}
          disabled={signupMutation.isPending}
        >
          {signupMutation.isPending ? '회원가입 중...' : '회원가입'}
        </button>

        {signupMutation.isError && (
          <div style={{ color: 'red', textAlign: 'center', marginTop: '1rem' }}>
            회원가입에 실패했습니다. 다시 시도해주세요.
          </div>
        )}
      </form>
    </div>
  );
};

export default SignupPage;
