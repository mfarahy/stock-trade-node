import 'reflect-metadata';
import Env from 'fastify-env';
import S from 'fluent-json-schema';
import { C } from './constants/const';
import fastify from 'fastify';
import setup from './setup';
import fs from 'fs';
import { join } from 'path';

export const app = async (): Promise<{}> => {
  return new Promise<{}>((resolve: (value: {}) => void, reject: (reason?: any) => void) => {
    const server = fastify();

    process.on('uncaughtException', function (err) {
      console.log('UncaughtException processing: %s', err);
    });

    const configSchema = S.object()
      .prop(C.MONGODB_CONNECTION_STRING, S.string().required())
      .prop(C.PORT, S.number().required())
      .prop(C.HOST, S.string())
      .prop(C.LOG_LEVEL, S.string().required())
      .prop(C.NODE_ENV, S.string().required())
      .prop(C.APP_NAME, S.string().required())
      .prop(C.LOG_NAMESPACES, S.string())
      .prop(C.NO_LOGS, S.boolean());

    const node_env = process.env.NODE_ENV;
    let path = join(__dirname, '.env.' + node_env?.toLocaleLowerCase().trimEnd());
    if (!fs.existsSync(path)) path = join(__dirname, '.env');

    server
      .register(Env, {
        dotenv: {
          path: path,
          debug: true,
        },
        confKey: 'config',
        schema: configSchema.valueOf(),
      })
      .ready((e) => {
        if (e) {
          console.error(e);
          reject(e);
          return;
        }
        const port = process.env.PORT ?? 3000;
        const host = process.env.HOST ?? '0.0.0.0';

        console.log(process.env);

        server.listen(port, host, () => {
          console.log(`Server start listening on ${host}:${port}...`);
          resolve({});
        });
      });

    server.register(setup);
  });
};
