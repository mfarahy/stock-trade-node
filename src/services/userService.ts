import { inject, injectable } from 'inversify';
import TYPES from '../constants/types';
import { ILoggerFactory } from '../logging/interfaces';
import User from '../models/user';
import IUserRepository from './../repositories/userRepository';
import ServiceBase, { IServiceBase } from './serviceBase';
import { UserJoiSchema } from './../validations/user';

export interface IUserService extends IServiceBase<User> {}

@injectable()
export default class UserService extends ServiceBase<User, IUserRepository> {
  constructor(
    @inject(TYPES.IUserRepository) repository: IUserRepository,
    @inject(TYPES.ILoggerFactory) loggerFactory: ILoggerFactory
  ) {
    super(repository, UserJoiSchema, User, loggerFactory);
  }
}
