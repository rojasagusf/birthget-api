'use strict';
import * as jwt from 'jsonwebtoken';
type Jwt = typeof jwt;
let jsonwebtoken: Jwt;

type Token = 'token_user_0001';

interface TokenPayload {
  sub: string;
  name: string;
  organization: number;
  role: number;
}

const internalTokens: Record<Token, TokenPayload> = {
  token_user_0001: {
    sub: '1',
    name: 'Matias',
    organization: 1,
    role: 1,
  },
};

function verify(
  token: string,
  secret: jwt.Secret | jwt.GetPublicKeyOrSecret,
  callback: (error: boolean, decoded?: string | jwt.JwtPayload | undefined) => void
) {
  if (internalTokens[token as Token]) {
    return callback(false, internalTokens[token as Token]);
  }
  return jsonwebtoken.verify(
    token,
    secret,
    (err: jwt.VerifyErrors | null, decoded: string | jwt.JwtPayload | undefined) => {
      if (err) {
        return callback(true);
      }
      return callback(false, decoded);
    }
  );
}

function sign(data: string | object | Buffer, secret: jwt.Secret, configurations?: jwt.SignOptions) {
  return jsonwebtoken.sign(data, secret, configurations);
}

function original() {
  return jsonwebtoken;
}

export default (realJWT: Jwt) => {
  jsonwebtoken = realJWT;
  return {
    verify,
    sign,
    original,
  };
};
