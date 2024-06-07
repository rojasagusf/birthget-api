import { Request, Response, NextFunction } from 'express';
import User from '../../models/user.model';
import logger from '../../logger';

export const validateUserExists = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email,
      }
    });

    if (user) {
      return res.status(400).json({
        code: 'user_already_exists',
        message: 'User already exists'
      });
    }

    return next();
  } catch (error) {
    logger.error(`validateUserExists error: ${(error as Error).message}`);
    return res.status(500).json({
      code: 'internal_error',
      message: 'Internal error'
    });
  }
};
