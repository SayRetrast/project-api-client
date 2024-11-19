import { FastifyReply, FastifyRequest } from 'fastify';
import { InternalServerError, NotFoundError, UnauthorizedError } from '../../../core/errors/httpErrors';
import { authRepository } from '../providers/auth.repository';
import { ValidateRegistrationLinkQuery } from '../../../../../shared/src/models/auth';

export async function validateRegistrationKey(
  request: FastifyRequest<{ Querystring: ValidateRegistrationLinkQuery }>,
  reply: FastifyReply,
  done: (err?: Error) => void
) {
  const registrationKey = request.query['registration-key'];

  const expirationDate = await authRepository.getRegistrationKeyExpirationDate({ registrationKey }).catch((error) => {
    console.error(error);
    throw new InternalServerError('Failed to get registration key expiration date');
  });

  if (!expirationDate) {
    console.error('Registration key not found');
    throw new NotFoundError('Wrong registration key');
  }

  if (expirationDate < new Date()) {
    console.error('Registration key expired');
    throw new UnauthorizedError('Registration key expired');
  }

  done();
}
