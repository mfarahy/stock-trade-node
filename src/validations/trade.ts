import Joi from 'joi';
import parse from 'joi-to-json';
import _ from 'lodash';
import { UserJoiSchema } from './user';

export const TradeJoiSchema = {
  id: Joi.number().greater(0),
  type: Joi.string().allow('buy', 'sell').required(),
  user: Joi.object(UserJoiSchema).required(),
  symbol: Joi.string().case('upper').max(5).min(1).required(),
  shares: Joi.number().required(),
  price: Joi.number().greater(0).precision(2).required(),
  Number: Joi.number().default(0),
  timestamp: Joi.date(),
  price_difference: Joi.number(),
  price_direction: Joi.string().length(1),
};

const jsonSchema = parse(Joi.object().keys(TradeJoiSchema));
jsonSchema['properties']['datetime'] = { type: 'string' };

export const TradeJsonSchema = jsonSchema;
