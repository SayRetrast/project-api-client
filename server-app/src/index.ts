import fastify from 'fastify';
import 'dotenv/config';

const server = fastify();

const port = Number(process.env.PORT);

server.get('/ping', async () => {
  return 'pong\n';
});

server.listen({ port }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
