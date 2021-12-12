import Joi from 'joi';
import parse from 'joi-to-json';
import { UserJoiSchema } from './user';

export const TradeJoiSchema = {
  id: Joi.number().greater(0),
  type: Joi.string().allow('buy', 'sell').required(),
  user: Joi.object(UserJoiSchema).required(),
  symbol: Joi.string().case('upper').max(5).min(1).required(),
  shares: Joi.number().max(30).min(10).required(),
  price: Joi.number().greater(0).precision(2).required(),
  timestamp: Joi.date(),
};

export const TradeJsonSchema = parse(Joi.object(TradeJoiSchema));
