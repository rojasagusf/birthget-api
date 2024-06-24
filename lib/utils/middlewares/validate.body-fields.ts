import { NextFunction, Request, Response } from 'express';
import { Schema } from 'joi';

export default function validateBodyFields(validationSchema: Schema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const {error} = validationSchema.validate(req.body);
    if (error) {
      const firstError = error.details[0].message;
      return res.status(400).json({
        code: 'invalid_fields',
        message: `Invalid field - ${firstError}`
      });
    }
    return next();
  };
}
