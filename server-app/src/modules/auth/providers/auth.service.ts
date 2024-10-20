import { IPasswordRepository, passwordRepository } from '@/core/providers/password.repository';
import { IRefreshTokenRepository, refreshTokenRepository } from '@/core/providers/refreshToken.repository';
import { IUserRepository, userRepository } from '@/core/providers/user.repository';
import { FastifyRequest } from 'fastify';
import bcrypt from 'bcrypt';
import prisma from '@/core/utils/prisma';
import jwt from 'jsonwebtoken';
import { IUser } from '@/core/interfaces/user.interface';

type SignUpParams = {
  request: FastifyRequest;
  username: string;
  password: string;
};

type TokensData = {
  accessToken: string;
  refreshToken: string;
};

export interface IAuthService {
  signIn(): Promise<void>;
  signUp({ request, username, password }: SignUpParams): Promise<TokensData>;
  signOut(): Promise<void>;
}

class AuthService implements IAuthService {
  private readonly userRepository: IUserRepository;
  private readonly refreshTokenRepository: IRefreshTokenRepository;
  private readonly passwordRepository: IPasswordRepository;

  constructor(
    userRepository: IUserRepository,
    refreshTokenRepository: IRefreshTokenRepository,
    passwordRepository: IPasswordRepository
  ) {
    this.userRepository = userRepository;
    this.refreshTokenRepository = refreshTokenRepository;
    this.passwordRepository = passwordRepository;
  }

  async signIn(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async signUp({ request, username, password }: SignUpParams): Promise<TokensData> {
    const hashedPassword = await bcrypt.hash(password, 10);

    const { accessToken, refreshToken } = await prisma.$transaction(async (): Promise<TokensData> => {
      const createdUser = await this.userRepository.createUser(username);
      this.passwordRepository.createPassword(createdUser.userId, hashedPassword);

      const { accessToken, refreshToken } = this.generateTokens(createdUser);
      this.refreshTokenRepository.createToken({
        userId: createdUser.userId,
        refreshToken,
        userAgent: request.headers['user-agent'] as string,
      });

      return { accessToken, refreshToken };
    });

    return { accessToken, refreshToken };
  }

  async signOut(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  private generateTokens(user: IUser): { accessToken: string; refreshToken: string } {
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
  }
}

export const authService = new AuthService(userRepository, refreshTokenRepository, passwordRepository);
