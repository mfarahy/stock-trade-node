import { inject, injectable } from 'inversify';
import mongoose from 'mongoose';
import TYPES from '../../constants/types';
import Trade from '../../models/trade';
import { ILogger, ILoggerFactory } from '../../logging/interfaces';
import ITradeRepository from '../tradeRepository';
import { TradeModel } from './schema/trade';
import Result, { ValueResult } from '../../models/result';
import { ERROR_CODES } from '../../constants/const';
import { QueryResult } from './../../models/result';

@injectable()
export default class TradeMongoRepository implements ITradeRepository {
  private db_uri: string;
  private db_opts: Object;
  private logger: ILogger;
  constructor(
    db_uri: string,
    options: {},
    @inject(TYPES.ILoggerFactory) loggerFactory: ILoggerFactory
  ) {
    this.db_uri = db_uri;
    this.db_opts = options;
    this.logger = loggerFactory.create(TradeMongoRepository.name);
  }

  private connect = async (): Promise<void> => {
    await mongoose.connect(this.db_uri, this.db_opts);
  };

  public eraseAll = async (): Promise<void> => {
    await this.connect();

    await TradeModel.deleteMany({});
  };

  public insert = async (trade: Trade): Promise<ValueResult<Trade | undefined>> => {
    this.logger.debug('the method insert has been called.');

    await this.connect();

    var tradeDoc = new TradeModel(trade);
    try {
      const saved_trade = await tradeDoc.save();
      return Result.value(saved_trade);
    } catch (error: any) {
      this.logger.error(error.message ?? 'an exception while occurred while inserting data', error);

      if (error.message.indexOf('duplicate key error collection') >= 0)
        return Result.fail<Trade>(error, ERROR_CODES.DUPLICATE_ENTRY);
      else return Result.fail<Trade>(error);
    }
  };

  public find = async (
    filter: {},
    projection: {},
    sortion: {},
    limit: number,
    skip: number
  ): Promise<QueryResult<Partial<Trade>>> => {
    const start: number = Date.now();
    await this.connect();

    const result = await TradeModel.find(filter)
      .sort(sortion)
      .select(projection)
      .skip(skip)
      .limit(limit);

    return Result.query<Partial<Trade>>(result, Date.now() - start);
  };
}
