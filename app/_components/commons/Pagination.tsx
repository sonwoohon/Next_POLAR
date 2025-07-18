'use client';

import styles from './Pagination.module.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}: PaginationProps) {
  const visiblePages = 5;

  // 표시할 페이지 번호들을 계산
  const getVisiblePageNumbers = () => {
    const pages: number[] = [];
    const halfVisible = Math.floor(visiblePages / 2);

    let start = Math.max(1, currentPage - halfVisible);
    const end = Math.min(totalPages, start + visiblePages - 1);

    // end가 totalPages에 가까우면 start를 조정
    if (end === totalPages) {
      start = Math.max(1, end - visiblePages + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pageNumbers = getVisiblePageNumbers();

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={`${styles.pagination} ${className}`}>
      {/* 이전 페이지 버튼 */}
      <button
        className={`${styles.pageButton} ${styles.prevButton}`}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        {'<'}
      </button>

      {/* 첫 페이지 */}
      {pageNumbers[0] > 1 && (
        <>
          <button
            className={`${styles.pageButton} ${styles.numberButton}`}
            onClick={() => onPageChange(1)}
          >
            1
          </button>
          {pageNumbers[0] > 2 && <span className={styles.ellipsis}>...</span>}
        </>
      )}

      {/* 페이지 번호들 */}
      {pageNumbers.map((page) => (
        <button
          key={page}
          className={`${styles.pageButton} ${styles.numberButton} ${
            page === currentPage ? styles.active : ''
          }`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      {/* 마지막 페이지 */}
      {pageNumbers[pageNumbers.length - 1] < totalPages && (
        <>
          {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
            <span className={styles.ellipsis}>...</span>
          )}
          <button
            className={`${styles.pageButton} ${styles.numberButton}`}
            onClick={() => onPageChange(totalPages)}
          >
            {totalPages}
          </button>
        </>
      )}

      {/* 다음 페이지 버튼 */}
      <button
        className={`${styles.pageButton} ${styles.nextButton}`}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        {'>'}
      </button>
    </div>
  );
}
