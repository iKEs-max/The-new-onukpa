import dotenv from 'dotenv';
import Joi from 'joi';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid('production', 'development', 'test')
      .required(),
    PORT: Joi.number().default(5000),
    DATABASE_URL: Joi.string().required().description('Postgres DB url'),
    REDIS_URL: Joi.string().required().description('Redis url'),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    FRONTEND_URL: Joi.string().required().description('Frontend URL for CORS'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const env = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  dbUrl: envVars.DATABASE_URL,
  redisUrl: envVars.REDIS_URL,
  jwtSecret: envVars.JWT_SECRET,
  frontendUrl: envVars.FRONTEND_URL,
};
