import { FastifyReply, FastifyRequest, RouteGenericInterface } from 'fastify';
import { UnauthorizedError } from '../../../core/errors/httpErrors';

export function authMiddleware<RequestExtended extends RouteGenericInterface>(
  request: FastifyRequest<RequestExtended>,
  reply: FastifyReply,
  done: (err?: Error) => void
): void {
  const accessToken = request.cookies['accessToken'];
  if (!accessToken) {
    throw new UnauthorizedError('Access token not found');
  }

  console.log(accessToken);

  done();
}
