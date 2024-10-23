import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify';
import { SignUpBody, signUpSchema } from '../models/signUp.schema';
import { authRestController } from '../controllers/rest.controller';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { SignInBody, signInSchema } from '../models/signIn.schema';
import { SignOutParams, signOutSchema } from '../models/signOut.schema';

export function routes(fastify: FastifyInstance, options: FastifyPluginOptions, done: (err?: Error) => void): void {
  fastify
    .withTypeProvider<ZodTypeProvider>()
    .post('/sign-in', { schema: signInSchema }, (request: FastifyRequest<{ Body: SignInBody }>, reply: FastifyReply) =>
      authRestController.signIn(request, reply)
    );

  fastify
    .withTypeProvider<ZodTypeProvider>()
    .post('/sign-up', { schema: signUpSchema }, (request: FastifyRequest<{ Body: SignUpBody }>, reply: FastifyReply) =>
      authRestController.signUp(request, reply)
    );

  fastify
    .withTypeProvider<ZodTypeProvider>()
    .delete(
      '/sign-out/:userId',
      { schema: signOutSchema },
      (request: FastifyRequest<{ Params: SignOutParams }>, reply: FastifyReply) =>
        authRestController.signOut(request, reply)
    );

  done();
}
