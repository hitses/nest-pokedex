import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
  PORT: Joi.number().required().default(3000),
  MONGO_DB: Joi.string().required(),
  DEFAULT_LIMIT: Joi.number().required().default(20),
  DEFAULT_OFFSET: Joi.number().required().default(0),
});
