import User from '../lib/models/user.model';
import logger from '../lib/logger';
import { hashPassword } from '../lib/utils/encrypt-utils';

const ADMIN_NAME = process.env.ADMIN_NAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const createDefaultAdmin = async() => {
  if (!ADMIN_NAME || !ADMIN_PASSWORD) {
    return Promise.resolve();
  }

  try {
    const userFounded = await User.findOne({
      where: {
        role: 'admin'
      }
    });

    if (userFounded) {
      return null;
    }
    const password = await hashPassword(ADMIN_PASSWORD);

    await User.create({
      name: ADMIN_NAME,
      password: password,
      role: 'admin'
    });
  } catch (error) {
    logger.error('Error creating default admin');
    logger.error((error as Error).message);
    logger.error((error as Error).stack);
    return process.exit(0);
  }
};

export default createDefaultAdmin;
