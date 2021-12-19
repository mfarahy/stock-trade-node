import { FastifyInstance, FastifyServerOptions } from 'fastify';
import fp from 'fastify-plugin';
import { Container, ContainerModule, interfaces } from 'inversify';
import TradeController, { ITradeController } from './../controllers/tradeController';
import TYPES from '../constants/types';
import TradeService, { ITradeService } from '../services/tradeService';
import TradeMongoRepository from '../repositories/mongodb/tradeMongoRepository';
import { ILoggerFactory } from '../logging/interfaces';
import { C } from '../constants/const';
import { WinstonLoggerFactory } from '../logging/winstonLoggerFactory';
import winston, { Logger } from 'winston';
import ITradeRepository from '../repositories/tradeRepository';
import UserService, { IUserService } from './../services/userService';
import UserMongoRepository from './../repositories/mongodb/userMongoRepository';
import IUserRepository from './../repositories/userRepository';
import StockController, { IStockController } from './../controllers/stockController';
import StockSymbolService, { IStockSymbolService } from './../services/stockSymbolService';
import IStockSymbolRepository from './../repositories/stockSymbolRepository';
import StockSymbolMongoRepository from './../repositories/mongodb/stockSymbolMongoRepository';
import EraseController, { IEraseController } from './../controllers/eraseController';

async function inversifyPlugin(
  server: FastifyInstance,
  opts: FastifyServerOptions,
  next: (err?: Error) => void
) {
  const container = new Container({ defaultScope: 'Request' });

  const cs = server['config'][C.MONGODB_CONNECTION_STRING];
  var logger = winston.createLogger({
    level: server['config'][C.LOG_LEVEL],
    transports: [new winston.transports.Console({ format: winston.format.simple() })],
  });

  let module = new ContainerModule((bind: interfaces.Bind) => {
    bind<Logger>(TYPES.Logger).toConstantValue(logger);
    bind<ILoggerFactory>(TYPES.ILoggerFactory).to(WinstonLoggerFactory);

    bind<string>(TYPES.ConnectionString).toConstantValue(cs);
    bind<{}>(TYPES.ConnectionOptions).toConstantValue({});

    bind<ITradeController>(TYPES.ITradeController).to(TradeController);
    bind<ITradeService>(TYPES.ITradeService).to(TradeService);
    bind<ITradeRepository>(TYPES.ITradeRepository).to(TradeMongoRepository);

    bind<IUserService>(TYPES.IUserService).to(UserService);
    bind<IUserRepository>(TYPES.IUserRepository).to(UserMongoRepository);

    bind<IStockSymbolService>(TYPES.IStockSymbolService).to(StockSymbolService);
    bind<IStockSymbolRepository>(TYPES.IStockSymbolRepository).to(StockSymbolMongoRepository);

    bind<IStockController>(TYPES.IStockController).to(StockController);

    bind<IEraseController>(TYPES.IEraseController).to(EraseController);
  });

  container.load(module);

  server.decorate('container', container);

  next();
}

export default fp(inversifyPlugin, {
  name: 'inversifyPlugin',
});
