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

export interface ITradeService extends IServiceBase<Trade> {
  findByUserId(userId: number): Promise<QueryResult<Trade>>;
}

@injectable()
export default class TradeService
  extends ServiceBase<Trade, ITradeRepository>
  implements ITradeService
{
  private userService: IUserService;
  constructor(
    @inject(TYPES.IUserService) userService: IUserService,
    @inject(TYPES.ITradeRepository) repository: ITradeRepository,
    @inject(TYPES.ILoggerFactory) loggerFactory: ILoggerFactory
  ) {
    super(repository, TradeJoiSchema, Trade, loggerFactory);
    this.userService = userService;
  }

  public async add(trade: Trade): Promise<ValueResult<Trade>> {
    if (trade.user) {
      this.logger.info('check the user exists or not.');
      var exists_result = await this.userService.exists({ id: trade.user.id });
      if (!exists_result.isSuccess) {
        return new ValueResult(trade, false, exists_result.message, exists_result.errorCode);
      }
      if (!exists_result.value) {
        this.logger.info('try add new user.');
        const add_result = await this.userService.add(trade.user);
        if (!add_result.isSuccess) {
          return new ValueResult(trade, false, add_result.message, add_result.errorCode);
        }
      } else {
        this.logger.info('user exists.');
      }
    }
    return super.add(trade);
  }

  public async findByUserId(userId: number): Promise<QueryResult<Trade>> {
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
}
