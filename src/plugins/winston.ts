import { FastifyInstance, FastifyServerOptions } from 'fastify';
import fp from 'fastify-plugin';
import { C } from '../constants/const';
import makeWinston from './../logging/initWinston';

const winston = async (
  server: FastifyInstance,
  opts: FastifyServerOptions,
  next: (err?: Error) => void
) => {
  const app_name = server['config'][C.APP_NAME];
  server.decorate('log', makeWinston(app_name));
  next();
};

export default fp(winston, {
  name: 'winston',
});
