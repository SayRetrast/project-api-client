import { FastifyReply, FastifyRequest } from 'fastify';
import { authService, IAuthService } from '../providers/auth.service';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { SignInDto } from '../models/signIn.schema';
import { SignUpDto } from '../models/signUp.schema';
import { BadRequestError, InternalServerError } from '../../../core/errors/httpErrors';

interface IAuthRestController {
  signIn(request: FastifyRequest<{ Body: SignInDto }>, reply: FastifyReply): Promise<void>;
  signUp(request: FastifyRequest<{ Body: SignUpDto }>, reply: FastifyReply): Promise<void>;
  signOut(request: FastifyRequest, reply: FastifyReply): Promise<void>;
}

class AuthRestController implements IAuthRestController {
  private readonly authService: IAuthService;

  constructor(authService: IAuthService) {
    this.authService = authService;
  }

  async signIn(request: FastifyRequest<{ Body: SignInDto }>, reply: FastifyReply): Promise<void> {
    const { username, password } = request.body;

    const { accessToken, refreshToken } = await this.authService.signIn({ request, username, password });

    this.setTokenCookie(accessToken, reply);
    this.setTokenCookie(refreshToken, reply);

    reply.code(200).send({ statusCode: 200, message: 'Sign in successful' });
  }

  async signUp(request: FastifyRequest<{ Body: SignUpDto }>, reply: FastifyReply): Promise<void> {
    const { username, password, passwordConfirm } = request.body;
    if (password !== passwordConfirm) {
      throw new BadRequestError('Entered passwords do not match');
    }

    const { accessToken, refreshToken } = await this.authService.signUp({ request, username, password }).catch(() => {
      throw new InternalServerError('Failed to sign up user');
    });

    this.setTokenCookie(accessToken, reply);
    this.setTokenCookie(refreshToken, reply);

    reply.code(201).send({ statusCode: 201, message: 'Sign up successful' });
  }

  async signOut(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    reply.send({ message: 'Sign out successful' });
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
}

export const authRestController = new AuthRestController(authService);
