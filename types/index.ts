import { ParsedParams } from './parsed-params';

export {};

declare global {
  namespace Express {
    interface Request {
      user: any,
      parsedParams: ParsedParams
    }
  }
}
