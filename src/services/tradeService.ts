import { inject, injectable } from 'inversify';
import Result, { OperationResult, QueryResult, ValueResult } from '../models/result';
import Trade from '../models/trade';
import { ILoggerFactory } from '../logging/interfaces';
import TYPES from './../constants/types';
import { TradeJoiSchema } from './../validations/trade';
import ITradeRepository from '../repositories/tradeRepository';
import ServiceBase, { IServiceBase } from './serviceBase';
import { IUserService } from './userService';
import { ERROR_CODES } from '../constants/const';
import SymbolRange from '../models/symbolRange';
import StockSymbol from './../models/stockSymbol';
import { Fluctuation, FluctuationElement, ZeroFluctuation } from '../models/fluctuation';
import { IStockSymbolService } from './stockSymbolService';

export interface ITradeService extends IServiceBase<Trade> {
  findByUserId(userId: number): Promise<QueryResult<Trade>>;
  findRange(symbol: string, start: Date, end: Date): Promise<ValueResult<SymbolRange>>;
  getAll(): Promise<QueryResult<Trade>>;
  getStats(start: Date, end: Date): Promise<QueryResult<FluctuationElement>>;
}

@injectable()
export default class TradeService
  extends ServiceBase<Trade, ITradeRepository>
  implements ITradeService
{
  constructor(
    @inject(TYPES.IUserService) private readonly userService: IUserService,
    @inject(TYPES.IStockSymbolService) private readonly symbolService: IStockSymbolService,
    @inject(TYPES.ITradeRepository) repository: ITradeRepository,
    @inject(TYPES.ILoggerFactory) loggerFactory: ILoggerFactory
  ) {
    super(repository, TradeJoiSchema, Trade, loggerFactory);
  }

  public async getStats(start: Date, end: Date): Promise<QueryResult<FluctuationElement>> {
    const process_start_time = Date.now();

    const symbols_result = await this.symbolService.getAll({ id: 1 });
    if (!symbols_result.isSuccess)
      return Result.failedQuery(symbols_result.message, symbols_result.errorCode);

    var data: Partial<Trade>[];

    try {
      data = await this.repository.find(
        { timestamp: { $gte: start, $lt: end.setDate(end.getDate() + 1) } },
        { id: 1, price: 1, symbol: 1 },
        { id: 1 },
        0,
        0
      );
    } catch (error: any) {
      const message =
        error.message ?? 'an exception has been occurred while getting trades from repository';
      this.logger.error(message, error);
      return Result.failedQuery(message, ERROR_CODES.UNKNOWN);
    }
    const symbols = symbols_result.value!;
    const result: FluctuationElement[] = [];
    for (let i = 0; i < symbols.length; ++i) {
      const trades = data.filter((x) => x.symbol == symbols[i].id);
      if (trades.length == 0)
        result.push(
          new ZeroFluctuation(symbols[i].id, 'There are no trades in the given date range')
        );
      else {
        var fluctuations = 0;
        var trend = 'SIDEWAY';
        var max = 0,
          min = 0;
        for (var j = 1; j < trades.length; ++j) {
          var diff = trades[j].price! - trades[j - 1].price!;
          if (diff < min) min = diff;
          if (diff > max) max = diff;
          if (diff > 0 && trend !== 'UP') {
            if (trend === 'DOWN') fluctuations++;
            trend = 'UP';
          } else if (diff < 0 && trend !== 'DOWN') {
            if (trend === 'UP') fluctuations++;
            trend = 'DOWN';
          }
        }
        result.push(
          new Fluctuation({
            max_fall: Math.round(Math.abs(min) * 100) / 100,
            max_rise: Math.round(max * 100) / 100,
            fluctuations: trades.length < 3 ? 0 : fluctuations,
            symbol: symbols[i].id,
          })
        );
      }
    }

    return Result.query(result, Date.now() - process_start_time);
  }

  public async getAll(): Promise<QueryResult<Trade>> {
    this.logger.debug('getAll has been called');

    return await super.getAll({ id: 1 });
  }

  public async add(trade: Trade): Promise<ValueResult<Trade>> {
    this.logger.debug('add method has been called', trade);

    // this process for extracting user and symbol is only for development process
    // because in a real application we provide data for symbols and users in a
    // different way but now we need some data.
    if (process.env.NODE_ENV !== 'production') {
      const user_result = await this.extract_user(trade);
      if (!user_result.isSuccess)
        return Result.error_value(user_result.message, user_result.errorCode);

      const insert_symbol_result = await this.extract_symbol(trade);
      if (!insert_symbol_result.isSuccess)
        return Result.error_value(insert_symbol_result.message, insert_symbol_result.errorCode);
    }

    return super.add(trade);
  }

  private async extract_user(trade: Trade): Promise<OperationResult> {
    if (trade.user) {
      const upsert_result = await this.userService.addOrUpdate({ id: trade.user.id }, trade.user);
      if (!upsert_result.isSuccess) {
        return Result.error(upsert_result.message, upsert_result.errorCode);
      }
    }
    return Result.ok();
  }

  private async extract_symbol(trade: Trade): Promise<OperationResult> {
    const symbol = new StockSymbol({
      id: trade.symbol.toUpperCase(),
      name: trade.symbol,
    });
    const upsert_result = await this.symbolService.addOrUpdate({ id: symbol.id }, symbol);
    if (!upsert_result.isSuccess) {
      return Result.error(upsert_result.message, upsert_result.errorCode);
    }
    return Result.ok();
  }

  public async findByUserId(userId: number): Promise<QueryResult<Trade>> {
    this.logger.debug('findByUserId has been called', { userId });

    var exists_result = await this.userService.exists({ id: userId });
    if (!exists_result.isSuccess) {
      return Result.failedQuery(exists_result.message, exists_result.errorCode);
    }

    if (!exists_result.value) {
      return Result.failedQuery('The user does not exist.', ERROR_CODES.USER_NOT_FOUND);
    }

    try {
      return await super.find({ 'user.id': { $eq: userId } }, { Id: 1 }, 0, 0);
    } catch (error: any) {
      return Result.failedQuery(error.message, ERROR_CODES.UNKNOWN);
    }
  }

  public async findRange(
    symbol: string,
    start: Date,
    end: Date
  ): Promise<ValueResult<SymbolRange>> {
    this.logger.debug('findRage has been called', { symbol, start, end });

    const check_result = await this.symbolService.exists({ id: symbol.toUpperCase() });

    if (check_result.isSuccess && !check_result.value) {
      const message = `symbol ${symbol} not exists in the system.`;
      this.logger.info(message);
      return Result.error_value(message, ERROR_CODES.SYMBOL_NOT_FOUND);
    }

    if (!check_result.isSuccess) {
      return Result.error_value(check_result.message, check_result.errorCode);
    }

    try {
      const result = await this.repository.findRange(symbol, start, end);
      if (result) return Result.value(result);
      else
        return Result.error_value(
          'There are no trades in the given date range',
          ERROR_CODES.NO_DATA
        );
    } catch (error: any) {
      this.logger.error(
        error.message ??
          'an exception has been occurred while getting symbole range from repository',
        error
      );
      return new ValueResult<SymbolRange>(
        new SymbolRange(),
        false,
        error.message,
        ERROR_CODES.UNKNOWN
      );
    }
  }
}
