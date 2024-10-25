import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { IUser } from '../../../core/interfaces/user.interface';

declare module 'fastify' {
  interface FastifyRequest {
    user: IUser | null;
  }
}

export function authDecorator(
  fastify: FastifyInstance,
  options: FastifyPluginOptions,
  done: (err?: Error) => void
): void {
  fastify.decorateRequest('user', null);

  done();
}
