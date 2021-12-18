import Result, { OperationResult, QueryResult, ValueResult } from '../models/result';
import { ILogger, ILoggerFactory } from '../logging/interfaces';
import Joi from 'joi';
import { ERROR_CODES } from '../constants/const';
import DuplicationError from '../exceptions/duplicationError';
import IRepository from '../repositories/repository';
import { injectable, unmanaged } from 'inversify';

export interface IServiceBase<T> {
  add(entity: T): Promise<ValueResult<T>>;
  eraseAll(): Promise<OperationResult>;
  getAll(sortion: {}): Promise<QueryResult<T>>;
  validate(entity: T): ValueResult<string[]>;
  exists(filter: {}): Promise<ValueResult<boolean>>;
  addOrUpdate(filter: {}, entity: T): Promise<ValueResult<T>>;
  readonly repository: IRepository<T>;
}

interface IEntityCtor<T> {
  new (init: Partial<T> | undefined): T;
}

@injectable()
export default abstract class ServiceBase<T, R extends IRepository<T>> implements IServiceBase<T> {
  protected logger: ILogger;
  private schema: {};
  private entity_ctor: IEntityCtor<T>;
  constructor(
    public readonly repository: R,
    @unmanaged() joi_schema: {},
    @unmanaged() entity_ctor: IEntityCtor<T>,
    loggerFactory: ILoggerFactory
  ) {
    this.logger = loggerFactory.create(this.constructor.name);
    this.schema = joi_schema;
    this.entity_ctor = entity_ctor;
  }

  public validate(entity: T): ValueResult<string[]> {
    const { error } = Joi.object(this.schema).validate(entity);
    if (error)
      return new ValueResult(
        error.details.map((x) => x.message),
        false,
        'Validation failed'
      );
    else return Result.value([]);
  }

  public async addOrUpdate(filter: {}, entity: T): Promise<ValueResult<T>> {
    this.logger.debug('method addOrUpdate has been called.', filter);

    const validation_result = this.validate(entity);

    if (!validation_result.isSuccess) {
      const message =
        'validation failed for object because ' + validation_result?.value?.join(', ');
      this.logger.error(message);
      return new ValueResult(entity, false, message, ERROR_CODES.VALIDATION);
    }

    try {
      const saved_result = await this.repository.upsert(filter, entity);
      return Result.value(saved_result);
    } catch (error: any) {
      if (error && error.constructor.name == DuplicationError.name) {
        return new ValueResult(
          entity,
          false,
          'there is another item with same key.',
          ERROR_CODES.DUPLICATE_ENTRY
        );
      }
      return new ValueResult(entity, false, error.message, ERROR_CODES.UNKNOWN);
    }
  }

  public async add(entity: T): Promise<ValueResult<T>> {
    this.logger.debug('method addOrUpdate has been called.', entity);

    const validation_result = this.validate(entity);

    if (!validation_result.isSuccess) {
      const message =
        'validation failed for object because ' + validation_result?.value?.join(', ');
      this.logger.error(message);
      return new ValueResult(entity, false, message, ERROR_CODES.VALIDATION);
    }

    try {
      const saved_result = await this.repository.insert(entity);
      return Result.value(saved_result);
    } catch (error: any) {
      if (error && error.constructor.name == DuplicationError.name) {
        return new ValueResult(
          entity,
          false,
          'there is another item with same key.',
          ERROR_CODES.DUPLICATE_ENTRY
        );
      }
      return new ValueResult(entity, false, error.message, ERROR_CODES.UNKNOWN);
    }
  }

  // Erasing all the trades
  public async eraseAll(): Promise<OperationResult> {
    try {
      await this.repository.eraseAll();
      return Result.ok();
    } catch (error: any) {
      return Result.exception(error);
    }
  }

  public async getAll(sortion: {}): Promise<QueryResult<T>> {
    try {
      return await this.find({}, sortion, 0, 0);
    } catch (error: any) {
      return Result.failedQuery(error.message);
    }
  }

  protected async find(
    filter: {},
    sortion: {},
    limit: number,
    skip: number
  ): Promise<QueryResult<T>> {
    try {
      const start = Date.now();
      let rResult;
      try {
        rResult = await this.repository.find(filter, {}, sortion, limit, skip);
      } catch (error: any) {
        this.logger.error(error.message);
        return Result.failedQuery(error.message);
      }

      const result: T[] = [];
      for (let i = 0; i < rResult.length; ++i) {
        result.push(new this.entity_ctor(rResult[i]));
      }
      const elapsed_time = Date.now() - start;

      this.logger.info(
        `repository found and return ${rResult.length} in ${elapsed_time / 1000}ms.`
      );

      return Result.query(result, elapsed_time);
    } catch (error: any) {
      return Result.failedQuery(error.message);
    }
  }

  public async exists(filter: {}): Promise<ValueResult<boolean>> {
    this.logger.debug(`checking item exists or not`, filter);

    try {
      const check_result = await this.repository.find(filter, { _id: 1 }, {}, 1, 0);

      return Result.value(check_result.length == 1);
    } catch (error: any) {
      const message =
        error.message ?? 'an exception has been occurred while checking item exists or not';
      this.logger.error(message, error);

      return new ValueResult(false, false, message, ERROR_CODES.UNKNOWN);
    }
  }
}
