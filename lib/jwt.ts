import jwt from 'jsonwebtoken';

const ACCESS_SECRET = process.env.ACCESS_SECRET || 'access_secret';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'refresh_secret';

export function generateAccessToken(payload: object) {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: '15m' });
}

export function generateRefreshToken(payload: object) {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' });
}
