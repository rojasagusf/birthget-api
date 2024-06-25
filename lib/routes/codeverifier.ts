import express from 'express';
import { verificationCode } from '../controllers/verificationController';
import validateBodyFields from '../utils/middlewares/validate.body-fields';
import Joi from 'joi';

const router = express.Router();

/**
 * @name Post a transaction id from email address
 * @description Generate a token from transaction id
 * @bodyparam {string} [transaction] Transaction id
 * @route {POST} /codeverifier
 * @response {200} OK
 * @responsebody {token} [token] Jwt token to authenticate
 * @response {400} Code verification not found
 * @responsebody {string} [code] code_verification_not_found
 * @responsebody {string} [message] Code verification not found
 * @response {500} Error creating friend
 * @responsebody {string} [code] internal_error
 * @responsebody {string} [message] Internal error
 */

router.post(
  '/codeverifier',
  validateBodyFields(Joi.object({
    transaction: Joi.string().required(),
  })),
  verificationCode
);

export default router;
