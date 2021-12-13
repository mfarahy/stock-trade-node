import { inject, injectable } from 'inversify';
import Result, { OperationResult, QueryResult, ValueResult } from '../models/result';
import Trade from '../models/trade';
import ITradeRepository from '../repositories/tradeRepository';
import { ILogger, ILoggerFactory } from '../logging/interfaces';
import TYPES from './../constants/types';
import { TradeJoiSchema } from './../validations/trade';
import Joi from 'joi';
import { ERROR_CODES } from '../constants/const';

export interface ITradeService {
  add(trade: Trade): Promise<ValueResult<Trade | undefined>>;
  eraseAll(): Promise<OperationResult>;
  getAll(): Promise<QueryResult<Partial<Trade>>>;
  findById(userId: number): Promise<ValueResult<Trade[]>>;
}

@injectable()
export default class TradeService implements ITradeService {
  private repository: ITradeRepository;
  private logger: ILogger;
  constructor(
    @inject(TYPES.ITradeRepository) repository: ITradeRepository,
    @inject(TYPES.ILoggerFactory) loggerFactory: ILoggerFactory
  ) {
    this.repository = repository;
    this.logger = loggerFactory.create(TradeService.name);
  }

  add = async (trade: Trade): Promise<ValueResult<Trade | undefined>> => {
    this.logger.debug('method add of trader service has been called.');

    const validationResult = Joi.object(TradeJoiSchema).validate(trade);
    if (validationResult.error) {
      this.logger.debug('validation failed while inserting for object trade', trade);
      return Result.fail<Trade>(validationResult.error);
    }

    try {
      const saved_result = await this.repository.insert(trade);
      return saved_result;
    } catch (error: any) {
      this.logger.error('an error occurred while inserting trade', error);
      return Result.fail<Trade>(<Error>error);
    }
  };

  // Erasing all the trades
  eraseAll = async (): Promise<OperationResult> => {
    try {
      await this.repository.eraseAll();
      return Result.ok();
    } catch (error: any) {
      return Result.exception(error);
    }
  };
  getAll = async (): Promise<QueryResult<Partial<Trade>>> => {
    this.logger.info('getAll method has been called.');
    try {
      const result = await this.repository.find({}, {}, { id: 1 }, 0, 0);

      this.logger.info(
        `repository found and return ${result.value.length} in ${result.elapsedTime / 1000}ms.`
      );

      return result;
    } catch (error: any) {
      return new QueryResult([], 0, false, error.message);
    }
  };
  findById = async (userId: number): Promise<ValueResult<Trade[]>> => {
    throw new Error('Method not implemented.');
  };
}
