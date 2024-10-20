import prisma from '../utils/prisma';

type CreateTokenParams = {
  userId: string;
  refreshToken: string;
  userAgent: string;
};

export interface IRefreshTokenRepository {
  createToken({ userId, refreshToken, userAgent }: CreateTokenParams): Promise<void>;
}

class RefreshTokenRepository implements IRefreshTokenRepository {
  async createToken({ userId, refreshToken, userAgent }: CreateTokenParams): Promise<void> {
    await prisma.refreshTokens.create({
      data: {
        userId: userId,
        refreshToken: refreshToken,
        userAgent: userAgent,
      },
    });
  }
}

export const refreshTokenRepository = new RefreshTokenRepository();
