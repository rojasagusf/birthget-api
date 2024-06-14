import express from 'express';
import { createFriend, deleteFriendById, getAllFriends, getFriendById, updateFriendById } from '../controllers/friendsController';
import validateBodyFields from '../utils/middlewares/validate.body-fields';
import validateQueryFields from '../utils/middlewares/validate-query-fields';
import Joi from 'joi';
import parseGetParams from '../utils/middlewares/parse-query-params';

const router = express.Router();

/**
 * @name Get friends
 * @description Get all friend
 * @queryparam {string} [search] filter by name or birthday
 * @queryparam {string} [sort] filter by order
 * @queryparam {number} [skip] amount of friends to skip
 * @queryparam {number} [limit] amount of friends in response
 * @route {GET} /friends
 * @response {200} OK
 * @responsebody {Array<object>} [*] friends
 * @responsebody {number} [*.id] Unique identifier
 * @responsebody {string} [*.name] Friend name
 * @responsebody {string} [*.source] Source of notify
 * @responsebody {string} [*.userId] User relationship identifier
 * @response {500} Error in get friends
 * @responsebody {string} [code] internal_error
 * @responsebody {string} [message] Internal error
 */

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

/**
 * @name Get a friend
 * @description Get a friend
 * @route {GET} /friends/:id
 * @response {200} OK
 * @responsebody {object} [friend] Friend found
 * @responsebody {number} [friend.id] Unique identifier
 * @responsebody {string} [friend.name] Friend name
 * @responsebody {string} [friend.source] Source of notify
 * @responsebody {string} [friend.userId] User relationship identifier
 * @response {500} Friend not found
 * @responsebody {string} [code] friend_not_found
 * @responsebody {string} [message] Friend not found
 * @response {500} Error creating friend
 * @responsebody {string} [code] internal_error
 * @responsebody {string} [message] Internal error
 */

router.get(
  '/friends/:id',
  getFriendById
);

/**
 * @name Post register a friend
 * @description Register a friend
 * @route {POST} /api/friends
 * @bodyparam {string} [name] Friend name
 * @bodyparam {string} [source] Notify source
 * @response {201} OK
 * @responsebody {object} [friend] Friend created
 * @responsebody {number} [friend.id] Unique identifier
 * @responsebody {string} [friend.name] Friend name
 * @responsebody {string} [friend.source] Source of notify
 * @responsebody {string} [friend.userId] User relationship identifier
 * @response {500} Error creating friend
 * @responsebody {string} [code] internal_error
 * @responsebody {string} [message] Internal error
 */

router.post(
  '/friends',
  validateBodyFields(Joi.object({
    name: Joi.string().min(3).max(200).required(),
    source: Joi.string().valid('whatsapp', 'email').required()
  })),
  createFriend
);

/**
 * @name Delete delete a friend
 * @description Delete a friend
 * @route {DELETE} /api/friends/:id
 * @response {200} OK
 * @responsebody {object} [{}] Object
 * @response {500} Friend not exists
 * @responsebody {string} [code] friend_not_exists
 * @responsebody {string} [message] Friend not exists
 * @response {500} Error creating friend
 * @responsebody {string} [code] internal_error
 * @responsebody {string} [message] Internal error
 */

router.delete(
  '/friends/:id',
  deleteFriendById
);

/**
 * @name Patch update a friend
 * @description Update a friend
 * @route {PATCH} /friends/:id
 * @bodyparam {string} [name] Friend name
 * @bodyparam {string} [source] Notify source
 * @response {200} OK
 * @responsebody {object} [friend] Friend updated
 * @responsebody {number} [friend.id] Unique identifier
 * @responsebody {string} [friend.name] Friend name
 * @responsebody {string} [friend.source] Source of notify
 * @responsebody {string} [friend.userId] User relationship identifier
 * @response {500} Friend not exists
 * @responsebody {string} [code] friend_not_exists
 * @responsebody {string} [message] Friend not exists
 * @response {500} Error creating friend
 * @responsebody {string} [code] internal_error
 * @responsebody {string} [message] Internal error
 */

router.patch(
  '/friends/:id',
  validateBodyFields(Joi.object({
    name: Joi.string().min(3).max(200).required(),
    source: Joi.string().valid('whatsapp', 'email').required()
  })),
  updateFriendById
);

export default router;
