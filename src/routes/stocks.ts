import { Container } from 'inversify';
import { ITradeController } from '../controllers/tradeController';
import TYPES from '../constants/types';
import { FastifyInstance, FastifyServerOptions } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { IStockController } from '../controllers/stockController';

export default async function stock(server: FastifyInstance, opts: FastifyServerOptions) {
  server.route({
    method: 'GET',
    url: '/stocks/:stockSymbol/price/*',
    schema: {
      querystring: {
        type: 'object',
        properties: {
          start: { type: 'string', format: 'date' },
          end: { type: 'string', format: 'date' },
        },
        required: ['start', 'end'],
      },
      response: {
        200: {
          type: 'object',
          properties: {
            symbol: { type: 'string' },
            highest: { type: 'number' },
            lowest: { type: 'number' },
            message: { type: 'string' },
          },
        },
        404: {},
      },
    },
    handler: async (request, reply) => {
      const { start, end } = <{ start: string; end: string }>request.query;
      const { stockSymbol } = <{ stockSymbol: string }>request.params;

      const container = server['container'] as Container;
      const stockController = container.get<IStockController>(TYPES.IStockController);

      const result = await stockController.getPrice(stockSymbol, start, end);

      reply.status(result.statusCode);
      return result.value;
    },
  });

  server.route({
    method: 'GET',
    url: '/stocks/stats',
    schema: {
      querystring: {
        type: 'object',
        properties: {
          start: { type: 'string', format: 'date' },
          end: { type: 'string', format: 'date' },
        },
        required: ['start', 'end'],
      },
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              symbol: { type: 'string' },
              fluctuations: { type: 'number' },
              max_rise: { type: 'number' },
              max_fall: { type: 'number' },
              message: { type: 'string' },
            },
          },
        },
        404: {},
      },
    },
    handler: async (request, reply) => {
      const { start, end } = <{ start: string; end: string }>request.query;

      const container = server['container'] as Container;
      const stockController = container.get<IStockController>(TYPES.IStockController);

      const result = await stockController.getStats(start, end);

      reply.status(result.statusCode);
      return result.value;
    },
  });
}
