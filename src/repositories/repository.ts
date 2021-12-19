import { QueryResult, ValueResult } from '../models/result';
import mongoose from 'mongoose';

export interface IModelCreator<T> {
  new (T): mongoose.Document<any, any, T> &
    T & {
      _id: mongoose.Types.ObjectId;
    };
}

export default interface IRepository<T> {
  insert(entity: T, transaction?: any): Promise<T>;
  update(filter: {}, entity: T, transaction?: any): Promise<T>;
  upsert(filter: {}, entity: T, transaction?: any): Promise<T>;
  erase(filter: {}, transaction?: any): Promise<number>;
  find(
    filter: {},
    projection: {},
    sortion: {},
    limit: number,
    skip: number,
    transaction?: any
  ): Promise<Partial<T>[]>;
  beginTransaction(): Promise<any>;
  commitTransaction(transaction: any): Promise<void>;
  abortTransaction(transaction: any): Promise<void>;
  endTransaction(transaction: any): Promise<void>;
}
