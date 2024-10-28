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

type createRegistrationKeyParams = {
  userId: string;
  expirationDate: Date;
};

type GetRegistrationKeyExpirationDateParams = {
  registrationKey: string;
};

export interface IAuthRepository {
  findUserSessionByUserInfo(params: FindUserSessionByUserInfoParams): Promise<{ refreshToken: string } | null>;
  findUserSessionByRefreshToken(
    params: FindUserSessionByRefreshTokenParams
  ): Promise<{ userId: string; refreshToken: string; userAgent: string } | null>;
  findUserById(params: FindUserByIdParams): Promise<IUser | null>;
  getRegistrationKeyExpirationDate(params: GetRegistrationKeyExpirationDateParams): Promise<Date | null>;
  getUserIdAndPassword(params: GetUserIdAndPasswordParams): Promise<{ userId: string; password: string } | null>;
  updateRefreshToken(params: UpdateRefreshTokenParams): Promise<void>;
  createRegistrationKey(params: createRegistrationKeyParams): Promise<string>;
  signInUser(params: SignInUserParams): Promise<void>;
  signUpUser(params: SignUpUserParams): Promise<void>;
  signOutUser(params: SignOutUserParams): Promise<void>;
}

class AuthRepository implements IAuthRepository {
  async findUserSessionByUserInfo({
    userId,
    userAgent,
  }: FindUserSessionByUserInfoParams): Promise<{ refreshToken: string } | null> {
    const userSession = await prisma.sessions.findUnique({
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
    const userSession = await prisma.sessions.findUnique({
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
        password: {
          select: {
            password: true,
          },
        },
      },
    });

    if (!userData || !userData.password) {
      return null;
    }

    return {
      userId: userData.userId,
      password: userData.password.password,
    };
  }

  async getRegistrationKeyExpirationDate({
    registrationKey,
  }: GetRegistrationKeyExpirationDateParams): Promise<Date | null> {
    const registrationKeyData = await prisma.registrationKeys.findUnique({
      where: {
        registrationKey,
      },
    });

    if (!registrationKeyData) {
      return null;
    }

    return registrationKeyData.expirationDate;
  }

  async updateRefreshToken({ userId, userAgent, refreshToken }: UpdateRefreshTokenParams): Promise<void> {
    await prisma.sessions.update({
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

  async createRegistrationKey({ userId, expirationDate }: createRegistrationKeyParams): Promise<string> {
    const createdRegistrationKeyData = await prisma.registrationKeys.create({
      data: {
        creatorId: userId,
        expirationDate,
      },
    });

    return createdRegistrationKeyData.registrationKey;
  }

  async signInUser({ userId, refreshToken, userAgent }: SignInUserParams): Promise<void> {
    await prisma.sessions.upsert({
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
        password: {
          create: {
            password: hashedPassword,
          },
        },
        sessions: {
          create: {
            refreshToken: refreshToken,
            userAgent: userAgent,
          },
        },
      },
    });
  }

  async signOutUser({ userId, userAgent }: SignOutUserParams): Promise<void> {
    await prisma.sessions.delete({
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
