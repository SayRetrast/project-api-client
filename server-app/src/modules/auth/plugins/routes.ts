import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { signInSchema } from '../models/schemas/signIn.schema';
import { signUpSchema } from '../models/schemas/signUp.schema';
import { authRestController } from '../controllers/rest.controller';

interface IAuthRouter {
  routes(fastify: FastifyInstance, options: FastifyPluginOptions, done: (err?: Error) => void): void;
}

class AuthRouter implements IAuthRouter {
  routes(fastify: FastifyInstance, options: FastifyPluginOptions, done: (err?: Error) => void): void {
    fastify.post('/sign-in', { schema: signInSchema }, authRestController.signIn);
    fastify.post('/sign-up', { schema: signUpSchema }, authRestController.signUp);

    fastify.delete('/sign-out', authRestController.signOut);

    done();
  }
}

export const authRouter = new AuthRouter();
