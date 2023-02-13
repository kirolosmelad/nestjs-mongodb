import * as Joi from 'joi';

export const ConfigValidationSchema = Joi.object({
  MONGO_CONNECTION_STRING: Joi.string().required(),
});
