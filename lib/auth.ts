import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import { getNicknameFromCookie } from '@/lib/jwt';

export interface DecodedToken {
  nickname: string;
  role: string;
}

export interface AuthResult {
  user?: DecodedToken;
  error?: string;
}

/**
 * NextRequest에서 access-token을 추출해 사용자 정보를 반환
 */
export function getAuthenticatedUser(request: NextRequest): AuthResult {
  try {
    // 1. 쿠키에서 access-token 추출
    const accessToken = request.cookies.get('access-token')?.value;
    if (!accessToken) {
      return { error: '인증 토큰이 없습니다.' };
    }

    // 2. JWT 시크릿 키 확인
    const ACCESS_SECRET = process.env.ACCESS_SECRET;
    if (!ACCESS_SECRET) {
      return { error: 'JWT 시크릿 키가 설정되지 않았습니다.' };
    }

    // 3. 토큰 검증 및 디코딩
    const decoded = jwt.verify(accessToken, ACCESS_SECRET) as DecodedToken;

    return { user: decoded };
  } catch (e: unknown) {
    // JWT 관련 에러 타입 체크
    if (e instanceof jwt.JsonWebTokenError) {
      return { error: '유효하지 않은 토큰입니다.' };
    }

    if (e instanceof jwt.TokenExpiredError) {
      return { error: '토큰이 만료되었습니다.' };
    }

    if (e instanceof jwt.NotBeforeError) {
      return { error: '토큰이 아직 유효하지 않습니다.' };
    }

    // 기타 예상치 못한 에러
    console.error('Token verification error:', e);
    return { error: '토큰 검증 중 오류가 발생했습니다.' };
  }
}

/**
 * 점수 조회를 위한 nickname 추출 및 권한 검증
 * @param request - NextRequest 객체
 * @returns 검증된 nickname과 권한 정보
 */
export function extractNicknameForScoreAccess(request: NextRequest): {
  nickname: string;
  isOwnData: boolean;
  error?: string;
} {
  // 쿼리 파라미터에서 nickname 추출 (다른 사용자 조회용)
  const queryNickname = request.nextUrl.searchParams.get('nickname');

  if (queryNickname) {
    // 쿼리 파라미터로 nickname이 제공된 경우 (다른 사용자 조회)
    // 로그인 상태만 확인하고, 쿼리 파라미터의 nickname을 사용
    const authResult = getAuthenticatedUser(request);
    if (authResult.error || !authResult.user) {
      return {
        nickname: '',
        isOwnData: false,
        error: '로그인이 필요합니다.',
      };
    }

    return {
      nickname: queryNickname,
      isOwnData: false,
    };
  } else {
    // 쿼리 파라미터가 없는 경우 쿠키에서 nickname 추출 (내 데이터 조회)
    const userData = getNicknameFromCookie(request);
    const nickname = userData?.nickname || null;

    if (!nickname) {
      return {
        nickname: '',
        isOwnData: true,
        error: '로그인이 필요하거나 유효한 nickname이 필요합니다.',
      };
    }

    return {
      nickname,
      isOwnData: true,
    };
  }
}
