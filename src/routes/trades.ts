import { FastifyRouteSchemaDef } from 'fastify/types/schema';
import Joi, { ObjectSchema } from 'joi';
import { TradeJoiSchema } from '../validations/trade';
import { Container } from 'inversify';
import { ITradeController } from './../controllers/tradeController';
import TYPE_IDENTIFIER from './../constants/typeIdentifier';
import Trade from '../models/trade';
import { FastifyInstance, FastifyServerOptions } from 'fastify';

export default async function trades(server: FastifyInstance, opts: FastifyServerOptions) {
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
      const tradeController = container.get<ITradeController>(TYPE_IDENTIFIER.ITradeController);
      const httpResult = await tradeController.add(<Trade>request.body);
      console.log('trade has been added');
      reply.status(httpResult.statusCode);
      return {};
    },
  });
}
