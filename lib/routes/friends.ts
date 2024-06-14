import express from 'express';
import { createFriend, deleteFriendById, getAllFriends, getFriendById, updateFriendById } from '../controllers/friendsController';
import validateBodyFields from '../utils/middlewares/validate.body-fields';
import validateQueryFields from '../utils/middlewares/validate-query-fields';
import Joi from 'joi';
import parseGetParams from '../utils/middlewares/parse-query-params';

const router = express.Router();

router.get(
  '/friends',
  validateQueryFields(Joi.object({
    limit: Joi.number().min(1).max(30),
    skip: Joi.number().min(0),
    sort: Joi.string(),
    search: Joi.string().min(3),
  })),
  parseGetParams({
    search: ['name'],
    filters: ['name'],
    defaultSort: '-'
  }),
  getAllFriends
);

router.get(
  '/friends/:id',
  getFriendById
);

router.post(
  '/friends',
  validateBodyFields(Joi.object({
    name: Joi.string().min(3).max(200).required(),
    source: Joi.string().valid('whatsapp', 'email').required()
  })),
  createFriend
);

router.delete(
  '/friends/:id',
  deleteFriendById
);

router.patch(
  '/friends/:id',
  validateBodyFields(Joi.object({
    name: Joi.string().min(3).max(200).required(),
    source: Joi.string().valid('whatsapp', 'email').required()
  })),
  updateFriendById
);

export default router;
