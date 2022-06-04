import db from '../../database';
import { TUser } from '../../types/user.type';
import UserModel from '../user.model';

const userModel = new UserModel();

describe('User Model', () => {
  describe('Test methods exists', () => {
    it('should have an Get Many Users method', () => {
      expect(userModel.getMany).toBeDefined();
    });
    it('should have an Get one User method', () => {
      expect(userModel.getOne).toBeDefined();
    });
    it('should have an Get Create User  method', () => {
      expect(userModel.create).toBeDefined();
    });
    it('should have an Get Update User  method', () => {
      expect(userModel.updateOne).toBeDefined();
    });
    it('should have an Get Delete User  method', () => {
      expect(userModel.deleteOne).toBeDefined();
    });
  });
  describe('Test User Model logic', () => {
    const user = {
      email: 'test6@test.com',
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

    it('create method should return a new user', async () => {
      const createUser = await userModel.create({
        email: 'test5@test.com',
        user_name: 'testUser',
        first_name: 'test',
        last_name: 'user',
        password: 'test123',
      } as TUser);

      expect(createUser).toEqual({
        id: createUser.id,
        email: 'test5@test.com',
        user_name: 'testUser',
        first_name: 'test',
        last_name: 'user',
      } as TUser);
    });
    it('Get Many method should return All Available users in DB', async () => {
      const users = await userModel.getMany();
      expect(users.length).toBe(2);
    });
    it('Get one  method should return testUser when called with ID', async () => {
      const returnedUser = await userModel.getOne(user.id as string);
      expect(returnedUser.id).toBe(user.id);
      expect(returnedUser.email).toBe(user.email);
      expect(returnedUser.user_name).toBe(user.user_name);
      expect(returnedUser.first_name).toBe(user.first_name);
      expect(returnedUser.last_name).toBe(user.last_name);
    });
    it('Update One method should return a user with edited attributes', async () => {
      const updatedUser = await userModel.updateOne({
        ...user,
        user_name: 'testUser Updated',
        first_name: 'Fathy',
        last_name: 'Muhamed',
      });
      expect(updatedUser.id).toBe(user.id);
      expect(updatedUser.email).toBe(user.email);
      expect(updatedUser.user_name).toBe('testUser Updated');
      expect(updatedUser.first_name).toBe('Fathy');
      expect(updatedUser.last_name).toBe('Muhamed');
    });

    it('update one  method should delete user from DB', async () => {
      const deleteUser = await userModel.deleteOne(user.id as string);
      expect(deleteUser.id).toBe(user.id);
    });
  });
});
