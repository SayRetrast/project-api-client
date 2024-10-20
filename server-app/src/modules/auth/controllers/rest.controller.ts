import { FastifyReply, FastifyRequest } from 'fastify';
import { ISignInDto } from '../models/dto/signIn.dto';
import { ISignUpDto } from '../models/dto/signUp.dto';
import { authService, IAuthService } from '../providers/auth.service';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface IAuthRestController {
  signIn(request: FastifyRequest<{ Body: ISignInDto }>, reply: FastifyReply): Promise<void>;
  signUp(request: FastifyRequest<{ Body: ISignUpDto }>, reply: FastifyReply): Promise<void>;
  signOut(request: FastifyRequest, reply: FastifyReply): Promise<void>;
}

class AuthRestController implements IAuthRestController {
  private readonly authService: IAuthService;

  constructor(authService: IAuthService) {
    this.authService = authService;
  }

  async signIn(request: FastifyRequest<{ Body: ISignInDto }>, reply: FastifyReply): Promise<void> {
    const { username, password } = request.body;

    reply.send({ username, password, message: 'Sign in successful' });
  }

  async signUp(request: FastifyRequest<{ Body: ISignUpDto }>, reply: FastifyReply): Promise<void> {
    const { username, password } = request.body;

    const { accessToken, refreshToken } = await this.authService.signUp({ request, username, password });

    this.setTokenCookie(accessToken, reply);
    this.setTokenCookie(refreshToken, reply);

    reply.code(201).send({ statusCode: 201, message: 'Sign up successful' });
  }

  async signOut(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    reply.send({ message: 'Sign out successful' });
  }

  private setTokenCookie(token: string, reply: FastifyReply) {
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
  }
}

export const authRestController = new AuthRestController(authService);
