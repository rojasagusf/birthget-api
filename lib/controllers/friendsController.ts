import { Request, Response } from 'express';
import Friend from '../models/friend.model';
import logger from '../logger';

export const getAllFriends = async(req: Request, res: Response) => {
  const { skip, limit } = req.parsedParams || {};
  req.parsedParams.filters.userId = Number(req.user.sub);

  try {
    const friends = await Friend.findAll({
      where: req.parsedParams.filters,
      limit: limit,
      offset: skip
    });

    return res.status(200).json(friends);
  } catch (error) {
    logger.error(`getAllFriends error: ${(error as Error).message}`);
    return res.status(500).json({
      code: 'internal_error',
      message: 'Internal error'
    });
  }
};

export const getFriendById = async(req: Request, res: Response) => {
  try {
    const friend = await Friend.findOne({
      where: {
        id: req.params.id,
        userId: req.user.sub
      }
    });

    if (!friend) {
      return res.status(400).json({
        code: 'friend_not_found',
        message: 'Friend not found'
      });
    }

    return res.status(200).json(friend);
  } catch (error) {
    logger.error(`getFriendById error: ${(error as Error).message}`);
    return res.status(500).json({
      code: 'internal_error',
      message: 'Internal error'
    });
  }
};

export const deleteFriendById = async(req: Request, res: Response) => {
  const {id} = req.params;

  try {
    const friendFound = await Friend.findOne({
      where: {
        id
      }
    });

    if (!friendFound) {
      return res.status(400).json({
        code: 'friend_not_exists',
        message: 'Friend not exists'
      });
    }

    await friendFound.destroy({});

    return res.status(200).json({});
  } catch (error) {
    logger.error(`deleteFriendById error: ${(error as Error).message}`);
    return res.status(500).json({
      code: 'internal_error',
      message: 'Internal error'
    });
  }
};

export const createFriend = async(req: Request, res: Response) => {
  const {name, birthdate} = req.body;

  try {
    const newFriend = await Friend.create({
      name,
      birthdate,
      userId: Number(req.user.sub)
    });

    return res.status(201).json(newFriend);
  } catch (error) {
    logger.error(`createFriend error: ${(error as Error).message}`);
    return res.status(500).json({
      code: 'internal_error',
      message: 'Internal error'
    });
  }
};

export const updateFriendById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const [updatedRows, [updatedFriend]] = await Friend.update(req.body, {
      where: { id },
      returning: true,
    });

    if (updatedRows === 0) {
      return res.status(400).json({
        code: 'friend_not_exists',
        message: 'Friend not exists',
      });
    }

    return res.status(200).json(updatedFriend);
  } catch (error) {
    logger.error(`updateFriendById error: ${(error as Error).message}`);
    return res.status(500).json({
      code: 'internal_error',
      message: 'Internal error',
    });
  }
};
