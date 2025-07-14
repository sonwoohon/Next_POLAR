export default function UserProfilePage({ params }: { params: { nickname: string } }) {
  return (
    <div>
      <h1>유저 프로필</h1>
      <p>사용자명: {params.nickname}</p>
      <a href={`/user/profile/${params.nickname}/reviews`}>
        이 유저의 리뷰 보기
      </a>
    </div>
  );
} 