import IRepository from './repository';
import User from '../models/user';

export default interface IUserRepository extends IRepository<User> {}
