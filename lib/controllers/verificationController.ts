import { Request, Response } from 'express';
import CodeVerification from '../models/codeverification.model';
import logger from '../logger';
import { createToken } from '../utils/jwt-utils';
import User from '../models/user.model';
import { sequelize } from '../models';

export const verificationCode = async(req: Request, res: Response) => {
  const transaction = await sequelize.transaction();
  try {
    const codeVerificationFound = await CodeVerification.findOne({
      where: {
        transaction: req.body.transaction
      },
      include:[{
        model: User,
        as: 'user'
      }]
    });

    if (!codeVerificationFound) {
      await transaction.rollback();
      return res.status(400).json({
        code: 'code_verification_not_found',
        message: 'Code verification not found'
      });
    }

    const token = createToken(codeVerificationFound.user.id, codeVerificationFound.user.name);

    res.cookie('token', token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });

    codeVerificationFound.user.active = true;
    await codeVerificationFound.user.save({transaction});
    await codeVerificationFound.destroy({transaction});

    await transaction.commit();
    return res.status(201).json(token);
  } catch (error) {
    await transaction.commit();
    logger.error(`verificationCode error: ${(error as Error).message}`);
    return res.status(500).json({
      code: 'internal_error',
      message: 'Internal error'
    });
  }
};
