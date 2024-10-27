import { FastifyReply, FastifyRequest, RouteGenericInterface } from 'fastify';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { IUser } from '../../../core/interfaces/user.interface';
import { UnauthorizedError } from '../../../core/errors/httpErrors';

export function authMiddleware<RequestExtended extends RouteGenericInterface>(
  request: FastifyRequest<RequestExtended>,
  reply: FastifyReply,
  done: (err?: Error) => void
): void {
  const accessToken = getAccessToken(request);

  jwt.verify(accessToken, process.env.JWT_SECRET_KEY as string, (error) => {
    if (error) {
      throw new UnauthorizedError('Invalid access token');
    }

    const decodedJwt = jwt.decode(accessToken) as JwtPayload;
    const userData: IUser = {
      userId: decodedJwt.sub as string,
      username: decodedJwt.username as string,
    };

    request.user = userData;
  });

  done();
}

function getAccessToken(request: FastifyRequest): string {
  const [bearer, accessToken] = request.headers.authorization?.split(' ') ?? [];
  if (bearer !== 'Bearer') {
    throw new UnauthorizedError('Wrong token type');
  }

  if (!accessToken) {
    throw new UnauthorizedError('Missing access token');
  }

  return accessToken;
}
