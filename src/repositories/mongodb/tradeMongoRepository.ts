import { inject, injectable } from 'inversify';
import TYPES from '../../constants/types';
import Trade from '../../models/trade';
import { ILoggerFactory } from '../../logging/interfaces';
import { TradeModel } from './schema/trade';
import MongoRepository from './mongoRepository';
import ITradeRepository from '../tradeRepository';

@injectable()
export default class TradeMongoRepository
  extends MongoRepository<Trade>
  implements ITradeRepository
{
  constructor(
    @inject(TYPES.ConnectionString) db_uri: string,
    @inject(TYPES.ConnectionOptions) options: {},
    @inject(TYPES.ILoggerFactory) loggerFactory: ILoggerFactory
  ) {
    super(db_uri, options, TradeModel, loggerFactory);
  }

  public find = async (
    filter: {},
    projection: {},
    sortion: {},
    limit: number,
    skip: number
  ): Promise<Partial<Trade>[]> => {
    var result = await super.find(filter, projection, sortion, limit, skip);

    for (let i = 0; i < result.length; ++i) {
      result[i].timestamp = this.convertUTCDateToLocalDate(result[i].timestamp);
    }

    return result;
  };

  private convertUTCDateToLocalDate = (date) => {
    var newDate = new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
    return newDate;
  };
}
