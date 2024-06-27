import express from 'express';
import { validateUserExists } from '../utils/middlewares/auth';
import { registerUser } from '../controllers/authController';
import validateBodyFields from '../utils/middlewares/validate.body-fields';
import Joi from 'joi';

const router = express.Router();

/**
 * @name Post registers a user
 * @description Register a user
 * @route {POST} /api/register
 * @bodyparam {string} [name] user name
 * @bodyparam {string} [email] user email
 * @bodyparam {string} [password] user password
 * @response {201} OK
 * @response {400} User already exists
 * @responsebody {string} [code] user_already_exists
 * @responsebody {string} [message] User already exists
 * @response {400} Invalid user creation
 * @responsebody {string} [code] invalid_user_creation
 * @responsebody {string} [message] Invalid user creation
 * @response {500} Error registering user
 * @responsebody {string} [code] internal_error
 * @responsebody {string} [message] Internal error
 */

router.post(
  '/register',
  validateBodyFields(Joi.object({
    name: Joi.string().min(3).max(200).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(14).required()
  })),
  validateUserExists,
  registerUser
);

export default router;
