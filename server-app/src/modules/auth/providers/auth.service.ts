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

type TokensData = {
  accessToken: string;
  refreshToken: string;
};

export interface IAuthService {
  signIn({ request, username, password }: SignInParams): Promise<TokensData>;
  signUp({ request, username, password }: SignUpParams): Promise<TokensData>;
  signOut(): Promise<void>;
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

  async signOut(): Promise<void> {
    throw new Error('Method not implemented.');
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
