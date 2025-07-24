import styles from './UserRecivedReviewsPreview.module.css';
import ReviewCard from '@/app/_components/commons/list-card/review-list-card/ReviewCard';
import Link from 'next/link';

interface ReviewPreview {
  id: number;
  helpId: number;
  writerId: string;
  receiverId: string;
  writerNickname: string;
  receiverNickname: string;
  rating: number;
  text: string;
  reviewImgUrl: string | null;
  writerProfileImgUrl?: string;
  createdAt: string;
}

interface UserRecivedReviewsPreviewProps {
  nickname: string;
  reviews: ReviewPreview[];
  title: string;
}

const UserRecivedReviewsPreview: React.FC<UserRecivedReviewsPreviewProps> = ({
  nickname,
  reviews,
  title = '받은 리뷰',
}) => {
  return (
    <section className={styles.section}>
      <div className={styles.headerRow}>
        <h2 className={styles.title}>{title}</h2>
        <Link
          href={`/user/profile/${nickname}/reviews`}
          className={styles.moreBtn}
        >
          더보기
        </Link>
      </div>
      <ul className={styles.reviewList}>
        {reviews.length === 0 ? (
          <li className={styles.empty}>아직 받은 리뷰가 없습니다.</li>
        ) : (
          reviews.map((review: ReviewPreview, idx: number) => (
            <ReviewCard
              key={review.id ?? idx}
              review={{
                id: review.id ?? idx,
                helpId: review.helpId ?? 0,
                writerId: review.writerId ?? '',
                receiverId: review.receiverId ?? '',
                writerNickname: review.writerNickname ?? '익명',
                receiverNickname: review.receiverNickname ?? nickname,
                rating: review.rating ?? 5,
                text: review.text ?? '리뷰 내용이 없습니다.',
                reviewImgUrl: review.reviewImgUrl,
                writerProfileImgUrl: review.writerProfileImgUrl,
                createdAt: review.createdAt ?? new Date().toISOString(),
              }}
            />
          ))
        )}
      </ul>
    </section>
  );
};

export default UserRecivedReviewsPreview;
