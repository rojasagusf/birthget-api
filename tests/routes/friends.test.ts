import 'mocha';
import 'should';
import { start } from '../mocks/app';
import request from 'supertest';
import { Application } from 'express';
import User from '../../lib/models/user.model';
import bcryptjs from 'bcryptjs';
import Friend from '../../lib/models/friend.model';

describe('FRIENDS CRUD', () => {
  let application: Application;

  before(async function () {
    application = start();
    return Promise.all([
      User.create({
        id: 1,
        name: 'User 1',
        email: 'test@example.com',
        password: await bcryptjs.hash('12345678', 10),
        cellphone: 1122334455
      })
    ]);
  });

  beforeEach(() => {
    return Promise.all([
      Friend.create({
        id: 1,
        name: 'Friend 1',
        birthdate: new Date('2001/01/30'),
        userId: 1
      }),
      Friend.create({
        id: 2,
        name: 'Friend 2',
        birthdate: new Date('1999/06/01'),
        userId: 1
      }),
      Friend.create({
        id: 3,
        name: 'Friend 3',
        birthdate: new Date('1977/03/04'),
        userId: 1
      }),
    ]);
  });

  after(() => {
    return Friend.destroy({where: {}})
      .then(() => {
        return User.destroy({where: {}});
      });
  });

  afterEach(() => {
    return Promise.all([
      Friend.destroy({where: {}})
    ]);
  });

  describe('GET /api/friends', () => {

    it('Should fail withouth token', () => {
      return request(application)
        .get('/api/friends')
        .set('Accept', 'application/json')
        .expect(401)
        .then((response) => {
          response.body.code.should.be.equal('unauthorized');
          response.body.message.should.be.equal('Unauthorized');
        });
    });

    it('Should get all friends for user with id 1', () => {
      return request(application)
        .get('/api/friends')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer token_user_0001')
        .expect(200)
        .then((response) => {
          response.body.length.should.be.equal(3);
          response.body.should.containDeep([
            {
              id: 1,
              name: 'Friend 1',
              birthdate: '2001-01-30',
              userId: 1
            },
            {
              id: 2,
              name: 'Friend 2',
              birthdate: '1999-06-01',
              userId: 1
            },
            {
              id: 3,
              name: 'Friend 3',
              birthdate: '1977-03-04',
              userId: 1
            }
          ]);
        });
    });

    it('Should get 1 friend for user with id 1', () => {
      return request(application)
        .get('/api/friends')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer token_user_0001')
        .query({
          limit: 1
        })
        .expect(200)
        .then((response) => {
          response.body.length.should.be.equal(1);
          response.body.should.containDeep([
            {
              id: 1,
              name: 'Friend 1',
              userId: 1
            },
          ]);
        });
    });

    it('Should get 1 friend in search query for user with id 1', () => {
      return request(application)
        .get('/api/friends')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer token_user_0001')
        .query({
          search: 'Friend 2'
        })
        .expect(200)
        .then((response) => {
          response.body.length.should.be.equal(1);
          response.body.should.containDeep([
            {
              id: 2,
              name: 'Friend 2',
              userId: 1
            },
          ]);
        });
    });

    it('Should get 1 friend with skip 1 and limit 1 for user with id 1', () => {
      return request(application)
        .get('/api/friends')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer token_user_0001')
        .query({
          limit: 1,
          skip: 1
        })
        .expect(200)
        .then((response) => {
          response.body.length.should.be.equal(1);
          response.body.should.containDeep([
            {
              id: 2,
              name: 'Friend 2',
              birthdate: '1999-06-01',
              userId: 1
            },
          ]);
        });
    });
  });

  describe('GET /api/friends/:id', () => {

    it('Should fail withouth token', () => {
      return request(application)
        .get('/api/friends/1')
        .set('Accept', 'application/json')
        .expect(401)
        .then((response) => {
          response.body.code.should.be.equal('unauthorized');
          response.body.message.should.be.equal('Unauthorized');
        });
    });

    it('Should fail with friend not exists', () => {
      return request(application)
        .get('/api/friends/10')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer token_user_0001')
        .expect(400)
        .then((response) => {
          response.body.code.should.be.equal('friend_not_found');
          response.body.message.should.be.equal('Friend not found');
        });
    });

    it('Should get a friend by id', () => {
      return request(application)
        .get('/api/friends/1')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer token_user_0001')
        .expect(200)
        .then((response) => {
          response.body.id.should.be.equal(1);
          response.body.name.should.be.equal('Friend 1');
          response.body.userId.should.be.equal(1);
          response.body.birthdate.should.be.equal('2001-01-30');
        });
    });
  });

  describe('POST /api/friends', () => {

    it('Should fail withouth token', () => {
      return request(application)
        .post('/api/friends')
        .send({})
        .set('Accept', 'application/json')
        .expect(401)
        .then((response) => {
          response.body.code.should.be.equal('unauthorized');
          response.body.message.should.be.equal('Unauthorized');
        });
    });

    it('Should fail withouth fields in body', () => {
      return request(application)
        .post('/api/friends')
        .send({})
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer token_user_0001')
        .expect(400)
        .then((response) => {
          response.body.code.should.be.equal('invalid_fields');
        });
    });

    it('Should create a friend', () => {
      return request(application)
        .post('/api/friends')
        .send({
          name: 'Friend POST',
          birthdate: new Date('2000/01/01')
        })
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer token_user_0001')
        .expect(201)
        .then((response) => {
          response.body.name.should.be.equal('Friend POST');
          response.body.userId.should.be.equal(1);
          response.body.birthdate.should.be.equal('2000-01-01');

          return Friend.findAll();
        })
        .then((allFriends) => {
          allFriends.length.should.be.equal(4);
        });
    });
  });

  describe('DELETE /api/friends/:id', () => {

    it('Should fail withouth token', () => {
      return request(application)
        .delete('/api/friends/1')
        .set('Accept', 'application/json')
        .expect(401)
        .then((response) => {
          response.body.code.should.be.equal('unauthorized');
          response.body.message.should.be.equal('Unauthorized');
        });
    });

    it('Should fail with invalid friend id', () => {
      return request(application)
        .delete('/api/friends/10')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer token_user_0001')
        .expect(400)
        .then((response) => {
          response.body.code.should.be.equal('friend_not_exists');
          response.body.message.should.be.equal('Friend not exists');
        });
    });

    it('Should delete a friend', () => {
      return request(application)
        .delete('/api/friends/2')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer token_user_0001')
        .expect(200)
        .then(() => {
          return Friend.findAll();
        })
        .then((friendsFound) => {
          friendsFound.length.should.be.equal(2);
          friendsFound.should.containDeep([
            {
              id: 3,
              name: 'Friend 3',
              birthdate: '1977-03-04',
              userId: 1
            },
            {
              id: 1,
              name: 'Friend 1',
              birthdate: '2001-01-30',
              userId: 1
            }
          ]);
        });
    });
  });

  describe('PATCH /api/friends/:id', () => {

    it('Should fail withouth token', () => {
      return request(application)
        .patch('/api/friends/1')
        .send({})
        .set('Accept', 'application/json')
        .expect(401)
        .then((response) => {
          response.body.code.should.be.equal('unauthorized');
          response.body.message.should.be.equal('Unauthorized');
        });
    });

    it('Should fail withouth fields in body', () => {
      return request(application)
        .patch('/api/friends/1')
        .send({})
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer token_user_0001')
        .expect(400)
        .then((response) => {
          response.body.code.should.be.equal('invalid_fields');
        });
    });

    it('Should fail withouth fields in body', () => {
      return request(application)
        .patch('/api/friends/1')
        .send({
          name: 'Friend 4 updated',
          birthdate: new Date('2001/01/01'),
        })
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer token_user_0001')
        .expect(200)
        .then((response) => {
          response.body.id.should.be.equal(1);
          response.body.name.should.be.equal('Friend 4 updated');
          response.body.birthdate.should.be.equal('2001-01-01');
        });
    });
  });
});
