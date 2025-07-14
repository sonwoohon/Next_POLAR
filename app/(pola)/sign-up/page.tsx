"use client";
import styles from "./_styles/signup.module.css";
import Image from "next/image";
import Logo from "@/public/images/logos/POLAR.png";
import { useForm, SubmitHandler } from "react-hook-form";
import { SignUpDto } from "@/app/api/user/signup/route";
import DaumPostcode, { Address } from "react-daum-postcode";
import { useState, useRef, useEffect } from "react";

interface SignupFormData extends SignUpDto {
  passwordConfirm: string;
}

const SignupPage: React.FC = () => {
  const { register, handleSubmit, setValue } = useForm<SignupFormData>();
  const [isAddressOpen, setIsAddressOpen] = useState(false);
  const [addressValue, setAddressValue] = useState("");
  const daumPostcodeRef = useRef<HTMLDivElement>(null);

  const signupSubmitHandler: SubmitHandler<SignUpDto> = (data) => {
    alert(`
      이메일: ${data.email}
      휴대폰번호: ${data.phone_number}
      비밀번호: ${data.password}
      나이: ${data.age}
      주소: ${data.address}
    `);
  };

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

  return (
    <div className={styles.signupContainer}>
      <section className={styles.titleSection}>
        <div className={styles.logoContainer}>
          <Image src={Logo} alt="POLAR" />
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
          <label htmlFor="email">이메일</label>
          <input
            type="email"
            id="email"
            className={styles.commonInput}
            {...register("email")}
          />
        </div>

        <div className={styles.inputContainer}>
          <label htmlFor="phone">
            <span>*</span>휴대폰번호 (- 제외)
          </label>
          <input
            type="phone"
            id="phone"
            className={styles.commonInput}
            {...register("phone_number")}
            required
          />
        </div>

        <div className={styles.inputContainer}>
          <label htmlFor="password">
            <span>*</span>비밀번호
          </label>
          <input
            type="password"
            id="password"
            className={styles.commonInput}
            {...register("password")}
            required
          />
        </div>

        <div className={styles.inputContainer}>
          <label htmlFor="passwordConfirm">
            <span>*</span>비밀번호 확인
          </label>
          <input
            type="password"
            id="passwordConfirm"
            className={styles.commonInput}
            {...register("passwordConfirm")}
            required
          />
        </div>

        <div className={styles.inputContainer}>
          <label htmlFor="age">
            <span>*</span>나이
          </label>
          <input
            type="number"
            id="age"
            className={styles.commonInput}
            {...register("age")}
            required
          />
        </div>

        <div className={styles.inputContainer}>
          <label htmlFor="address">
            <span>*</span>주소
          </label>
          <input
            type="text"
            id="address"
            className={styles.commonInput}
            value={addressValue}
            readOnly
            onClick={handleAddressClick}
            required
            {...register("address")}
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
              <button type="button" onClick={() => setIsAddressOpen(false)}>
                닫기
              </button>
            </div>
          </div>
        )}
        <button type="submit" className={styles.commonButton}>
          회원가입
        </button>
      </form>
    </div>
  );
};

export default SignupPage;
