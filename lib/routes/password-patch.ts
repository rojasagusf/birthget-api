import express from 'express';
import validateBodyFields from '../utils/middlewares/validate.body-fields';
import Joi from 'joi';
import { updatePassword } from '../controllers/userController';

const router = express.Router();

router.patch(
  '/user/password/:id',
  validateBodyFields(Joi.object({
    password: Joi.string().min(6).max(14).required()
  })),
  updatePassword
);

export default router;
