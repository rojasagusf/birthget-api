import express from 'express';
import { validateUserExists } from '../utils/middlewares/auth';
import { registerUser } from '../controllers/authController';

const router = express.Router();

/**
 * @name Post registers a user
 * @description Register a user
 * @route {POST} /api/register
 * @bodyparam {string} [name] user name
 * @bodyparam {string} [email] user email
 * @bodyparam {string} [password] user password
 * @response {201} OK
 * @responsebody {object} [user] user created
 * @responsebody {number} [user.id] person identifier
 * @responsebody {string} [user.name] name
 * @responsebody {string} [user.email] email
 * @responsebody {boolean} [user.password] password
 * @response {400} User already exists
 * @responsebody {string} [code] user_already_exists
 * @responsebody {string} [message] User already exists
 * @response {400} Invalid user creation
 * @responsebody {string} [code] invalid_user_creation
 * @responsebody {string} [message] Invalid user creation
 * @response {500} Error creating user
 * @responsebody {string} [code] internal_error
 * @responsebody {string} [message] Internal error
 */

router.post(
  '/register',
  validateUserExists,
  registerUser
);

export default router;
