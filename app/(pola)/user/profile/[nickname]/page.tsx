'use client';
import UserProfileHOC from './_components/UserProfileHOC';
import styles from './_styles/userProfile.module.css';
import { useParams } from 'next/navigation';
import UserTierSection from '@/app/_components/sections/user-tier/UserTierSection';
import UserArchivmentSection from '@/app/_components/sections/user-archivment/UserArchivmentSection';
import UserHelpsSection from './_components/user-helps/junior/UserHelpsSection';
import ProfileMenuSection from './_components/sections/profile-menu/ProfileMenuSection';
import { useApiQuery } from '@/lib/hooks/useApi';
import { UserProfileResponseDto } from '@/backend/users/user/applications/dtos/UserDtos';
import { extractData } from '@/lib/utils/apiUtils';
import UserInfoSection from '@/app/_components/commons/common-sections/user-info/UserInfoSection';
import UserRecivedReviewsPreview from './_components/sections/reviews-preview/UserRecivedReviewsPreview';
import { useReceivedReviews } from '@/lib/hooks/review/useReceivedReviews';
import { useAuthStore } from '@/lib/stores/authStore';

const UserProfilePage: React.FC = () => {
  const params = useParams();
  const nickname = params.nickname as string;

  // 현재 로그인한 유저 정보 가져오기
  const currentUser = useAuthStore((state) => state.user);

  // 현재 페이지의 nickname과 로그인한 유저의 nickname이 같은지 확인
  const isMyProfile = currentUser?.nickname === nickname;

  // 받은 리뷰
  const { data: receivedReviewsData } = useReceivedReviews(nickname);

  const { data: userProfile } = useApiQuery<UserProfileResponseDto>(
    ['userProfile', nickname],
    `/api/users/${nickname}`,
    {
      enabled: !!nickname,
    }
  );

  // ApiResponse에서 실제 데이터 추출
  const userData = extractData(userProfile);

  // 주니어용 컴포넌트
  const JuniorComponent = (
    <div className={styles.container}>
      <h1>주니어 프로필</h1>
      {userData && <UserInfoSection data={userData} />}

      <UserTierSection seasonNumber={1} />

      <UserArchivmentSection
        nickname={params.nickname as string}
        title='활동 배지'
        badges={[
          {
            id: 1,
            icon: '🏦',
            tooltip: '자산을 부탁해',
          },
          {
            id: 2,
            icon: '💘',
            tooltip: '두근두근',
          },
          {
            id: 3,
            icon: '🧹',
            tooltip: '청소 마스터',
          },
          {
            id: 4,
            icon: '⭐',
            tooltip: '평점 마스터',
          },
        ]}
      />

      <UserHelpsSection
        title='나의 헬프 기록'
        nickname={params.nickname as string}
        currentUserRole={currentUser?.role}
        representativeTitle='환경미화원'
      />

      <UserRecivedReviewsPreview
        nickname={nickname}
        reviews={receivedReviewsData?.reviews.slice(0, 3) || []}
        title='받은 리뷰'
      />

      {/* 마이페이지일 때만 설정 메뉴 섹션 표시 */}
      {isMyProfile && (
        <ProfileMenuSection
          nickname={nickname}
          onLogout={() => {
            console.log('로그아웃 버튼 클릭됨');
          }}
        />
      )}
    </div>
  );

  // 시니어용 컴포넌트
  const SeniorComponent = (
    <div className={styles.container}>
      <h1>시니어 프로필</h1>
      {userData && <UserInfoSection data={userData} />}

      <UserRecivedReviewsPreview
        nickname={nickname}
        reviews={receivedReviewsData?.reviews.slice(0, 3) || []}
        title='받은 리뷰'
      />

      {/* 마이페이지일 때만 설정 메뉴 섹션 표시 */}
      {isMyProfile && (
        <ProfileMenuSection
          nickname={nickname}
          onLogout={() => {
            console.log('로그아웃 버튼 클릭됨');
          }}
        />
      )}
    </div>
  );

  // userData의 age로 role 분기
  const targetUserRole = currentUser?.role;

  return (
    <UserProfileHOC
      juniorComponent={JuniorComponent}
      seniorComponent={SeniorComponent}
      targetUserRole={targetUserRole}
      targetNickname={nickname}
    >
      <div className={styles.container}>
        <h1>유저프로필</h1>
        {userData && <UserInfoSection data={userData} />}

        <UserTierSection seasonNumber={1} />

        <UserArchivmentSection
          nickname={params.nickname as string}
          title='활동 배지'
          badges={[
            {
              id: 1,
              icon: '🏦',
              tooltip: '자산을 부탁해',
            },
            {
              id: 2,
              icon: '💘',
              tooltip: '두근두근',
            },
            {
              id: 3,
              icon: '🧹',
              tooltip: '청소 마스터',
            },
            {
              id: 4,
              icon: '⭐',
              tooltip: '평점 마스터',
            },
          ]}
        />

        <UserHelpsSection
          title='나의 헬프 기록'
          nickname={params.nickname as string}
          representativeTitle='환경미화원'
        />

        <UserRecivedReviewsPreview
          nickname={nickname}
          reviews={receivedReviewsData?.reviews.slice(0, 3) || []}
          title='받은 리뷰'
        />

        {/* 마이페이지일 때만 설정 메뉴 섹션 표시 */}
        {isMyProfile && (
          <ProfileMenuSection
            nickname={nickname}
            onLogout={() => {
              console.log('로그아웃 버튼 클릭됨');
            }}
          />
        )}
      </div>
    </UserProfileHOC>
  );
};

export default UserProfilePage;
