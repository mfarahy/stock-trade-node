import { FastifyInstance, RouteShorthandOptions } from 'fastify';
import { FastifyRouteSchemaDef } from 'fastify/types/schema';
import Joi, { ObjectSchema } from 'joi';
import { TradeJoiSchema, TradeJsonSchema } from 'src/validations/trade';
import TradeRepository from 'src/repositories/mongodb/tradeRepository';
import Trade from 'src/models/trade';

export async function trades(server: FastifyInstance, opts: RouteShorthandOptions) {
  server.route({
    method: 'POST',
    url: '/',
    schema: {
      body: Joi.object().keys(TradeJoiSchema).required(),
      response: {
        200: TradeJsonSchema,
      },
    },
    validatorCompiler: (schemaDef: FastifyRouteSchemaDef<ObjectSchema<any>>) => {
      return (data) => schemaDef.schema.validate(data);
    },
    handler: async (request, reply) => {
      var repository = new TradeRepository('mongodb://localhost:27017/', {});
      repository.insert(request.body as Trade);
      return request.body;
    },
  });

  // fastify.post(
  //   '/trades',
  //   {
  //     schema: {
  //       body: Joi.object().keys(TradeJoiSchema).required(),
  //       response: {
  //         200: TradeJsonSchema,
  //       },
  //     },
  //     validatorCompiler: (schemaDef: FastifyRouteSchemaDef<ObjectSchema<any>>) => {
  //       return (data) => schemaDef.schema.validate(data);
  //     },
  //   },
  //   async (request, reply) => {
  //     var repository = new TradeRepository('mongodb://localhost:27017/', {});
  //     repository.insert(request.body as Trade);
  //     return request.body;
  //   }
  // );
}
