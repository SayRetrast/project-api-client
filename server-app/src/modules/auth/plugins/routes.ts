import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { signUpSchema } from '../models/schemas/signUp.schema';
import { authRestController } from '../controllers/rest.controller';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { signInSchema } from '../models/schemas/signIn.schema';

export function routes(fastify: FastifyInstance, options: FastifyPluginOptions, done: (err?: Error) => void): void {
  fastify.withTypeProvider<ZodTypeProvider>().post('/sign-in', { schema: signInSchema }, authRestController.signIn);
  fastify.withTypeProvider<ZodTypeProvider>().post('/sign-up', { schema: signUpSchema }, authRestController.signUp);

  fastify.delete('/sign-out', authRestController.signOut);

  done();
}
