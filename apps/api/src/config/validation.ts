import * as Joi from 'joi';

const validationSchema = Joi.object({
  PORT: Joi.number().default(3333),
  DATABASE_URL: Joi.string().uri().required(),
  REDIS_URL: Joi.string().uri().required(),
  JWT_SECRET: Joi.string().min(16).required(),
  JWT_EXPIRES_IN: Joi.string().default('15m'),
  JWT_REFRESH_SECRET: Joi.string().min(16).required(),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),
  WHATSAPP_PROVIDER_URL: Joi.string().uri().required(),
  WHATSAPP_API_KEY: Joi.string().required(),
  WHATSAPP_INSTANCE_ID: Joi.string().required(),
  WHATSAPP_WEBHOOK_SECRET: Joi.string().required(),
});

export default validationSchema;
