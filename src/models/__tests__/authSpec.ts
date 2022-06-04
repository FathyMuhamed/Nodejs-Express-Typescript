import db from '../../database';
import { TUser } from '../../types/user.type';
import UserModel from '../user.model';

const userModel = new UserModel();

describe('Authentication Module', () => {
  describe('Test methods exists', () => {
    it('should have an Authenticate User method', () => {
      expect(userModel.authenticate).toBeDefined();
    });
  });

  describe('Test Authentication logic', () => {
    const user = {
      email: 'test@test.com',
      user_name: 'testUser',
      first_name: 'test',
      last_name: 'user',
      password: 'test123',
    } as TUser;
    beforeAll(async () => {
      const createUser = await userModel.create(user);
      user.id = createUser.id;
    });

    afterAll(async () => {
      const connection = await db.connect();
      await connection.query('DELETE FROM users;');
      connection.release();
    });

    it('Authenticate method should return the authenticated user', async () => {
      const authenticateUser = await userModel.authenticate(
        user.email,
        user.password as string
      );
      expect(authenticateUser?.email).toBe(user.email);
      expect(authenticateUser?.user_name).toBe(user.user_name);
      expect(authenticateUser?.first_name).toBe(user.first_name);
      expect(authenticateUser?.last_name).toBe(user.last_name);
    });

    it('Authenticate method should return null for wrong credentials', async () => {
      const authenticateUser = await userModel.authenticate(
        'fake@fake.com',
        'fake-password'
      );
      expect(authenticateUser).toBe(null);
    });
  });
});
