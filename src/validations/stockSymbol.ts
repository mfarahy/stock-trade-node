import Joi from 'joi';
import parse from 'joi-to-json';

export const StockSymbolJoiSchema = {
  id: Joi.string().required().max(10).min(1).uppercase(),
  name: Joi.string().required().max(10).min(1),
  lastPrice: Joi.number(),
  lastTrade: Joi.date(),
};

export const StockSymbolJsonSchema = parse(Joi.object(StockSymbolJoiSchema));
