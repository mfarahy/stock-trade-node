import mongoose, { ClientSession, Model } from 'mongoose';
import { ILogger, ILoggerFactory } from '../../logging/interfaces';
import IRepository, { IModelCreator } from './../repository';
import DuplicationError from '../../exceptions/duplicationError';
import { injectable, unmanaged } from 'inversify';

@injectable()
export default abstract class MongoRepository<T> implements IRepository<T> {
  constructor(
    private readonly db_uri: string,
    private readonly db_opts: {},
    @unmanaged() private readonly model: Model<T> & IModelCreator<T>,
    protected readonly logger: ILogger
  ) {
    this.model = model;
  }

  private async findOneAndUpdate(filter: {}, entity: T, upsert: boolean, transaction?: any) {
    await this.connect(transaction);

    try {
      const saved = await this.model.findOneAndUpdate(filter, entity, {
        upsert: upsert,
        session: transaction ?? undefined,
      });
      return <T>saved;
    } catch (error: any) {
      this.logger.error(
        error.message ?? 'an exception has been occurred while findOneAndUpdate',
        error
      );
      if (error.message.indexOf('duplicate key error collection') >= 0)
        throw new DuplicationError(0, error.message);
      else throw error;
    }
  }
  public async update(filter: {}, entity: T, transaction?: any): Promise<T> {
    this.logger.debug('the method update has been called.', entity);
    return await this.findOneAndUpdate(filter, entity, false, transaction);
  }

  public async commitTransaction(transaction: any): Promise<void> {
    const session = <ClientSession>transaction;
    await session.commitTransaction();
  }
  public async abortTransaction(transaction: any): Promise<void> {
    const session = <ClientSession>transaction;
    await session.abortTransaction();
  }
  public async endTransaction(transaction: any): Promise<void> {
    const session = <ClientSession>transaction;
    await session.endSession();
  }

  public async beginTransaction(): Promise<any> {
    const transactionScope = await mongoose.startSession();
    transactionScope.startTransaction();
    return transactionScope;
  }

  public async upsert(filter: {}, entity: T, transaction: any): Promise<T> {
    this.logger.debug('the method upsert has been called.', entity);
    return await this.findOneAndUpdate(filter, entity, true, transaction);
  }

  protected async connect(transaction: any): Promise<void> {
    if (!transaction) await mongoose.connect(this.db_uri, this.db_opts);
  }

  public async erase(filter: {}, transaction: any): Promise<number> {
    this.logger.debug('the method erase has been called.', filter);
    await this.connect(transaction);

    const deleteCount = await (
      await this.model.deleteMany(filter, { session: transaction ?? undefined })
    ).deletedCount;

    return deleteCount;
  }

  public async insert(entity: T, transaction: any): Promise<T> {
    this.logger.debug('the method insert has been called.', entity);

    await this.connect(transaction);

    var doc = new this.model(entity);
    try {
      const saved = await doc.save({ session: transaction });
      return <T>saved;
    } catch (error: any) {
      if (error.message.indexOf('duplicate key error collection') >= 0)
        throw new DuplicationError(0, error.message);
      else throw error;
    }
  }

  public async find(
    filter: {},
    projection: {},
    sortion: {},
    limit: number,
    skip: number,
    transaction: any
  ): Promise<Partial<T>[]> {
    this.logger.debug('the method find has been called.', filter);

    await this.connect(transaction);

    const result = await this.model
      .find(filter)
      .sort(sortion)
      .select(projection)
      .skip(skip)
      .limit(limit)
      .session(transaction ?? null);

    return result;
  }
}
