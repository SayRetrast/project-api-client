import { FastifyRequest } from 'fastify';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 } from 'uuid';
import { IAuthRepository, authRepository } from './auth.repository';
import { IUser } from '../../../core/interfaces/user.interface';
import { ErrorWithStatusCode } from '../../../core/errors/errorWithStatusCode';

type SignUpParams = {
  request: FastifyRequest;
  username: string;
  password: string;
};

type SignInParams = {
  request: FastifyRequest;
  username: string;
  password: string;
};

type SignOutParams = {
  request: FastifyRequest;
  userId: string;
};

type RenewTokensParams = {
  request: FastifyRequest;
  refreshToken: string;
};

type TokensData = {
  accessToken: string;
  refreshToken: string;
};

export interface IAuthService {
  signIn({ request, username, password }: SignInParams): Promise<TokensData>;
  signUp({ request, username, password }: SignUpParams): Promise<TokensData>;
  signOut({ request, userId }: SignOutParams): Promise<void>;
  renewTokens({ request, refreshToken }: RenewTokensParams): Promise<TokensData>;
}

class AuthService implements IAuthService {
  private readonly authRepository: IAuthRepository;

  constructor(authRepository: IAuthRepository) {
    this.authRepository = authRepository;
  }

  async signIn({ request, username, password }: SignInParams): Promise<TokensData> {
    const userIdAndPassword = await this.authRepository.getUserIdAndPassword({ username });
    if (!userIdAndPassword) {
      console.error('User with this username does not exist');
      throw new ErrorWithStatusCode(401, 'Wrong username or password');
    }

    const { userId, password: hashedPassword } = userIdAndPassword;

    const isPasswordValid = await bcrypt.compare(password, hashedPassword);
    if (!isPasswordValid) {
      console.error('Wrong password');
      throw new ErrorWithStatusCode(401, 'Wrong username or password');
    }

    const { accessToken, refreshToken } = this.generateTokens({ userId, username });

    await this.authRepository
      .signInUser({
        userId,
        refreshToken,
        userAgent: request.headers['user-agent'] as string,
      })
      .catch((error) => {
        console.error(error);
        throw new ErrorWithStatusCode(500, 'Failed to sign in user');
      });

    return { accessToken, refreshToken };
  }

  async signUp({ request, username, password }: SignUpParams): Promise<TokensData> {
    const userId = v4();
    const hashedPassword = await bcrypt.hash(password, 10);
    const { accessToken, refreshToken } = this.generateTokens({ userId, username });

    const existingUser = await this.authRepository.getUserIdAndPassword({ username });
    if (existingUser) {
      console.error('User with this username already exists');
      throw new ErrorWithStatusCode(409, 'User with this username already exists');
    }

    await this.authRepository
      .signUpUser({
        userId,
        username,
        hashedPassword,
        refreshToken,
        userAgent: request.headers['user-agent'] as string,
      })
      .catch((error) => {
        console.error(error);
        throw new ErrorWithStatusCode(500, 'Failed to sign up user');
      });

    return { accessToken, refreshToken };
  }

  async signOut({ request, userId }: SignOutParams): Promise<void> {
    const userAgent = request.headers['user-agent'] as string;

    const existingSession = await this.authRepository.findUserSessionByUserInfo({ userId, userAgent });
    if (!existingSession) {
      console.error('User session not found');
      throw new ErrorWithStatusCode(404, 'User session not found');
    }

    await this.authRepository
      .signOutUser({
        userId,
        userAgent,
      })
      .catch((error) => {
        console.error(error);
        throw new ErrorWithStatusCode(500, 'Failed to sign out user');
      });

    return;
  }

  async renewTokens({ request, refreshToken }: { request: FastifyRequest; refreshToken: string }): Promise<TokensData> {
    jwt.verify(refreshToken, process.env.JWT_SECRET_KEY as string, (error) => {
      if (error) {
        console.error(error);
        throw new ErrorWithStatusCode(401, 'Invalid refresh token');
      }
    });

    const existingSession = await this.authRepository.findUserSessionByRefreshToken({ refreshToken });
    if (!existingSession) {
      console.error('User session not found');
      throw new ErrorWithStatusCode(404, 'User session not found');
    }

    const { userId, userAgent } = existingSession;
    if (userAgent !== request.headers['user-agent']) {
      console.error('User agent does not match');
      throw new ErrorWithStatusCode(401, 'User agent does not match');
    }

    const userData = await this.authRepository.findUserById({ userId });
    if (!userData) {
      console.error('User not found');
      throw new ErrorWithStatusCode(404, 'User not found');
    }

    const { accessToken, refreshToken: newRefreshToken } = this.generateTokens({
      userId,
      username: userData.username,
    });

    await this.authRepository
      .updateRefreshToken({
        userId,
        userAgent,
        refreshToken: newRefreshToken,
      })
      .catch((error) => {
        console.error(error);
        throw new ErrorWithStatusCode(500, 'Failed to renew tokens');
      });

    return { accessToken, refreshToken: newRefreshToken };
  }

  private generateTokens(user: IUser): { accessToken: string; refreshToken: string } {
    try {
      const accessToken = jwt.sign(
        {
          tokenType: 'accessToken',
          sub: user.userId,
          username: user.username,
        },
        process.env.JWT_SECRET_KEY as string,
        {
          expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN as string,
        }
      );

      const refreshToken = jwt.sign(
        {
          tokenType: 'refreshToken',
          sub: user.userId,
        },
        process.env.JWT_SECRET_KEY as string,
        {
          expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN as string,
        }
      );

      return { accessToken, refreshToken };
    } catch (error) {
      console.error(error);
      throw new ErrorWithStatusCode(500, 'Failed to generate tokens');
    }
  }
}

export const authService = new AuthService(authRepository);
