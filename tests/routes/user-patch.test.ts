import 'mocha';
import 'should';
import { start } from '../mocks/app';
import request from 'supertest';
import { Application } from 'express';
import User from '../../lib/models/user.model';

describe('PATCH /api/user/:id', () => {
  let application: Application;

  before(function () {
    application = start();
    return Promise.all([
      User.create({
        id: 1,
        name: 'User 1',
        email: 'test1@example.com',
        password: 'test1',
        active: true,
        source: 'email',
        cellphone: '1122334455'
      }),
      User.create({
        id: 2,
        name: 'User 2',
        email: 'test2@example.com',
        password: 'test2',
        active: true,
        source: 'whatsapp',
        cellphone: '1122334455'
      })
    ]);
  });

  after(() => {
    return User.destroy({where: {}});
  });

  it('Should return 400 with no body', () => {
    return request(application)
      .patch('/api/user/1')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer token_user_0001')
      .expect(400)
      .then((response) => {
        response.body.code.should.be.equal('not_changes_detected');
        response.body.message.should.be.equal('Not changes detected');
      });
  });

  it('Should change source user', () => {
    return request(application)
      .patch('/api/user/1')
      .send({
        source: 'whatsapp',
      })
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer token_user_0001')
      .expect(200)
      .then((response) => {
        response.body.id.should.be.equal(1);
        response.body.name.should.be.equal('User 1');
        response.body.email.should.be.equal('test1@example.com');
        response.body.active.should.be.equal(true);
        response.body.source.should.be.equal('whatsapp');
        response.body.cellphone.should.be.equal(1122334455);
      });
  });

  it('Should change name and cellphone user', () => {
    return request(application)
      .patch('/api/user/2')
      .send({
        name: 'User test',
        cellphone: '1111111111'
      })
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer token_user_0001')
      .expect(200)
      .then((response) => {
        response.body.id.should.be.equal(2);
        response.body.name.should.be.equal('User test');
        response.body.email.should.be.equal('test2@example.com');
        response.body.active.should.be.equal(true);
        response.body.source.should.be.equal('whatsapp');
        response.body.cellphone.should.be.equal(1111111111);
      });
  });
});
