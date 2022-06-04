import bcrypt from 'bcrypt';
import db from '../database';
import { TUser } from '../types/user.type';
import config from '../config';

const hashPassword = (password: string) => {
  const salt = parseInt(config.salt as string, 10);
  return bcrypt.hashSync(`${password}${config.pepper}`, salt);
};

class UserModel {
  //create
  async create(user: TUser): Promise<TUser> {
    try {
      //open connection with db
      const connection = await db.connect();
      const sql = ` INSERT INTO users(email,user_name,first_name,last_name,password)
          values($1,$2,$3,$4,$5) returning id, email, user_name, first_name, last_name
       `;
      //run query
      const result = await connection.query(sql, [
        user.email,
        user.user_name,
        user.first_name,
        user.last_name,
        hashPassword(user.password),
      ]);
      // release connection
      connection.release();
      //return create user
      return result.rows[0];
    } catch (error) {
      throw new Error(
        `unable to create ${user.user_name} : ${(error as Error).message} `
      );
    }
  }
  //get all users
  async getMany(): Promise<TUser[]> {
    try {
      const connection = await db.connect();
      const sql = `
        SELECT id, email, user_name, first_name, last_name from users
      `;
      //run query
      const result = await connection.query(sql);
      // release connection
      connection.release();
      return result.rows;
    } catch (error) {
      throw new Error(`Error at retrieving users ${(error as Error).message} `);
    }
  }
  //get specific user
  async getOne(id: string): Promise<TUser> {
    try {
      const connection = await db.connect();
      const sql = `
        SELECT id, email, user_name, first_name, last_name FROM users WHERE id=($1)
      `;
      const result = await connection.query(sql, [id]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Could not find user ${id} ${(error as Error).message} `);
    }
  }
  //update user
  async updateOne(user: TUser): Promise<TUser> {
    try {
      const connection = await db.connect();
      const sql = ` UPDATE users
        SET email=$1,  user_name=$2, first_name=$3, last_name=$4, password=$5
        WHERE id=$6
        RETURNING  id, email, user_name, first_name, last_name
      `;
      const result = await connection.query(sql, [
        user.email,
        user.user_name,
        user.first_name,
        user.last_name,
        hashPassword(user.password),
        user.id,
      ]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Could not update user ${user.user_name} ${(error as Error).message} `
      );
    }
  }
  //delete user
  async deleteOne(id: string): Promise<TUser> {
    try {
      const connection = await db.connect();
      const sql = ` DELETE FROM users
        WHERE id=($1)
        RETURNING id, email, user_name, first_name, last_name
      `;
      const result = await connection.query(sql, [id]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Could not delete user ${id} ${(error as Error).message} `
      );
    }
  }
  //authenticate user
  async authenticate(email: string, password: string): Promise<TUser | null> {
    try {
      const connection = await db.connect();
      const sql = ` SELECT password FROM users WHERE email=$1`;
      const result = await connection.query(sql, [email]);
      if (result.rows.length) {
        const { password: hashPassword } = result.rows[0];
        const isPasswordValid = bcrypt.compareSync(
          `${password}${config.pepper}`,
          hashPassword
        );
        if (isPasswordValid) {
          const userInfo = await connection.query(
            'SELECT id, email, user_name, first_name, last_name FROM users WHERE email=($1)',
            [email]
          );
          return userInfo.rows[0];
        }
      }
      connection.release();
      return null;
    } catch (error) {
      throw new Error(`unable to login ${email}  ${(error as Error).message} `);
    }
  }
}

export default UserModel;
