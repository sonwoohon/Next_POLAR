"use client";
import React from "react";
import Link from "next/link";
import styles from "./Header.module.css";
import Image from "next/image";
import Logo from "@/public/images/logos/POLAR.png";
import { useHeaderScroll } from "@/lib/hooks/header/useHeaderScroll";
import { useUserProfile } from "@/lib/hooks/useUserProfile";
import { useAuth } from "@/lib/hooks/useAuth";
import { useProfileImage } from "@/lib/hooks/useProfileImage";
import DummyUser from "@/public/images/dummies/dummy_user.png";

const Header: React.FC = () => {
  const { hidden } = useHeaderScroll();
  const { currentUser, isLoading: authLoading } = useAuth();

  // 기존 useUserProfile 훅 사용
  const {
    data: userProfile,
    isLoading: profileLoading,
    error,
  } = useUserProfile(currentUser?.nickname || "");

  // useProfileImage 훅 사용
  const { profileImageUrl, handleImageError } = useProfileImage({
    profileImgUrl: userProfile?.data?.profileImgUrl,
  });

  const isLoading = authLoading || profileLoading;

  if (isLoading) {
    return (
      <header className={`${styles.header} ${hidden ? styles.hide : ""}`}>
        <div className={styles.headerWrap}>
          <div className={styles.logo}>
            <h1>
              <Link href="/main">
                <Image src={Logo} alt="POLAR" />
              </Link>
            </h1>
          </div>
          <div className={styles.profile}>
            <Link href={`/user/profile/${currentUser?.nickname || ""}`}>
              <Image
                src={DummyUser}
                alt="User Profile"
                width={32}
                height={32}
              />
            </Link>
          </div>
        </div>
      </header>
    );
  }

  if (error) {
    console.error("[Header] 에러:", error);
  }

  return (
    <header className={`${styles.header} ${hidden ? styles.hide : ""}`}>
      <div className={styles.headerWrap}>
        <div className={styles.logo}>
          <h1>
            <Link href="/main">
              <Image src={Logo} alt="POLAR" />
            </Link>
          </h1>
        </div>
        <div className={styles.profile}>
          <Link href={`/user/profile/${currentUser?.nickname || ""}`}>
            <Image
              src={profileImageUrl}
              alt="User Profile"
              width={32}
              height={32}
              onError={handleImageError}
            />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
