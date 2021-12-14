import Path from 'path';
import fastifyStatic from 'fastify-static';
import Cors from 'fastify-cors';
import Autoload from 'fastify-autoload';
import Sensible from 'fastify-sensible';
import appRoot from 'app-root-path';

export default async function (server, opts) {
  server.register(Cors, {
    origin: false,
  });
  server.register(fastifyStatic, {
    root: Path.join(appRoot.path, 'public'),
    prefix: '/public/', // optional: default '/'
  });
  server.register(Autoload, {
    dir: Path.join(appRoot.path, 'src', 'plugins'),
  });

  server.register(Autoload, {
    dir: Path.join(appRoot.path, 'src', 'routes'),
    dirNameRoutePrefix: false,
    routeParams: true,
  });
  server.register(Sensible);
}
