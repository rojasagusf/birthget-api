import { Sequelize } from 'sequelize-typescript';
import logger from '../../lib/logger';
const NODE_ENV = process.env.NODE_ENV || 'production';

const CONN_MAX_ATTEMPTS = 5;
const CONN_INTERVAL = 1;

export const sequelize = new Sequelize({
  database: process.env.POSTGRESQL_DB,
  username: process.env.POSTGRESQL_USER,
  password: process.env.POSTGRESQL_PASSWORD,
  port: Number(process.env.POSTGRESQL_PORT) | 5432,
  host: process.env.POSTGRESQL_HOST,
  dialect: 'postgres',
  omitNull: true,
  models: [__dirname + '/**/*.model.js'],
  logging: false
});

function waitInterval(seconds: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000);
  });
}

async function connectToDatabase() {
  let attempt = 0;
  let connectionOk = false;
  while (!connectionOk && attempt < CONN_MAX_ATTEMPTS) {
    logger.debug(`[DB] Attempting to connect -> ${attempt}`);
    attempt++;
    try {
      await sequelize.authenticate();
      connectionOk = true;
    } catch (error) {
      logger.info(`Connection error: ${(error as Error).message}`);
      await waitInterval(CONN_INTERVAL);
    }
  }
  if (!connectionOk) {
    throw new Error('Cant connect database');
  }
}

async function initializeDb() {
  try {
    await connectToDatabase();
    logger.info('Database connection established');

    if (['testing', 'development'].includes(NODE_ENV)) {
      await sequelize.sync({alter: true});
      logger.info('Database synchronized');
    }
  } catch (error) {
    logger.error('Database initialization failed:', error);
    throw error;
  }
}

export default initializeDb;
