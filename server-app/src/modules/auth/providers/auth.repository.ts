import prisma from '../../../core/utils/prisma';

type SignUpUserParams = {
  username: string;
  userId: string;
  hashedPassword: string;
  refreshToken: string;
  userAgent: string;
};

type SignInUserParams = {
  userId: string;
  refreshToken: string;
  userAgent: string;
};

export interface IAuthRepository {
  getUserIdAndPassword({ username }: { username: string }): Promise<{ userId: string; password: string } | null>;
  signInUser({ userId, refreshToken, userAgent }: SignInUserParams): Promise<void>;
  signUpUser({ username, userId, hashedPassword, refreshToken, userAgent }: SignUpUserParams): Promise<void>;
}

class AuthRepository implements IAuthRepository {
  async getUserIdAndPassword({ username }: { username: string }): Promise<{ userId: string; password: string } | null> {
    const userData = await prisma.users.findUnique({
      where: {
        username: username,
      },
      select: {
        userId: true,
        passwords: {
          select: {
            password: true,
          },
        },
      },
    });

    if (!userData || !userData.passwords) {
      return null;
    }

    return {
      userId: userData.userId,
      password: userData.passwords.password,
    };
  }

  async signInUser({ userId, refreshToken, userAgent }: SignInUserParams): Promise<void> {
    await prisma.refreshTokens.upsert({
      where: {
        userId_userAgent: {
          userId: userId,
          userAgent: userAgent,
        },
      },
      create: {
        userId: userId,
        refreshToken: refreshToken,
        userAgent: userAgent,
      },
      update: {
        refreshToken: refreshToken,
      },
    });
  }

  async signUpUser({ username, userId, hashedPassword, refreshToken, userAgent }: SignUpUserParams): Promise<void> {
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
