import { Request, Response } from 'express';
import bcryptjs from 'bcryptjs';
import User from '../models/user.model';
import logger from '../logger';
import { createToken } from '../utils/jwt-utils';

export const registerUser = async (req: Request, res: Response) => {
  try {
    const {name, email, password} = req.body;

    const formattedData = {
      name,
      email,
      password: await bcryptjs.hash(password, 10)
    };

    const user = await User.create(formattedData);

    if (user) {
      const token = createToken(user.id);

      res.cookie('jwt', token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
      return res.status(201).json(user);
    }

    return res.status(400).json({
      code: 'invalid_user_creation',
      message: 'Invalid user creation'
    });

  } catch (error) {
    logger.error(`registerUser error: ${(error as Error).message}`);
    return res.status(500).json({
      code: 'internal_error',
      message: 'Internal error'
    });
  }
};
