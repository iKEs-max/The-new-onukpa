import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validate = (schema: any) => (req: Request, res: Response, next: NextFunction) => {
  const validSchema = Joi.object(schema);
  const object = Object.keys(schema).reduce((obj: any, key) => {
    if (Object.prototype.hasOwnProperty.call(req, key)) {
      obj[key] = req[key as keyof Request];
    }
    return obj;
  }, {});

  const { value, error } = validSchema.prefs({ errors: { label: 'key' } }).validate(object);

  if (error) {
    const errorMessage = error.details.map((details) => details.message).join(', ');
    return next(new Error(errorMessage));
  }
  Object.assign(req, value);
  return next();
};
