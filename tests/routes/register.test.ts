import 'mocha';
import 'should';
import { start } from '../mocks/app';
import request from 'supertest';
import { Application } from 'express';
import User from '../../lib/models/user.model';
import bcryptjs from 'bcryptjs';

describe('POST /api/register', () => {
  let application: Application;

  before(function () {
    application = start();
    return Promise.all([
      User.create({
        id: 10,
        name: 'User 1',
        email: 'test@example.com',
        password: 'test'
      })
    ]);
  });

  after(() => {
    return User.destroy({where: {}});
  });

  it('Should fail with user already exists', () => {
    return request(application)
      .post('/api/register')
      .send({
        name: 'User test',
        email: 'test@example.com',
        password: '123456'
      })
      .set('Accept', 'application/json')
      .expect(400)
      .then((response) => {
        response.body.code.should.be.equal('user_already_exists');
        response.body.message.should.be.equal('User already exists');
      });
  });

  it('Should create and register user', () => {
    return request(application)
      .post('/api/register')
      .send({
        name: 'User test',
        email: 'test2@example.com',
        password: '12345678'
      })
      .set('Accept', 'application/json')
      .expect(201)
      .then(async(response) => {
        const isPassword = await bcryptjs.compare('12345678', response.body.password);
        response.body.id.should.be.equal(1);
        response.body.name.should.be.equal('User test');
        response.body.email.should.be.equal('test2@example.com');
        isPassword.should.be.equal(true);
      });
  });
});
