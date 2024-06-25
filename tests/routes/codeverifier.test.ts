import 'mocha';
import 'should';
import { start } from '../mocks/app';
import request from 'supertest';
import { Application } from 'express';
import User from '../../lib/models/user.model';
import CodeVerification from '../../lib/models/codeverification.model';

describe('POST /api/codeverifier', () => {
  let application: Application;
  const matchJwt = (token: string) => {
    const jwtRegex = /^[\w-]*\.[\w-]*\.[\w-]*$/;
    return jwtRegex.test(token);
  };

  before(function () {
    application = start();
    return Promise.all([
      User.create({
        id: 1,
        name: 'User 1',
        email: 'test@example.com',
        password: 'test',
        active: false
      })
    ])
      .then(() => {
        return Promise.all([
          CodeVerification.create({
            id: 1,
            transaction: 'abcdefg',
            userId: 1
          })
        ])
      });
  });

  after(() => {
    return CodeVerification.destroy({
      truncate: true
    })
      .then(() => {
        return User.destroy({where: {}});
      });
  });

  it('Should fail with no body', () => {
    return request(application)
      .post('/api/codeverifier')
      .send({})
      .set('Accept', 'application/json')
      .expect(400)
      .then((response) => {
        response.body.code.should.be.equal('invalid_fields');
      });
  });

  it('Should fail with code verification not exists', () => {
    return request(application)
      .post('/api/codeverifier')
      .send({
        transaction: 'wrongtransaction',
      })
      .set('Accept', 'application/json')
      .expect(400)
      .then((response) => {
        response.body.code.should.be.equal('code_verification_not_found');
        response.body.message.should.be.equal('Code verification not found');
      });
  });

  it('Should validate code and active user', () => {
    return request(application)
      .post('/api/codeverifier')
      .send({
        transaction: 'abcdefg',
      })
      .set('Accept', 'application/json')
      .expect(201)
      .then((response) => {
        matchJwt(response.body).should.be.equal(true);

        return User.findAll();
      })
      .then((users) => {
        users.length.should.be.equal(1);
        const user = users[0].toJSON();

        user.active.should.be.equal(true);

        return CodeVerification.findAll();
      })
      .then((codeVerifications) => {
        codeVerifications.length.should.be.equal(0);
      });
  });

});
