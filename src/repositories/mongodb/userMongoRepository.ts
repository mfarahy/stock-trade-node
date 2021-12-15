import { inject, injectable } from 'inversify';
import TYPES from '../../constants/types';
import { ILoggerFactory } from '../../logging/interfaces';
import MongoRepository from './mongoRepository';
import User from '../../models/user';
import { UserModel } from './schema/user';
import IUserRepository from './../userRepository';

@injectable()
export default class UserMongoRepository extends MongoRepository<User> implements IUserRepository {
  constructor(
    @inject(TYPES.ConnectionString) db_uri: string,
    @inject(TYPES.ConnectionOptions) options: {},
    @inject(TYPES.ILoggerFactory) loggerFactory: ILoggerFactory
  ) {
    super(db_uri, options, UserModel, loggerFactory);
  }
}
