"use client";
import Link from "next/link";
import { useState } from "react";
import { useWithdrawal } from "@/lib/hooks";
import { useAuth } from "@/lib/hooks/useAuth";
import { getUuidByNickname } from "@/lib/getUserData";
import styles from "./profileMenu.module.css";

interface ProfileMenuSectionProps {
  nickname: string;
  onLogout?: () => void;
}

const ProfileMenuSection: React.FC<ProfileMenuSectionProps> = ({
  nickname,
  onLogout,
}) => {
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [withdrawalReason, setWithdrawalReason] = useState("");

  const { mutate: withdraw, isPending } = useWithdrawal();
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      console.log("[ProfileMenuSection] 로그아웃 시작");

      // 부모 컴포넌트의 onLogout 콜백 호출 (있다면)
      if (onLogout) {
        onLogout();
      }

      // useAuth의 logout 함수 호출
      await logout();

      console.log("[ProfileMenuSection] 로그아웃 완료");
    } catch (error) {
      console.error("[ProfileMenuSection] 로그아웃 중 오류:", error);
      alert("로그아웃 처리 중 오류가 발생했습니다.");
    }
  };

  const handleWithdrawalClick = () => {
    setShowWithdrawalModal(true);
  };

  const handleWithdrawalConfirm = async () => {
    if (!confirmPassword.trim()) {
      alert("비밀번호를 입력해주세요.");
      return;
    }

    if (!currentUser?.nickname) {
      alert("사용자 정보를 찾을 수 없습니다.");
      return;
    }

    try {
      const userId = await getUuidByNickname(currentUser.nickname);
      if (!userId) {
        alert("사용자 정보를 찾을 수 없습니다.");
        return;
      }

      withdraw({
        userId: userId,
        confirmPassword: confirmPassword,
        reason: withdrawalReason.trim() || undefined,
      });

      setShowWithdrawalModal(false);
      setConfirmPassword("");
      setWithdrawalReason("");
    } catch (error) {
      console.error("회원 탈퇴 처리 중 오류:", error);
      alert("회원 탈퇴 처리 중 오류가 발생했습니다.");
    }
  };

  const handleWithdrawalCancel = () => {
    setShowWithdrawalModal(false);
    setConfirmPassword("");
    setWithdrawalReason("");
  };

  return (
    <section className={styles.profileMenuSection}>
      <div className={styles.profileMenuContainer}>
        <Link
          href={`/user/profile/${nickname}/settings`}
          className={styles.settingsLink}
        >
          <div className={styles.menuItem}>
            <span className={styles.menuIcon}>⚙️</span>
            <span className={styles.menuText}>설정</span>
            <span className={styles.menuArrow}>›</span>
          </div>
        </Link>

        <button onClick={handleLogout} className={styles.logoutButton}>
          <span className={styles.menuIcon}>🚪</span>
          <span className={styles.menuText}>로그아웃</span>
        </button>

        <button
          onClick={handleWithdrawalClick}
          className={styles.withdrawalButton}
        >
          <span className={styles.menuIcon}>❌</span>
          <span className={styles.menuText}>회원 탈퇴</span>
        </button>
      </div>

      {/* 회원 탈퇴 모달 */}
      {showWithdrawalModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>회원 탈퇴</h3>
            <p>정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.</p>

            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword">비밀번호 확인</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="withdrawalReason">탈퇴 사유 (선택사항)</label>
              <textarea
                id="withdrawalReason"
                value={withdrawalReason}
                onChange={(e) => setWithdrawalReason(e.target.value)}
                placeholder="탈퇴 사유를 입력하세요"
                rows={3}
              />
            </div>

            <div className={styles.modalButtons}>
              <button
                onClick={handleWithdrawalCancel}
                className={styles.cancelButton}
                disabled={isPending}
              >
                취소
              </button>
              <button
                onClick={handleWithdrawalConfirm}
                className={styles.confirmButton}
                disabled={isPending}
              >
                {isPending ? "처리 중..." : "탈퇴"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProfileMenuSection;
