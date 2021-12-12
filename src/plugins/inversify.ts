import { FastifyInstance, FastifyServerOptions } from 'fastify';
import fp from 'fastify-plugin';
import { Container } from 'inversify';
import TradeController, { ITradeController } from './../controllers/tradeController';
import TYPE_IDENTIFIER from './../constants/typeIdentifier';
import TradeService, { ITradeService } from '../services/tradeService';

async function inversifyPlugin(
  server: FastifyInstance,
  opts: FastifyServerOptions,
  next: (err?: Error) => void
) {
  const container = new Container({ defaultScope: 'Singleton' });

  container.bind<ITradeController>(TYPE_IDENTIFIER.ITradeController).to(TradeController);
  container.bind<ITradeService>(TYPE_IDENTIFIER.ITradeService).to(TradeService);

  server.decorate('container', container);

  next();
}

export default fp(inversifyPlugin, {
  name: 'inversifyPlugin',
});
