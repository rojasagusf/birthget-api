import express from 'express';
import { loginUser } from '../controllers/authController';

const router = express.Router();

/**
 * @name Post login a user
 * @description Login a user
 * @route {POST} /api/login
 * @bodyparam {string} [email] user email
 * @bodyparam {string} [password] user password
 * @response {200} OK
 * @responsebody {object} [user] user created
 * @responsebody {number} [user.id] person identifier
 * @responsebody {string} [user.name] name
 * @responsebody {string} [user.email] email
 * @responsebody {boolean} [user.password] password
 * @response {400} User not exists
 * @responsebody {string} [code] user_not_exists
 * @responsebody {string} [message] User not exists
 * @response {400} Invalid authentication
 * @responsebody {string} [code] invalid_authentication
 * @responsebody {string} [message] Invalid authentication
 * @response {500} Error creating user
 * @responsebody {string} [code] internal_error
 * @responsebody {string} [message] Internal error
 */

router.post(
  '/login',
  loginUser
);

export default router;
