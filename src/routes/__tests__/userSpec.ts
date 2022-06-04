import supertest from 'supertest';
import db from '../../database';
import UserModel from '../../models/user.model';
import { TUser } from '../../types/user.type';
import app from '../index';
const request = supertest(app);

const userModel = new UserModel();
let token = '';

describe('User API Endpoints', () => {
  const user = {
    email: 'pxuee1@pxuee.com',
    user_name: 'testUser',
    first_name: 'Test',
    last_name: 'User',
    password: 'test123',
  } as TUser;

  beforeAll(async () => {
    const createdUser = await userModel.create(user);
    user.id = createdUser.id;
  });

  afterAll(async () => {
    // clean db
    const connection = await db.connect();
    // if you are not using uuid u need to add `\nALTER SEQUENCE users_id_seq RESTART WITH 1;`
    const sql = 'DELETE FROM users;';
    await connection.query(sql);
    connection.release();
  });

  describe('Test Authenticate methods', () => {
    it('should be able to authenticate to get token', async () => {
      const res = await request
        .post('/api/users/authenticate')
        .set('Content-type', 'application/json')
        .send({
          email: 'pxuee1@pxuee.com',
          password: 'test123',
        });
      expect(res.status).toBe(200);
      const { id, email, token: userToken } = res.body.data;
      expect(id).toBe(user.id);
      expect(email).toBe('pxuee1@pxuee.com');
      token = userToken;
    });

    it('should be failed to authenticate with wrong email', async () => {
      const res = await request
        .post('/api/users/authenticate')
        .set('Content-type', 'application/json')
        .send({
          email: 'wrong@email.com',
          password: 'test123',
        });
      expect(res.status).toBe(401);
    });
  });

  describe('Test CRUD API methods', () => {
    it('should create new user', async () => {
      const res = await request
        .post('/api/users/')
        .set('Content-type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({
          email: 'test2@test2.com',
          user_name: 'testUser2',
          first_name: 'Test2',
          last_name: 'User2',
          password: 'test123',
        } as TUser);
      expect(res.status).toBe(200);
      const { email, user_name, first_name, last_name } = res.body.data;
      expect(email).toBe('test2@test2.com');
      expect(user_name).toBe('testUser2');
      expect(first_name).toBe('Test2');
      expect(last_name).toBe('User2');
    });

    it('should get list of users', async () => {
      const res = await request
        .get('/api/users/')
        .set('Content-type', 'application/json')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(2);
    });

    it('should get user info', async () => {
      const res = await request
        .get(`/api/users/${user.id}`)
        .set('Content-type', 'application/json')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.data.user_name).toBe('testUser');
      expect(res.body.data.email).toBe('test@test.com');
    });

    it('should update user info', async () => {
      const res = await request
        .patch(`/api/users/${user.id}`)
        .set('Content-type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...user,
          user_name: 'fathyMuhamed',
          first_name: 'fathy',
          last_name: 'muhamed',
        });
      expect(res.status).toBe(200);

      const { id, email, user_name, first_name, last_name } = res.body.data;
      expect(id).toBe(user.id);
      expect(email).toBe(user.email);
      expect(user_name).toBe('fathyMuhamed');
      expect(first_name).toBe('fathy');
      expect(last_name).toBe('muhamed');
    });

    it('should delete user', async () => {
      const res = await request
        .delete(`/api/users/${user.id}`)
        .set('Content-type', 'application/json')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(user.id);
      expect(res.body.data.user_name).toBe('mohammedelzanaty');
    });
  });
});
