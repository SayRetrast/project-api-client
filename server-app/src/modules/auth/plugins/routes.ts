import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify';
import { SignUpBody, SignUpResponse, signUpSchema } from '../models/signUp.model';
import { authRestController } from '../controllers/rest.controller';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { SignInBody, SignInResponse, signInSchema } from '../models/signIn.model';
import { authDecorator } from './auth.decorator';
import { authMiddleware } from '../hooks/authMiddleware.hook';
import { signOutSchema } from '../models/signOut.model';
import { RenewTokensResponse } from '../models/renewTokens.model';

export function routes(fastify: FastifyInstance, options: FastifyPluginOptions, done: (err?: Error) => void): void {
  fastify.register(authDecorator);

  fastify.withTypeProvider<ZodTypeProvider>().get<{
    Reply: RenewTokensResponse;
  }>('/renew-tokens', (request: FastifyRequest, reply: FastifyReply<{ Reply: RenewTokensResponse }>) => authRestController.renewTokens(request, reply));

  fastify.withTypeProvider<ZodTypeProvider>().post<{
    Body: SignInBody;
    Reply: SignInResponse;
  }>('/sign-in', { schema: signInSchema }, (request: FastifyRequest<{ Body: SignInBody }>, reply: FastifyReply<{ Reply: SignInResponse }>) => authRestController.signIn(request, reply));

  fastify.withTypeProvider<ZodTypeProvider>().post<{
    Body: SignUpBody;
    Reply: SignUpResponse;
  }>('/sign-up', { schema: signUpSchema }, (request: FastifyRequest<{ Body: SignUpBody }>, reply: FastifyReply<{ Reply: SignUpResponse }>) => authRestController.signUp(request, reply));

  fastify
    .withTypeProvider<ZodTypeProvider>()
    .delete(
      '/sign-out',
      { preHandler: authMiddleware, schema: signOutSchema },
      (request: FastifyRequest, reply: FastifyReply) => authRestController.signOut(request, reply)
    );

  done();
}
