import IRepository from './repository';
import Trade from '../models/trade';
import SymbolRange from '../models/symbolRange';

export default interface ITradeRepository extends IRepository<Trade> {
  findRange(
    symbol: string,
    start: Date,
    end: Date,
    transaction?: any
  ): Promise<SymbolRange | undefined>;
}
