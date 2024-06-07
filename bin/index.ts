import * as dotenv from 'dotenv';
dotenv.config();
import initialize from '../app';
import initializeDb from '../lib/models/index';
import logger from '../lib/logger';

const PORT = process.env.SERVER_PORT;

const initApi = async () => {
  try {
    await initializeDb();
    const application = initialize();
    application.listen(PORT);
    logger.info(`Your server is listening on port ${PORT}`);
    return true;
  } catch (error) {
    logger.error('Error starting the application');
    logger.error((error as Error).message);
    logger.error((error as Error).stack);
    return process.exit(0);
  }
};

initApi();
