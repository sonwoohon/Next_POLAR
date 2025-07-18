-- help_categories 테이블의 sub_category_id 컬럼에1~19이의 랜덤 숫자 삽입

-- 방법 1: 기존 레코드들의 sub_category_id를 랜덤으로 업데이트
UPDATE help_categories 
SET sub_category_id = floor(random() * 19) + 1;

-- 방법2: 특정 조건의 레코드만 업데이트 (예: sub_category_id가 NULL인 경우)
UPDATE help_categories 
SET sub_category_id = floor(random() * 19WHERE sub_category_id IS NULL;

-- 방법3: 특정 help_id 범위의 레코드만 업데이트
UPDATE help_categories 
SET sub_category_id = floor(random() * 19+ 1 
WHERE help_id BETWEEN 1 AND 100

-- 방법 4각 레코드마다 다른 랜덤 값 생성 (더 균등한 분포)
UPDATE help_categories 
SET sub_category_id = floor(random() * 19 + 1);

-- 방법 5: 기존 데이터를 보존하면서 NULL인 경우만 랜덤 값으로 채우기
UPDATE help_categories 
SET sub_category_id = floor(random() * 19WHERE sub_category_id IS NULL OR sub_category_id = 0;

-- 결과 확인 쿼리
SELECT 
    sub_category_id,
    COUNT(*) as count
FROM help_categories 
GROUP BY sub_category_id 
ORDER BY sub_category_id;

-- 전체 통계 확인
SELECT 
    COUNT(*) as total_records,
    COUNT(sub_category_id) as records_with_sub_category,
    MIN(sub_category_id) as min_sub_category_id,
    MAX(sub_category_id) as max_sub_category_id,
    AVG(sub_category_id) as avg_sub_category_id
FROM help_categories;

-- 특정 범위 확인 (1~19 사이인지)
SELECT 
    COUNT(*) as records_in_range
FROM help_categories 
WHERE sub_category_id BETWEEN 1 AND 19; 