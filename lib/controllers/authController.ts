import { Request, Response } from 'express';
import bcryptjs from 'bcryptjs';
import User from '../models/user.model';
import logger from '../logger';
import { createToken } from '../utils/jwt-utils';
import { sequelize } from '../models';
import CodeVerification from '../models/codeverification.model';
import crypto from 'crypto';
import sendEmailTemplate from '../utils/mail-templates';

const WEB_URL = process.env.WEB_URL;

export const registerUser = async (req: Request, res: Response) => {
  const transaction = await sequelize.transaction();
  try {
    const {name, email, password} = req.body;
    const formattedData = {
      name,
      email,
      password: await bcryptjs.hash(password, 10),
      active: false
    };

    const user = await User.create(formattedData, {transaction});

    if (!user) {
      await transaction.rollback();
      throw new Error('Error creating user');
    }

    const codeVerifier = await CodeVerification.create({
      transaction: crypto.randomBytes(20).toString('hex'),
      userId: user.id
    }, {transaction});

    if (!codeVerifier) {
      await transaction.rollback();
      throw new Error('Error creating code verification');
    }

    await sendEmailTemplate(
      'email-validation',
      user.email,
      'Email verification',
      {
        USERNAME: user.name,
        TRANSACTION: codeVerifier.transaction,
        WEBURL: WEB_URL || '',
      }
    );

    await transaction.commit();
    return res.status(201).json({
      sended: true
    });
  } catch (error) {
    await transaction.rollback();
    logger.error(`registerUser error: ${(error as Error).message}`);
    return res.status(500).json({
      code: 'internal_error',
      message: 'Internal error'
    });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const {email, password} = req.body;
    const user = await User.findOne({
      where: {
        email
      }
    });

    if (!user) {
      return res.status(400).json({
        code: 'user_not_exists',
        message: 'User not exists'
      });
    }

    if (!user.active) {
      return res.status(400).json({
        code: 'user_not_active',
        message: 'User not active'
      });
    }

    const samePassword = await bcryptjs.compare(password, user.password);

    if (!samePassword) {
      return res.status(400).json({
        code: 'invalid_authentication',
        message: 'Invalid authentication'
      });
    }

    const token = createToken(user.id, user.name);

    res.cookie('token', token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
    return res.status(200).json({
      token,
      user
    });
  } catch (error) {
    logger.error(`loginUser error: ${(error as Error).message}`);
    return res.status(500).json({
      code: 'internal_error',
      message: 'Internal error'
    });
  }
};
