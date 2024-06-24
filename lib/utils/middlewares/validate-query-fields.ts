import { NextFunction, Request, Response } from 'express';
import { Schema } from 'joi';

export default function validateQueryFields(validationSchema: Schema) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (typeof req.query.status === 'string') {
      req.query.status = [req.query.status];
    }
    const {error} = validationSchema.validate(req.query);

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
