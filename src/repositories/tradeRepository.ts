import IRepository from './repository';
import Trade from '../models/trade';

export default interface ITradeRepository extends IRepository<Trade> {}
