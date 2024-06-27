import express, { Response, Application } from 'express';
const app: Application = express();
import cors from 'cors';
import path from 'path';
import  expressWinston  from 'express-winston';
import logger from './lib/logger';
import publicPaths from './config/public-paths';
import * as routes from './lib/routes';
import { extractJwt } from './lib/utils/jwt-utils';
import cookieParser from 'cookie-parser';
import './lib/types';

const initialize = () => {
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(cookieParser());

  app.use(expressWinston.logger({
    winstonInstance: logger,
    expressFormat: true,
    colorize: false,
    meta: false,
    statusLevels: true
  }));

  app.get(publicPaths('get'), extractJwt);
  app.patch(publicPaths('patch'), extractJwt);
  app.post(publicPaths('post'), extractJwt);
  app.delete(publicPaths('delete'), extractJwt);


  for (const key of Object.keys(routes)) {
    app.use('/api', routes[key as keyof typeof routes]);
  }

  app.use(function (_req, _res, next) {
    const err = { message: 'Not Found', status: 404, stack: {}, };
    next(err);
  });

  app.use((res: Response) => {
    console.error('Not Found');
    return res.status(400).json({
      status: 'not_found',
      message: 'Not Found'
    });
  });

  return app;
};

export default initialize;
