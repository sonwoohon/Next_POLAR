"use client";
import { useAuthStore } from "@/lib/stores/authStore";

interface UserProfileHOCProps {
  children: React.ReactNode;
  juniorComponent?: React.ReactNode;
  seniorComponent?: React.ReactNode;
}

const UserProfileHOC: React.FC<UserProfileHOCProps> = ({
  children,
  juniorComponent,
  seniorComponent,
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

  // role에 따라 적절한 컴포넌트 렌더링
  const isSenior = user.role === "senior";

  if (isSenior) {
    return seniorComponent || children;
  } else {
    return juniorComponent || children;
  }
};

export default UserProfileHOC;
