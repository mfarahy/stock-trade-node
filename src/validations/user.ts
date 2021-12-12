import Joi from 'joi';
import parse from 'joi-to-json';

export const UserJoiSchema = {
  id: Joi.number().greater(0),
  name: Joi.string().required(),
};

export const UserJsonSchema = parse(Joi.object(UserJoiSchema));
