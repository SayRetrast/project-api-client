import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify';
import { authRestController } from '../controllers/rest.controller';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { authDecorator } from './auth.decorator';
import { authMiddleware } from '../hooks/authMiddleware.hook';
import { validateRegistrationKey } from '../hooks/validateRegistrationKey.hook';
import {
  SignInBody,
  SignInResponse,
  signInSchema,
  SignUpQuery,
  SignUpBody,
  SignUpResponse,
  signUpSchema,
  signOutSchema,
  RenewTokensResponse,
  ValidateRegistrationLinkQuery,
  ValidateRegistrationLinkResponse,
  validateRegistrationLinkSchema,
  CreateRegistrationLinkResponse,
  createRegistrationLinkSchema,
} from 'shared/dist/src/models/auth';

export function routes(fastify: FastifyInstance, options: FastifyPluginOptions, done: (err?: Error) => void): void {
  fastify.register(authDecorator);

  fastify.withTypeProvider<ZodTypeProvider>().post<{
    Body: SignInBody;
    Reply: SignInResponse;
  }>('/sign-in', { schema: signInSchema }, (request: FastifyRequest<{ Body: SignInBody }>, reply: FastifyReply<{ Reply: SignInResponse }>) => authRestController.signIn(request, reply));

  fastify.withTypeProvider<ZodTypeProvider>().post<{
    Querystring: SignUpQuery;
    Body: SignUpBody;
    Reply: SignUpResponse;
  }>('/sign-up', { preHandler: validateRegistrationKey, schema: signUpSchema }, (request: FastifyRequest<{ Querystring: SignUpQuery; Body: SignUpBody }>, reply: FastifyReply<{ Reply: SignUpResponse }>) => authRestController.signUp(request, reply));

  fastify
    .withTypeProvider<ZodTypeProvider>()
    .delete(
      '/sign-out',
      { preHandler: authMiddleware, schema: signOutSchema },
      (request: FastifyRequest, reply: FastifyReply) => authRestController.signOut(request, reply)
    );

  fastify.withTypeProvider<ZodTypeProvider>().get<{
    Reply: RenewTokensResponse;
  }>('/renew-tokens', (request: FastifyRequest, reply: FastifyReply<{ Reply: RenewTokensResponse }>) => authRestController.renewTokens(request, reply));

  fastify.withTypeProvider<ZodTypeProvider>().get<{
    Querystring: ValidateRegistrationLinkQuery;
    Reply: ValidateRegistrationLinkResponse;
  }>('/registration-link', { preHandler: validateRegistrationKey, schema: validateRegistrationLinkSchema }, (request: FastifyRequest<{ Querystring: ValidateRegistrationLinkQuery }>, reply: FastifyReply<{ Reply: ValidateRegistrationLinkResponse }>) => authRestController.validateRegistrationLink(request, reply));

  fastify.withTypeProvider<ZodTypeProvider>().post<{
    Reply: CreateRegistrationLinkResponse;
  }>('/registration-link', { preHandler: authMiddleware, schema: createRegistrationLinkSchema }, (request: FastifyRequest, reply: FastifyReply<{ Reply: CreateRegistrationLinkResponse }>) => authRestController.createRegistrationLink(request, reply));

  done();
}
