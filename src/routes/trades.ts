import { FastifyRouteSchemaDef } from 'fastify/types/schema';
import Joi, { ObjectSchema } from 'joi';
import { TradeJoiSchema, TradeJsonSchema } from '../validations/trade';
import { Container } from 'inversify';
import { ITradeController } from './../controllers/tradeController';
import TYPES from '../constants/types';
import Trade from '../models/trade';
import { FastifyInstance, FastifyServerOptions } from 'fastify';
import S from 'fluent-json-schema';
import _ from 'lodash';

export default async function trades(server: FastifyInstance, opts: FastifyServerOptions) {
  server.route({
    method: 'GET',
    url: '/trades/users/:userId',
    schema: {
      response: {
        200: {
          type: 'array',
          items: { ..._.omit(TradeJsonSchema, ['required', 'additionalProperties']) },
        },
      },
    },
    handler: async (request, reply) => {
      const params = <{ userId: number }>request.params;
      const container = server['container'] as Container;
      const tradeController = container.get<ITradeController>(TYPES.ITradeController);
      const result = await tradeController.findByUserId(params.userId);
      reply.status(result.statusCode);
      return result.value;
    },
  });

  server.route({
    method: 'POST',
    url: '/trades',
    schema: {
      body: Joi.object().keys(TradeJoiSchema).required(),
      response: {
        201: {},
        400: {},
      },
    },
    validatorCompiler: (schemaDef: FastifyRouteSchemaDef<ObjectSchema<any>>) => {
      return (data) => schemaDef.schema.validate(data);
    },
    handler: async (request, reply) => {
      const container = server['container'] as Container;
      const tradeController = container.get<ITradeController>(TYPES.ITradeController);
      const httpResult = await tradeController.add(new Trade(<Partial<Trade>>request.body));
      reply.status(httpResult.statusCode);
      return '';
    },
  });

  server.route({
    method: 'GET',
    url: '/trades',
    schema: {
      response: {
        200: {
          type: 'array',
          items: { ..._.omit(TradeJsonSchema, ['required', 'additionalProperties']) },
        },
      },
    },
    handler: async (request, reply) => {
      server.log.info('get trades is called');
      const container = server['container'] as Container;
      const tradeController = container.get<ITradeController>(TYPES.ITradeController);
      const result = await tradeController.getAll(<Trade>request.body);
      reply.status(result.statusCode);
      return result.value;
    },
  });
}
