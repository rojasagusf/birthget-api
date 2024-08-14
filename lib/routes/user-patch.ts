import express from 'express';
import validateBodyFields from '../utils/middlewares/validate.body-fields';
import Joi from 'joi';
import { updateUserById } from '../controllers/userController';

const router = express.Router();

/**
 * @name Patch update user
 * @description Update user
 * @route {PATCH} /user/:id
 * @bodyparam {string} [name] User name
 * @bodyparam {string} [source] User source
 * @bodyparam {number} [cellphone] User phone number
 * @response {200} OK
 * @responsebody {object} [user] user created
 * @responsebody {number} [user.id] person identifier
 * @responsebody {string} [user.name] name
 * @responsebody {string} [user.email] email
 * @responsebody {boolean} [user.password] password
 * @response {400} User not exists
 * @responsebody {string} [code] user_not_exists
 * @responsebody {string} [message] User not exists
 * @response {500} Error updating user
 * @responsebody {string} [code] internal_error
 * @responsebody {string} [message] Internal error
 */

router.patch(
  '/user/:id',
  validateBodyFields(Joi.object({
    name: Joi.string().min(3).max(200).optional(),
    source: Joi.string().valid('whatsapp', 'email').optional(),
    cellphone: Joi.number().optional(),
  })),
  updateUserById
);

export default router;
