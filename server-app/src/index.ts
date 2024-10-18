import { fastify, FastifyInstance } from 'fastify';
import 'dotenv/config';
import { authRouter } from './modules/auth';

const server: FastifyInstance = fastify();

const port = Number(process.env.PORT);

server.register(authRouter.routes, { prefix: '/api/auth' });

server.listen({ port }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
