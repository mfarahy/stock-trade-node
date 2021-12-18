import IRepository from './repository';
import StockSymbol from '../models/stockSymbol';

export default interface IStockSymbolRepository extends IRepository<StockSymbol> {}
