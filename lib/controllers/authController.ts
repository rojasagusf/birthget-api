import { Request, Response } from 'express';
import bcryptjs from 'bcryptjs';
import User from '../models/user.model';
import logger from '../logger';
import { createToken } from '../utils/jwt-utils';
import sendMail from '../utils/mail-sender';
import { sequelize } from '../models';
import CodeVerification from '../models/codeverification.model';
import crypto from 'crypto';

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
      return res.status(400).json({
        code: 'invalid_user_creation',
        message: 'Invalid user creation'
      });
    }

    const codeVerifier = await CodeVerification.create({
      transaction: crypto.randomBytes(20).toString('hex'),
      userId: user.id
    }, {transaction});

    if (!codeVerifier) {
      await transaction.rollback();
      return res.status(400).json({
        code: 'invalid_code_verifier_creation',
        message: 'Invalid code verifier creation'
      });
    }

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<style>
    html, body {
        box-sizing: border-box;
        padding: 0;
        margin: 0;
        color: white;
    }
    header {
        background-color: #0d0d0d;
        padding: 1rem;
        display: flex;
        justify-content: start;
        align-items: center;
    }
    main {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    p {
        color: #0d0d0d;
        font-weight: bold;
        font-size: 2rem;
    }
    button {
        font-size: 1.2rem;
        padding: .5rem 1rem;
        background-color: #29cc8d;
        border: none;
        border-radius: 3px;
        color: white;
        font-weight: bold;
        cursor: pointer;
    }
</style>
<body>
    <header>
        <h1>Birthget</h1>
    </header>
    <main>
        <p>Welcome! You’ve signed up as ${user.name} at Letterboxd!</p>
        <a href="http://localhost:3000/transaction/${codeVerifier.transaction}">
            <button>Validate</button>
        </a>
        <p>
            Please validate your email address by clicking the above button.
        </p>
    </main>
    <footer>
        <p>
            Happy birthday,
            <a href="http://localhost:3000">
              Birthget
            </a>
            .
        </p>
    </footer>
</body>
</html>`;

    await transaction.commit();
    await sendMail(user.email, 'Please validate your Birthget account', html);

    return res.status(201).json('Email sended');
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
        message: 'User is not active'
      })
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
