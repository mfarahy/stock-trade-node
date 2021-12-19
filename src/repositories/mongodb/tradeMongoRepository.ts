import { inject, injectable } from 'inversify';
import TYPES from '../../constants/types';
import Trade from '../../models/trade';
import { ILoggerFactory } from '../../logging/interfaces';
import { TradeModel } from './schema/trade';
import MongoRepository from './mongoRepository';
import ITradeRepository from '../tradeRepository';
import SymbolRange from '../../models/symbolRange';

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
    super(db_uri, options, TradeModel, loggerFactory.create(TradeMongoRepository.name));
  }

  public async find(
    filter: {},
    projection: {},
    sortion: {},
    limit: number,
    skip: number,
    transaction?: any
  ): Promise<Partial<Trade>[]> {
    var result = await super.find(filter, projection, sortion, limit, skip, transaction);

    if (result.length > 0 && result[0].timestamp) {
      for (let i = 0; i < result.length; ++i) {
        result[i].timestamp = this.convertUTCDateToLocalDate(result[i].timestamp);
      }
    }

    return result;
  }

  private convertUTCDateToLocalDate(date) {
    var newDate = new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
    return newDate;
  }

  public async findRange(
    symbol: string,
    start: Date,
    end: Date,
    transaction?: any
  ): Promise<SymbolRange | undefined> {
    this.logger.debug('findRage has been called', { symbol, start, end });

    await this.connect(transaction);

    const result = await TradeModel.aggregate(
      [
        {
          $match: {
            symbol: symbol,
            timestamp: { $gte: start, $lte: end },
          },
        },
        {
          $group: {
            _id: {},
            lowest: { $min: '$price' },
            highest: { $max: '$price' },
          },
        },
      ],
      { session: transaction }
    ).exec();
    if (result.length == 0) return undefined;
    const range = new SymbolRange(result[0]);
    range.symbol = symbol;
    return range;
  }
}
