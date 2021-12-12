import Path, { join } from 'path';
import fastifyStatic from 'fastify-static';
import Cors from 'fastify-cors';
import Autoload from 'fastify-autoload';
import Sensible from 'fastify-sensible';
import Env from 'fastify-env';
import S from 'fluent-json-schema';
import { C } from './const';

export async function App(server, opts) {
  const configSchema = S.object()
    .prop(C.MONGODB_CONNECTION_STRING, S.string().required())
    .prop(C.PORT, S.number().required())
    .prop(C.HOST, S.string())
    .prop(C.LOG_LEVEL, S.string().required())
    .prop(C.NODE_ENV, S.string().enum(['development', 'production']).required());
  server
    .register(Env, {
      dotenv: {
        path: `${__dirname}/.env`,
        debug: true,
      },
      confKey: 'config',
      schema: configSchema.valueOf(),
    })
    .ready((e) => {
      if (e) {
        console.error(e);
        return;
      }

      server.register(App);

      const config = server['config'];
      server.listen(config[C.PORT] ?? 3002, config[C.HOST], () => {
        console.log('server is starting on {0}', config[C.PORT]);
      });
    });

  server.register(Cors, {
    origin: false,
  });

  server.register(fastifyStatic, {
    root: Path.join(__dirname, 'public'),
    prefix: '/public/', // optional: default '/'
  });

  server.register(Autoload, {
    dir: join(__dirname, 'plugins'),
  });

  console.log(join(__dirname, 'routes'));

  server.register(Autoload, {
    dir: join(__dirname, 'routes'),
    dirNameRoutePrefix: false,
    routeParams: true,
  });

  server.register(Sensible);
}
