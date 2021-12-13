import { FastifyInstance, FastifyServerOptions } from 'fastify';
import fp from 'fastify-plugin';
import { Container, interfaces } from 'inversify';
import TradeController, { ITradeController } from './../controllers/tradeController';
import TYPES from '../constants/types';
import TradeService, { ITradeService } from '../services/tradeService';
import TradeMongoRepository from '../repositories/mongodb/tradeMongoRepository';
import { ILoggerFactory } from '../logging/interfaces';
import ITradeRepository from '../repositories/tradeRepository';
import { C } from '../constants/const';
import { WinstonLoggerFactory } from '../logging/winstonLoggerFactory';
import winston from 'winston';

async function inversifyPlugin(
  server: FastifyInstance,
  opts: FastifyServerOptions,
  next: (err?: Error) => void
) {
  const container = new Container({ defaultScope: 'Singleton' });

  container.bind<ITradeController>(TYPES.ITradeController).to(TradeController);
  container.bind<ITradeService>(TYPES.ITradeService).to(TradeService);

  container
    .bind<ITradeRepository>(TYPES.ITradeRepository)
    .toDynamicValue((context: interfaces.Context) => {
      const cs = server['config'][C.MONGODB_CONNECTION_STRING];
      return new TradeMongoRepository(
        cs,
        {},
        context.container.get<ILoggerFactory>(TYPES.ILoggerFactory)
      );
    });

  container
    .bind<ILoggerFactory>(TYPES.ILoggerFactory)
    .toDynamicValue((context: interfaces.Context) => {
      var logger = winston.loggers.get('default');
      return new WinstonLoggerFactory(logger);
    });

  server.decorate('container', container);

  next();
}

export default fp(inversifyPlugin, {
  name: 'inversifyPlugin',
});
