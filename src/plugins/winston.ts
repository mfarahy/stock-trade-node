import { FastifyInstance, FastifyServerOptions } from 'fastify';
import { C } from '../constants/const';
import makeWinston from './../logging/initWinston';

export default async (server: FastifyInstance, opts: FastifyServerOptions) => {
  const app_name = server['config'][C.APP_NAME];
  server.decorate('logger', makeWinston(app_name));
};
