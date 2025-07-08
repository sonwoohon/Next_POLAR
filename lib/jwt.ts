import jwt from 'jsonwebtoken';

const ACCESS_SECRET = process.env.ACCESS_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

if (!ACCESS_SECRET || !REFRESH_SECRET) {
  throw new Error('JWT 시크릿 키가 환경 변수에 설정되지 않았습니다.');
}

export function generateAccessToken(payload: Record<string, unknown>) {
  if (!payload || typeof payload !== 'object') {
    throw new Error('유효하지 않은 페이로드입니다.');
  }
  return jwt.sign(payload, ACCESS_SECRET as string, { expiresIn: '15m' });
}

export function generateRefreshToken(payload: Record<string, unknown>) {
  if (!payload || typeof payload !== 'object') {
    throw new Error('유효하지 않은 페이로드입니다.');
  }
  return jwt.sign(payload, REFRESH_SECRET as string, { expiresIn: '7d' });
}
