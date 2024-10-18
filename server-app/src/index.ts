import { fastify, FastifyInstance } from 'fastify';
import 'dotenv/config';
import { authRoutes } from './modules/auth';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';

const server: FastifyInstance = fastify();

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

server.register(authRoutes, { prefix: '/api/auth' });

server.listen({ port: Number(process.env.PORT) }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
