import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

export interface DecodedToken {
  id: number;
  loginId: string;
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
 * 쿠키에서 refresh token을 추출합니다.
 * @returns refresh token 또는 null
 */
export async function getRefreshToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refresh-token');
    return refreshToken?.value || null;
  } catch {
    return null;
  }
}

/**
 * 토큰이 유효한지 검증합니다.
 * @param token - 검증할 JWT 토큰
 * @param secret - JWT 시크릿 키
 * @returns DecodedToken 또는 null
 */
export function verifyToken(
  token: string,
  secret: string
): DecodedToken | null {
  try {
    return jwt.verify(token, secret) as DecodedToken;
  } catch {
    return null;
  }
}
