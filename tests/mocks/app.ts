import path from 'path';
const envPath = path.join(__dirname, './../../.env.test');
import * as dotenv from 'dotenv';
dotenv.config({path: envPath});
import initialize from '../../app';
import initializeDb from '../../lib/models';
import logger from '../../lib/logger';

function initDb() {
  return initializeDb()
    .then(() => {
      return initialize();
    })
    .catch((error) => {
      logger.error('APP STOPPED');
      logger.error(error.stack);
      return process.exit(1);
    });
}

function start() {
  return initialize();
}

export {
  initDb,
  start
};
