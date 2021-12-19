import { inject, injectable } from 'inversify';
import TYPES from '../../constants/types';
import { ILoggerFactory } from '../../logging/interfaces';
import MongoRepository from './mongoRepository';
import IStockSymbolRepository from './../stockSymbolRepository';
import StockSymbol from './../../models/stockSymbol';
import { StockSymbolModel } from './schema/stockSymbol';

@injectable()
export default class StockSymbolMongoRepository
  extends MongoRepository<StockSymbol>
  implements IStockSymbolRepository
{
  constructor(
    @inject(TYPES.ConnectionString) db_uri: string,
    @inject(TYPES.ConnectionOptions) options: {},
    @inject(TYPES.ILoggerFactory) loggerFactory: ILoggerFactory
  ) {
    super(db_uri, options, StockSymbolModel, loggerFactory.create(StockSymbolMongoRepository.name));
  }
}
