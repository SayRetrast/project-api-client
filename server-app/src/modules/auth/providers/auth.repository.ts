import { IUser } from '../../../core/interfaces/user.interface';
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

type SignOutUserParams = {
  userId: string;
  userAgent: string;
};

type FindUserSessionByUserInfoParams = {
  userId: string;
  userAgent: string;
};

type FindUserSessionByRefreshTokenParams = {
  refreshToken: string;
};

type UpdateRefreshTokenParams = {
  userId: string;
  userAgent: string;
  refreshToken: string;
};

type FindUserByIdParams = {
  userId: string;
};

type GetUserIdAndPasswordParams = {
  username: string;
};

export interface IAuthRepository {
  findUserSessionByUserInfo({
    userId,
    userAgent,
  }: FindUserSessionByUserInfoParams): Promise<{ refreshToken: string } | null>;
  findUserSessionByRefreshToken({
    refreshToken,
  }: FindUserSessionByRefreshTokenParams): Promise<{ userId: string; refreshToken: string; userAgent: string } | null>;
  findUserById({ userId }: FindUserByIdParams): Promise<IUser | null>;
  getUserIdAndPassword({ username }: GetUserIdAndPasswordParams): Promise<{ userId: string; password: string } | null>;
  updateRefreshToken({ userId, userAgent, refreshToken }: UpdateRefreshTokenParams): Promise<void>;
  signInUser({ userId, refreshToken, userAgent }: SignInUserParams): Promise<void>;
  signUpUser({ username, userId, hashedPassword, refreshToken, userAgent }: SignUpUserParams): Promise<void>;
  signOutUser({ userId, userAgent }: SignOutUserParams): Promise<void>;
}

class AuthRepository implements IAuthRepository {
  async findUserSessionByUserInfo({
    userId,
    userAgent,
  }: FindUserSessionByUserInfoParams): Promise<{ refreshToken: string } | null> {
    const userSession = await prisma.refreshTokens.findUnique({
      where: {
        userId_userAgent: {
          userId,
          userAgent,
        },
      },
    });

    if (!userSession) {
      return null;
    }

    return {
      refreshToken: userSession.refreshToken,
    };
  }

  async findUserSessionByRefreshToken({
    refreshToken,
  }: FindUserSessionByRefreshTokenParams): Promise<{ userId: string; refreshToken: string; userAgent: string } | null> {
    const userSession = await prisma.refreshTokens.findUnique({
      where: {
        refreshToken,
      },
    });

    if (!userSession) {
      return null;
    }

    return {
      userId: userSession.userId,
      refreshToken: userSession.refreshToken,
      userAgent: userSession.userAgent,
    };
  }

  async findUserById({ userId }: FindUserByIdParams): Promise<IUser | null> {
    return await prisma.users.findUnique({
      where: {
        userId: userId,
      },
    });
  }

  async getUserIdAndPassword({
    username,
  }: GetUserIdAndPasswordParams): Promise<{ userId: string; password: string } | null> {
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

  async updateRefreshToken({ userId, userAgent, refreshToken }: UpdateRefreshTokenParams): Promise<void> {
    await prisma.refreshTokens.update({
      where: {
        userId_userAgent: {
          userId: userId,
          userAgent: userAgent,
        },
      },
      data: {
        refreshToken,
      },
    });
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

  async signOutUser({ userId, userAgent }: SignOutUserParams): Promise<void> {
    await prisma.refreshTokens.delete({
      where: {
        userId_userAgent: {
          userId: userId,
          userAgent: userAgent,
        },
      },
    });
  }
}

export const authRepository = new AuthRepository();
