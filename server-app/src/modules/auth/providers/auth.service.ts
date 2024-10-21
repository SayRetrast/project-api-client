import { FastifyRequest } from 'fastify';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IUser } from '@/core/interfaces/user.interface';
import { v4 } from 'uuid';
import { IAuthRepository, authRepository } from './auth.repository';

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
  private readonly authRepository: IAuthRepository;

  constructor(authRepository: IAuthRepository) {
    this.authRepository = authRepository;
  }

  async signIn(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async signUp({ request, username, password }: SignUpParams): Promise<TokensData> {
    const userId = v4();
    const hashedPassword = await bcrypt.hash(password, 10);
    const { accessToken, refreshToken } = this.generateTokens({ userId, username });

    this.authRepository.signUpUser({
      userId,
      username,
      hashedPassword,
      refreshToken,
      userAgent: request.headers['user-agent'] as string,
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

export const authService = new AuthService(authRepository);
