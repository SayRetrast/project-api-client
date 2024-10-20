import prisma from '../utils/prisma';

type CreateTokenParams = {
  userId: string;
  refreshToken: string;
  device: string;
  browser: string;
};

interface IRefreshTokenRepository {
  createToken({ userId, refreshToken, device, browser }: CreateTokenParams): Promise<void>;
}

export class RefreshTokenRepository implements IRefreshTokenRepository {
  async createToken({ userId, refreshToken, device, browser }: CreateTokenParams): Promise<void> {
    await prisma.refreshTokens.create({
      data: {
        userId: userId,
        refreshToken: refreshToken,
        device: device,
        browser: browser,
      },
    });
  }
}
