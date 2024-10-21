import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify';
import { SignUpDto, signUpSchema } from '../models/signUp.schema';
import { authRestController } from '../controllers/rest.controller';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { signInSchema } from '../models/signIn.schema';

export function routes(fastify: FastifyInstance, options: FastifyPluginOptions, done: (err?: Error) => void): void {
  fastify
    .withTypeProvider<ZodTypeProvider>()
    .post('/sign-in', { schema: signInSchema }, (request: FastifyRequest<{ Body: SignUpDto }>, reply: FastifyReply) =>
      authRestController.signIn(request, reply)
    );

  fastify
    .withTypeProvider<ZodTypeProvider>()
    .post('/sign-up', { schema: signUpSchema }, (request: FastifyRequest<{ Body: SignUpDto }>, reply: FastifyReply) =>
      authRestController.signUp(request, reply)
    );

  fastify.delete('/sign-out', authRestController.signOut);

  done();
}
