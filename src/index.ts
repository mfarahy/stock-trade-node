import 'reflect-metadata';
import Env from 'fastify-env';
import S from 'fluent-json-schema';
import { C } from './constants/const';
import fastify from 'fastify';
import { App } from './app';
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});
if (process.env.NODE_ENV == 'development') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

logger.info('Application has been started.');

const server = fastify();

server.register(App);

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

    const port = process.env.PORT ?? 3000;
    server.listen(port, () => {
      console.log('server is starting on {0}', port);
    });
  });
