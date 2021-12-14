import { Container } from 'inversify';
import { ITradeController } from '../controllers/tradeController';
import TYPES from '../constants/types';
import { FastifyInstance, FastifyServerOptions } from 'fastify';

export default async function trades(server: FastifyInstance, opts: FastifyServerOptions) {
  server.route({
    method: 'DELETE',
    url: '/erase',
    schema: {
      response: {
        200: {},
        500: {},
      },
    },
    handler: async (request, reply) => {
      server.log.info('new erase request was sent.');
      const container = server['container'] as Container;
      const tradeController = container.get<ITradeController>(TYPES.ITradeController);
      const httpResult = await tradeController.eraseAll();
      reply.status(httpResult.statusCode);
      return {};
    },
  });
}
