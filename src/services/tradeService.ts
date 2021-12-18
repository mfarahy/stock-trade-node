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
import { FluctuationElement } from '../models/fluctuation';
import { IStockSymbolService } from './stockSymbolService';
import DuplicationError from '../exceptions/duplicationError';

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
  getStats(start: Date, end: Date): Promise<QueryResult<FluctuationElement>> {
    throw new Error('Method not implemented.');
  }

  public async getAll(): Promise<QueryResult<Trade>> {
    this.logger.debug('getAll has been called');

    return await super.getAll({ id: 1 });
  }

  public async add(trade: Trade): Promise<ValueResult<Trade>> {
    this.logger.debug('add method has been called', trade);

    const symbol_result = await this.symbolService.findByName(trade.symbol);

    if (!symbol_result.isSuccess)
      return Result.error_value(symbol_result.message, symbol_result.errorCode);

    // this process for extracting user and symbol is only for development process
    // because in a real application we provide data for symbols and users in a
    // different way but now we need some data.
    if (process.env.NODE_ENV !== 'production') {
      const user_result = await this.extract_user(trade);
      if (!user_result.isSuccess)
        return Result.error_value(user_result.message, user_result.errorCode);

      if (!symbol_result.value) {
        const insert_symbol_result = await this.extract_symbol(trade);
        if (!insert_symbol_result.isSuccess)
          return Result.error_value(insert_symbol_result.message, insert_symbol_result.errorCode);
      }
    }

    if (symbol_result.value) {
      const symbol = symbol_result.value;

      const validation_result = this.validate(trade);

      if (!validation_result.isSuccess) {
        const message =
          'validation failed for object because ' + validation_result?.value?.join(', ');
        this.logger.error(message);
        return new ValueResult(trade, false, message, ERROR_CODES.VALIDATION);
      }
      const transaction = await this.repository.beginTransaction();
      try {
        trade.price_difference = trade.price - symbol_result.value.lastPrice;
        if (symbol.lastPrice > trade.price) trade.price_direction = 'D';
        else if (symbol.lastPrice < trade.price) trade.price_direction = 'U';
        else trade.price_direction = 'N';

        await this.repository.insert(trade, transaction);

        symbol.lastPrice = trade.price;
        symbol.lastTrade = trade.timestamp;

        await this.symbolService.repository.update(
          { id: trade.symbol.toUpperCase() },
          symbol,
          transaction
        );

        await this.repository.commitTransaction(transaction);
        return Result.value(trade);
      } catch (error: any) {
        this.logger.error(
          error.message ?? 'an exception has been occurred while add a trade',
          error
        );

        await this.repository.abortTransaction(transaction);
        if (error && error.constructor.name == DuplicationError.name) {
          return new ValueResult(
            trade,
            false,
            'there is another item with same key.',
            ERROR_CODES.DUPLICATE_ENTRY
          );
        }
        return new ValueResult(trade, false, error.message, ERROR_CODES.UNKNOWN);
      } finally {
        await this.repository.endTransaction(transaction);
      }
    } else {
      return super.add(trade);
    }
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
      lastPrice: trade.price,
      lastTrade: trade.timestamp,
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
