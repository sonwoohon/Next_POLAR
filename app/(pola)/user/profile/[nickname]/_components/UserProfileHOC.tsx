"use client";
import { useAuthStore } from "@/lib/stores/authStore";

interface UserProfileHOCProps {
  children: React.ReactNode;
  juniorComponent?: React.ReactNode;
  seniorComponent?: React.ReactNode;
  targetUserRole?: string; // 추가: 타겟 유저의 role
  targetNickname?: string; // 추가: 타겟 유저의 nickname
}

const UserProfileHOC: React.FC<UserProfileHOCProps> = ({
  children,
  juniorComponent,
  seniorComponent,
  targetUserRole,
  targetNickname,
}) => {
  // Zustand에서 저장된 유저 정보 가져오기
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // 로그인하지 않은 경우
  if (!isAuthenticated || !user) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "1.25rem",
        }}
      >
        로그인이 필요합니다.
      </div>
    );
  }

  // 내 프로필인지 확인
  const isMyProfile = user.nickname === targetNickname;
  // 분기 기준 role 결정
  const roleToUse = isMyProfile ? user.role : targetUserRole;
  const isSenior = roleToUse === "senior";

  if (isSenior) {
    return seniorComponent || children;
  } else {
    return juniorComponent || children;
  }
};

export default UserProfileHOC;
