'use client';
import styles from './_styles/login.module.css';
import Image from 'next/image';
import Logo from '@/public/images/logos/POLAR.png';
import { useForm, SubmitHandler } from 'react-hook-form';
import Link from 'next/link';
import { useLogin } from '@/lib/hooks';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ROUTES } from '@/lib/constants/routes';

interface loginData {
  loginId: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const { register, handleSubmit } = useForm<loginData>();
  const loginMutation = useLogin();
  const router = useRouter();

  const loginSubmitHandler: SubmitHandler<loginData> = (data) => {
    loginMutation.mutate(data);
  };

  useEffect(() => {
    if (loginMutation.isSuccess) {
      router.push(ROUTES.MAIN);
    }
  }, [loginMutation.isSuccess, router]);

  return (
    <div className={styles.loginContainer}>
      <div className={styles.logoContainer}>
        <Image src={Logo} alt='POLAR' />
      </div>

      <p>POLAR 로그인</p>

      <form
        className={styles.formContainer}
        onSubmit={handleSubmit(loginSubmitHandler)}
      >
        <div className={styles.inputContainer}>
          <label htmlFor='loginId'>이메일 / 전화번호</label>
          <input
            type='text'
            id='loginId'
            className={styles.commonInput}
            {...register('loginId')}
          />
        </div>

        <div className={styles.inputContainer}>
          <label htmlFor='password'>비밀번호</label>
          <input
            type='password'
            id='password'
            className={styles.commonInput}
            {...register('password')}
          />
        </div>
        <button
          type='submit'
          className={styles.commonButton}
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? '로그인 중...' : '로그인'}
        </button>

        {loginMutation.isError && (
          <div className={styles.errorMessage}>
            로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.
          </div>
        )}
        <div className={styles.subMenuContainer}>
          <Link href={ROUTES.SIGN_UP}>회원가입</Link>
          <span>|</span>
          <Link href={ROUTES.FIND_PASSWORD}>비밀번호 찾기</Link>
          <span>|</span>
          <Link href={ROUTES.FIND_ID}>개인정보처리방침</Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
