import mongoose, { Model } from 'mongoose';
import { ILogger, ILoggerFactory } from '../../logging/interfaces';
import IRepository, { IModelCreator } from './../repository';
import DuplicationError from '../../exceptions/duplicationError';
import { injectable, unmanaged } from 'inversify';

@injectable()
export default abstract class MongoRepository<T> implements IRepository<T> {
  private db_uri: string;
  private db_opts: Object;
  protected logger: ILogger;
  private model: Model<T>;

  constructor(
    db_uri: string,
    options: {},
    @unmanaged() model: Model<T> & IModelCreator<T>,
    loggerFactory: ILoggerFactory
  ) {
    this.db_uri = db_uri;
    this.db_opts = options;
    this.model = model;
    this.logger = loggerFactory.create(MongoRepository.name);
  }

  protected connect = async (): Promise<void> => {
    await mongoose.connect(this.db_uri, this.db_opts);
  };

  public eraseAll = async (): Promise<void> => {
    await this.connect();

    await this.model.deleteMany({});
  };

  public insert = async (entity: T): Promise<T> => {
    this.logger.debug('the method insert has been called.');

    await this.connect();

    var doc = new this.model(entity);
    try {
      const saved = await doc.save();
      return <T>saved;
    } catch (error: any) {
      if (error.message.indexOf('duplicate key error collection') >= 0)
        throw new DuplicationError(0, error.message);
      else throw error;
    }
  };

  public find = async (
    filter: {},
    projection: {},
    sortion: {},
    limit: number,
    skip: number
  ): Promise<Partial<T>[]> => {
    await this.connect();

    const result = await this.model
      .find(filter)
      .sort(sortion)
      .select(projection)
      .skip(skip)
      .limit(limit);

    return result;
  };
}
