import 'reflect-metadata';
import Env from 'fastify-env';
import S from 'fluent-json-schema';
import { C } from './constants/const';
import fastify from 'fastify';
import { app } from './app';

const server = fastify();

process.on('uncaughtException', function (err) {
  console.log('UncaughtException processing: %s', err);
});

const configSchema = S.object()
  .prop(C.MONGODB_CONNECTION_STRING, S.string().required())
  .prop(C.PORT, S.number().required())
  .prop(C.HOST, S.string())
  .prop(C.LOG_LEVEL, S.string().required())
  .prop(C.NODE_ENV, S.string().enum(['development', 'production']).required())
  .prop(C.APP_NAME, S.string().required())
  .prop(C.LOG_NAMESPACES, S.string())
  .prop(C.NO_LOGS, S.boolean());

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
    const port = process.env.PORT ?? 3000;
    server.listen(port, () => {
      console.log('server is starting on ', port);
    });
  });

server.register(app);
