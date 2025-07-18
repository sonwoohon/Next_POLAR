# UserProfileHOC (사용자 프로필 권한 분기 HOC)

## 개요

`UserProfileHOC`는 사용자의 나이에 따라 자동으로 적절한 프로필 페이지로 리다이렉트하는 Higher-Order Component입니다.

## 동작 방식

1. **사용자 정보 조회**: nickname을 통해 사용자 정보를 API에서 조회합니다.
2. **나이 기반 분류**:
   - 60세 이상: Senior (시니어)
   - 60세 미만: Junior (주니어)
3. **자동 리다이렉트**: 사용자 타입에 맞는 전용 페이지로 자동 이동합니다.

## 라우팅 구조

```
/user/profile/[nickname]     # 기본 프로필 페이지 (HOC 적용)
/junior/profile/[nickname]   # 주니어 전용 프로필 페이지
/senior/profile/[nickname]   # 시니어 전용 프로필 페이지
```

## 사용법

### 1. 기본 프로필 페이지에 HOC 적용

```tsx
"use client";
import UserProfileHOC from "./_components/UserProfileHOC";

const UserProfilePage: React.FC = () => {
  return (
    <UserProfileHOC>
      {/* 기존 프로필 페이지 내용 */}
      <div className={styles.container}>
        <h1>유저프로필</h1>
        {/* ... */}
      </div>
    </UserProfileHOC>
  );
};
```

### 2. 주니어/시니어 전용 페이지에도 HOC 적용

```tsx
// junior/profile/[nickname]/page.tsx
"use client";
import UserProfileHOC from "@/app/(pola)/user/profile/[nickname]/_components/UserProfileHOC";

const JuniorProfilePage: React.FC = () => {
  return (
    <UserProfileHOC>
      <div className={styles.container}>
        <h1>주니어 프로필</h1>
        {/* 주니어 전용 내용 */}
      </div>
    </UserProfileHOC>
  );
};
```

```tsx
// senior/profile/[nickname]/page.tsx
"use client";
import UserProfileHOC from "@/app/(pola)/user/profile/[nickname]/_components/UserProfileHOC";

const SeniorProfilePage: React.FC = () => {
  return (
    <UserProfileHOC>
      <div className={styles.container}>
        <h1>시니어 프로필</h1>
        {/* 시니어 전용 내용 */}
      </div>
    </UserProfileHOC>
  );
};
```

## 주요 기능

### 1. 자동 권한 분기

- 사용자가 `/user/profile/[nickname]`에 접근하면 자동으로 적절한 페이지로 리다이렉트
- 주니어는 `/junior/profile/[nickname]`으로
- 시니어는 `/senior/profile/[nickname]`으로

### 2. 권한 검증

- 각 전용 페이지에서도 HOC가 권한을 검증
- 잘못된 페이지에 접근하면 올바른 페이지로 리다이렉트

### 3. 로딩 및 에러 처리

- 사용자 정보 로딩 중: 로딩 화면 표시
- API 에러 발생: 에러 메시지 표시
- 사용자 정보 없음: "사용자를 찾을 수 없습니다" 메시지 표시

## 스타일링

### 주니어 전용 스타일

- 그라데이션: 파란색 계열 (`#667eea` → `#764ba2`)
- 배지: 녹색 배경의 "Jr." 표시

### 시니어 전용 스타일

- 그라데이션: 핑크 계열 (`#f093fb` → `#f5576c`)
- 배지: 주황색 배경의 "Sr." 표시

## API 엔드포인트

- **GET** `/api/users/[nickname]`: 사용자 프로필 정보 조회
- 응답 타입: `UserProfileResponseDto`

## 의존성

- `@/lib/hooks/useApi`: API 호출 훅
- `@/backend/users/user/applications/dtos/UserDtos`: 사용자 DTO 타입
- `next/navigation`: Next.js 라우팅

## 주의사항

1. **클라이언트 컴포넌트**: HOC는 `"use client"` 지시어가 필요합니다.
2. **API 호출**: 사용자 정보를 조회하기 위해 API 호출이 발생합니다.
3. **리다이렉트**: 권한 분기 시 `router.replace()`를 사용하여 브라우저 히스토리에 기록되지 않습니다.
4. **성능**: 불필요한 리렌더링을 방지하기 위해 `useEffect`와 적절한 의존성 배열을 사용합니다.
