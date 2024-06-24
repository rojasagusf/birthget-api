import 'mocha';
import 'should';
import { start } from '../mocks/app';
import request from 'supertest';
import { Application } from 'express';
import User from '../../lib/models/user.model';

describe('POST /api/register', () => {
  let application: Application;
  const matchJwt = (token: string) => {
    const jwtRegex = /^[\w-]*\.[\w-]*\.[\w-]*$/;
    return jwtRegex.test(token);
  };

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

  it('Should fail with no body', () => {
    return request(application)
      .post('/api/register')
      .send({})
      .set('Accept', 'application/json')
      .expect(400)
      .then((response) => {
        response.body.code.should.be.equal('invalid_fields');
      });
  });

  it('Should fail with invalid fields in body', () => {
    return request(application)
      .post('/api/register')
      .send({
        name: 'User 1',
        email: 'test123@example.com',
        password: '123'
      })
      .set('Accept', 'application/json')
      .expect(400)
      .then((response) => {
        response.body.code.should.be.equal('invalid_fields');
      });
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
        matchJwt(response.body).should.be.equal(true);

        return User.findAll();
      })
      .then((users) => {
        users.length.should.be.equal(2);
        const userCreated = users[1].toJSON();

        userCreated.name.should.be.equal('User test');
        userCreated.email.should.be.equal('test2@example.com');
        userCreated.active.should.be.equal(false);
      });
  });
});
