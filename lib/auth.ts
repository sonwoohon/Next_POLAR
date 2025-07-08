import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export interface DecodedToken {
  id: number;
  loginId: string;
}

export interface AuthResult {
  success: boolean;
  user?: DecodedToken;
  error?: string;
}

/**
 * 쿠키에서 access token을 추출하고 검증하여 사용자 정보를 반환합니다.
 * @returns AuthResult - 인증 결과 (성공 시 사용자 정보, 실패 시 에러 메시지)
 */
export async function getAuthenticatedUser(): Promise<AuthResult> {
  try {
    const cookieStore = await cookies();

    // 쿠키에서 토큰 읽기
    const accessToken = cookieStore.get('access-token');

    if (!accessToken) {
      return {
        success: false,
        error: '인증 토큰이 없습니다.',
      };
    }

    // JWT 토큰 검증
    const ACCESS_SECRET = process.env.ACCESS_SECRET;
    if (!ACCESS_SECRET) {
      return {
        success: false,
        error: 'JWT 시크릿 키가 설정되지 않았습니다.',
      };
    }

    try {
      const decoded = jwt.verify(
        accessToken.value,
        ACCESS_SECRET
      ) as DecodedToken;

      return {
        success: true,
        user: decoded,
      };
    } catch {
      return {
        success: false,
        error: '유효하지 않은 토큰입니다.',
      };
    }
  } catch (e: unknown) {
    const errorMessage =
      e instanceof Error ? e.message : '인증 처리 중 오류가 발생했습니다.';
    return {
      success: false,
      error: errorMessage,
    };
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
