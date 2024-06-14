import * as jwt from 'jsonwebtoken';
import { NextFunction,  Response, Request } from 'express';
const SECRET = process.env.JWT_SECRET as jwt.Secret;
const EXPIRATION = process.env.JWT_TOKEN_EXPIRATION;
const ISSUER = process.env.JWT_ISSUER;

export function createToken(id: number, name: string) {
  return jwt.sign(
    {
      sub: id,
      name: name
    },
    SECRET,
    {
      expiresIn: EXPIRATION,
      issuer: ISSUER
    }
  );
}

export function getJwt(req: Request) {
  let token = '';
  if (req.headers.authorization && req.headers.authorization.indexOf('Bearer') !== -1) {
    token = req.headers.authorization.replace('Bearer ', '');
  } else if (req.query && req.query.jwt) {
    token = String(req.query.jwt);
  }
  return token;
}

export function extractJwt(req: Request, res: Response, next: NextFunction) {
  jwt.verify(
    getJwt(req),
    SECRET,
    (err, decoded) => {
      if (err) {
        return res.status(401).json({
          code: 'unauthorized',
          message: 'Unauthorized'
        });
      }
      req.user = decoded;
      return next();
    });
}


