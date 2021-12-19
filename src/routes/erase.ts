import { Container } from 'inversify';
import { ITradeController } from '../controllers/tradeController';
import TYPES from '../constants/types';
import { FastifyInstance, FastifyServerOptions } from 'fastify';
import { IEraseController } from './../controllers/eraseController';

export default async function trades(server: FastifyInstance, opts: FastifyServerOptions) {
  server.route({
    method: 'DELETE',
    url: '/erase',
    schema: {
      response: {
        200: {},
      },
    },
    handler: async (request, reply) => {
      const container = server['container'] as Container;
      const eraseController = container.get<IEraseController>(TYPES.IEraseController);
      const httpResult = await eraseController.erase();
      reply.status(httpResult.statusCode);
      return {};
    },
  });
}
