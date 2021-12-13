import { QueryResult, ValueResult } from '../models/result';
import Trade from '../models/trade';

export default interface ITradeRepository {
  insert(trade: Trade): Promise<ValueResult<Trade | undefined>>;
  eraseAll(): Promise<void>;
  find(
    filter: {},
    projection: {},
    sortion: {},
    limit: number,
    skip: number
  ): Promise<QueryResult<Partial<Trade>>>;
}
