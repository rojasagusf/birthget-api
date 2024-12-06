import { Request, Response } from 'express';
import User from '../models/user.model';
import logger from '../logger';
import bcryptjs from 'bcryptjs';

export const updateUserById = async(req: Request, res: Response) => {
  const { cellphone, name, source } = req.body;

  if (!cellphone && !name && !source) {
    return res.status(400).json({
      code: 'not_changes_detected',
      message: 'Not changes detected'
    });
  }
  const {id} = req.params;

  try {
    const [updatedRows, [updateUser]] = await User.update(req.body, {
      where: { id },
      returning: true,
    });

    if (updatedRows === 0) {
      return res.status(400).json({
        code: 'user_not_exists',
        message: 'User not exists',
      });
    }

    return res.status(200).json(updateUser);
  } catch (error) {
    logger.error(`updateFriendById error: ${(error as Error).message}`);
    return res.status(500).json({
      code: 'internal_error',
      message: 'Internal error'
    });
  }
};

export const updatePassword = async(req: Request, res: Response) => {
  const { password } = req.body;
  const {id} = req.params;

  try {
    const encryptedPassword = await bcryptjs.hash(password, 10);

    const [updatedRows, [updateUser]] = await User.update(
      {
        password: encryptedPassword
      },
      {
        where: { id },
        returning: true,
      });

    if (updatedRows === 0) {
      return res.status(400).json({
        code: 'user_not_exists',
        message: 'User not exists',
      });
    }

    return res.status(200).json(updateUser);
  } catch (error) {
    logger.error(`updatePassword error: ${(error as Error).message}`);
    return res.status(500).json({
      code: 'internal_error',
      message: 'Internal error'
    });
  }
};
