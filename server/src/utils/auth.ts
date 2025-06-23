import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { JWTPayload, AuthTokens } from '@/types';
import DatabaseConnection from '@/database/connection';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'fallback-refresh-secret';
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '30d';

export class AuthUtils {
  static async hashPassword(password: string): Promise<string> {
    const rounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
    return bcrypt.hash(password, rounds);
  }

  static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  static generateAccessToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }

  static generateRefreshToken(userId: string): string {
    return jwt.sign({ userId }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });
  }

  static verifyAccessToken(token: string): JWTPayload {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  }

  static verifyRefreshToken(token: string): { userId: string } {
    return jwt.verify(token, REFRESH_TOKEN_SECRET) as { userId: string };
  }

  static async generateTokens(userId: string, email: string, role: string): Promise<AuthTokens> {
    const accessToken = this.generateAccessToken({ userId, email, role });
    const refreshToken = this.generateRefreshToken(userId);

    // Store refresh token in database
    const db = DatabaseConnection.getInstance();
    const tokenId = uuidv4();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    await db.run(
      'INSERT INTO refresh_tokens (id, user_id, token, expires_at) VALUES (?, ?, ?, ?)',
      [tokenId, userId, refreshToken, expiresAt.toISOString()]
    );

    return { accessToken, refreshToken };
  }

  static async revokeRefreshToken(token: string): Promise<void> {
    const db = DatabaseConnection.getInstance();
    await db.run('DELETE FROM refresh_tokens WHERE token = ?', [token]);
  }

  static async revokeAllUserTokens(userId: string): Promise<void> {
    const db = DatabaseConnection.getInstance();
    await db.run('DELETE FROM refresh_tokens WHERE user_id = ?', [userId]);
  }

  static async isRefreshTokenValid(token: string): Promise<boolean> {
    const db = DatabaseConnection.getInstance();
    const result = await db.get(
      'SELECT id FROM refresh_tokens WHERE token = ? AND expires_at > datetime("now")',
      [token]
    );
    return !!result;
  }

  static async cleanupExpiredTokens(): Promise<void> {
    const db = DatabaseConnection.getInstance();
    await db.run('DELETE FROM refresh_tokens WHERE expires_at <= datetime("now")');
  }
}