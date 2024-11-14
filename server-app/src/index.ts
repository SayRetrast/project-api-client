import 'dotenv/config';
import { fastify, FastifyInstance } from 'fastify';
import { authRoutes } from './modules/auth';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { fastifyCookie } from '@fastify/cookie';
import cors from '@fastify/cors';

const server: FastifyInstance = fastify();

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

server.register(cors, { origin: process.env.FRONTEND_BASE_URL });
server.register(fastifyCookie);
server.register(authRoutes, { prefix: '/api/auth' });

server.listen({ port: Number(process.env.PORT) }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
