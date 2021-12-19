import Path from 'path';
import fastifyStatic from 'fastify-static';
import Cors from 'fastify-cors';
import Autoload from 'fastify-autoload';
import Sensible from 'fastify-sensible';

export default async function (server, opts) {
  server.register(Cors, {
    origin: false,
  });
  server.register(fastifyStatic, {
    root: Path.join(__dirname, 'public'),
    prefix: '/public/', // optional: default '/'
  });
  server.register(Autoload, {
    dir: Path.join(__dirname, 'plugins'),
  });

  server.register(Autoload, {
    dir: Path.join(__dirname, 'routes'),
    dirNameRoutePrefix: false,
    routeParams: true,
  });
  server.register(Sensible);
}
