import prisma from '@/core/utils/prisma';

type RegisterUserParams = {
  username: string;
  userId: string;
  hashedPassword: string;
  refreshToken: string;
  userAgent: string;
};

export interface IAuthRepository {
  signUpUser({ username, userId, hashedPassword, refreshToken, userAgent }: RegisterUserParams): Promise<void>;
}

class AuthRepository implements IAuthRepository {
  async signUpUser({ username, userId, hashedPassword, refreshToken, userAgent }: RegisterUserParams): Promise<void> {
    await prisma.users.create({
      data: {
        userId: userId,
        username: username,
        passwords: {
          create: {
            password: hashedPassword,
          },
        },
        refreshTokens: {
          create: {
            refreshToken: refreshToken,
            userAgent: userAgent,
          },
        },
      },
    });
  }
}

export const authRepository = new AuthRepository();
