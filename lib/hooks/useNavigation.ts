import { useRouter } from 'next/navigation';

export const useNavigation = () => {
  const router = useRouter();

  const navigateToLogin = () => {
    router.push('/login');
  };

  const navigateToSignup = () => {
    router.push('/sign-up');
  };

  const navigateToJunior = () => {
    router.push('/junior');
  };

  const navigateToSenior = () => {
    router.push('/senior');
  };

  const navigateToHelp = (helpId: string) => {
    router.push(`/helps/${helpId}`);
  };

  const navigateToProfile = (nickname: string) => {
    router.push(`/user/profile/${nickname}`);
  };

  return {
    navigateToLogin,
    navigateToSignup,
    navigateToJunior,
    navigateToSenior,
    navigateToHelp,
    navigateToProfile,
  };
}; 