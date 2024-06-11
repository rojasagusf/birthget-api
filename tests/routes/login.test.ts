import 'mocha';
import 'should';
import { start } from '../mocks/app';
import request from 'supertest';
import { Application } from 'express';
import User from '../../lib/models/user.model';
import bcryptjs from 'bcryptjs';

describe('POST /api/login', () => {
  let application: Application;

  before(async function () {
    application = start();
    return Promise.all([
      User.create({
        id: 1,
        name: 'User 1',
        email: 'test@example.com',
        password: await bcryptjs.hash('12345678', 10)
      })
    ]);
  });

  after(() => {
    return User.destroy({where: {}});
  });

  it('Should fail with user not exists', () => {
    return request(application)
      .post('/api/login')
      .send({
        email: 'test123@example.com',
        password: 'passWrong'
      })
      .set('Accept', 'application/json')
      .expect(400)
      .then((response) => {
        response.body.code.should.be.equal('user_not_exists');
        response.body.message.should.be.equal('User not exists');
      });
  });

  it('Should fail with invalid authentication', () => {
    return request(application)
      .post('/api/login')
      .send({
        email: 'test@example.com',
        password: 'passWrong'
      })
      .set('Accept', 'application/json')
      .expect(400)
      .then((response) => {
        response.body.code.should.be.equal('invalid_authentication');
        response.body.message.should.be.equal('Invalid authentication');
      });
  });

  it('Should login a user', () => {
    return request(application)
      .post('/api/login')
      .send({
        email: 'test@example.com',
        password: '12345678'
      })
      .set('Accept', 'application/json')
      .expect(200)
      .then(async(response) => {
        const isPassword = await bcryptjs.compare('12345678', response.body.password);
        response.body.id.should.be.equal(1);
        response.body.name.should.be.equal('User 1');
        response.body.email.should.be.equal('test@example.com');
        isPassword.should.be.equal(true);
      });
  });
});
