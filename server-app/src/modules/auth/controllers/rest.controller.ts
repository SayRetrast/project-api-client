import { FastifyReply, FastifyRequest } from 'fastify';
import { authService, IAuthService } from '../providers/auth.service';
import jwt, { JwtPayload } from 'jsonwebtoken';
import {
  BadRequestError,
  ConflictError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from '../../../core/errors/httpErrors';
import { ErrorWithStatusCode } from '../../../core/errors/errorWithStatusCode';
import { SignInBody } from '../models/signIn.schema';
import { SignUpBody } from '../models/signUp.schema';

interface IAuthRestController {
  signIn(request: FastifyRequest<{ Body: SignInBody }>, reply: FastifyReply): Promise<void>;
  signUp(request: FastifyRequest<{ Body: SignUpBody }>, reply: FastifyReply): Promise<void>;
  signOut(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  renewTokens(request: FastifyRequest, reply: FastifyReply): Promise<void>;
}

class AuthRestController implements IAuthRestController {
  private readonly authService: IAuthService;

  constructor(authService: IAuthService) {
    this.authService = authService;
  }

  async signIn(request: FastifyRequest<{ Body: SignInBody }>, reply: FastifyReply): Promise<void> {
    const { username, password } = request.body;

    const { accessToken, refreshToken } = await this.authService
      .signIn({ request, username, password })
      .catch((error) => {
        if (error.statusCode === 401) {
          throw new UnauthorizedError(error.message);
        }

        throw new InternalServerError(error.message);
      });

    this.setTokenCookie(refreshToken, reply);

    return reply.code(201).send({ statusCode: 201, accessToken });
  }

  async signUp(request: FastifyRequest<{ Body: SignUpBody }>, reply: FastifyReply): Promise<void> {
    const { username, password, passwordConfirm } = request.body;
    if (password !== passwordConfirm) {
      throw new BadRequestError('Entered passwords do not match');
    }

    const { accessToken, refreshToken } = await this.authService
      .signUp({ request, username, password })
      .catch((error: ErrorWithStatusCode) => {
        if (error.statusCode === 409) {
          throw new ConflictError(error.message);
        }

        throw new InternalServerError(error.message);
      });

    this.setTokenCookie(refreshToken, reply);

    return reply.code(201).send({ statusCode: 201, accessToken });
  }

  async signOut(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { userId } = request.user!;

    this.deleteTokenCookie(reply, 'refreshToken');

    await this.authService.signOut({ request, userId }).catch((error: ErrorWithStatusCode) => {
      if (error.statusCode === 404) {
        throw new NotFoundError(error.message);
      }

      throw new InternalServerError(error.message);
    });

    return reply.code(204);
  }

  async renewTokens(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const refreshToken = this.getTokenCookie(request, 'refreshToken');
    if (!refreshToken) {
      throw new UnauthorizedError('Missing refresh token');
    }

    const { accessToken, refreshToken: newRefreshToken } = await this.authService
      .renewTokens({ request, refreshToken })
      .catch((error: ErrorWithStatusCode) => {
        if (error.statusCode === 401) {
          throw new UnauthorizedError(error.message);
        }

        if (error.statusCode === 404) {
          throw new NotFoundError(error.message);
        }

        throw new InternalServerError(error.message);
      });

    this.setTokenCookie(newRefreshToken, reply);

    return reply.code(200).send({ statusCode: 200, accessToken });
  }

  private setTokenCookie(token: string, reply: FastifyReply): void {
    try {
      const decodedJwt = jwt.decode(token) as JwtPayload;
      const tokenExpiry = decodedJwt.exp as number;
      const tokenType = decodedJwt.tokenType as string;

      reply.setCookie(tokenType, token, {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production' ? true : false,
        domain: 'localhost',
        expires: new Date(tokenExpiry * 1000),
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerError('Failed to set token cookie');
    }
  }

  private getTokenCookie(request: FastifyRequest, tokenType: string): string | undefined {
    try {
      return request.cookies[tokenType];
    } catch (error) {
      console.error(error);
      throw new InternalServerError('Failed to get token cookie');
    }
  }

  private deleteTokenCookie(reply: FastifyReply, tokenType: string): void {
    try {
      reply.clearCookie(tokenType);
    } catch (error) {
      console.error(error);
      throw new InternalServerError('Failed to delete tokens cookie');
    }
  }
}

export const authRestController = new AuthRestController(authService);
