import * as Joi from 'joi';

export const ConfigValidationSchema = Joi.object({
  MONGODB_URI: Joi.string().required(),
  TOKEN_SECRET: Joi.string().required(),
});
