import { QueryResult, ValueResult } from '../models/result';
import mongoose from 'mongoose';

export interface IModelCreator<T> {
  new (T): mongoose.Document<any, any, T> &
    T & {
      _id: mongoose.Types.ObjectId;
    };
}

export default interface IRepository<T> {
  insert(entity: T): Promise<T>;
  eraseAll(): Promise<void>;
  find(filter: {}, projection: {}, sortion: {}, limit: number, skip: number): Promise<Partial<T>[]>;
}
