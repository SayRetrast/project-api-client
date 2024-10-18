import { FastifyReply, FastifyRequest } from 'fastify';
import { ISignInDto } from '../models/dto/signIn.dto';
import { ISignUpDto } from '../models/dto/signUp.dto';

interface IAuthRestController {
  signIn(request: FastifyRequest<{ Body: ISignInDto }>, reply: FastifyReply): Promise<void>;
  signUp(request: FastifyRequest<{ Body: ISignUpDto }>, reply: FastifyReply): Promise<void>;
  signOut(request: FastifyRequest, reply: FastifyReply): Promise<void>;
}

class AuthRestController implements IAuthRestController {
  async signIn(request: FastifyRequest<{ Body: ISignInDto }>, reply: FastifyReply): Promise<void> {
    const { username, password } = request.body;

    reply.send({ username, password, message: 'Sign in successful' });
  }

  async signUp(request: FastifyRequest<{ Body: ISignUpDto }>, reply: FastifyReply): Promise<void> {
    const { username, password, passwordConfirm } = request.body;

    reply.send({ username, password, passwordConfirm, message: 'Sign up successful' });
  }

  async signOut(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    reply.send({ message: 'Sign out successful' });
  }
}

export const authRestController = new AuthRestController();
