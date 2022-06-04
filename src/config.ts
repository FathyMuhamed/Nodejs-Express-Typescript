import dotenv from 'dotenv';

dotenv.config();

const {
  PORT,
  NODE_ENV,
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_DB,
  POSTGRES_DB_test,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  BCRTPT_PASSWORD,
  SALT_ROUNDS,
  TOKEN_SECRET,
} = process.env;

export default {
  port: PORT,
  host: POSTGRES_HOST,
  dbPort: POSTGRES_PORT,
  database: NODE_ENV === 'dev' ? POSTGRES_DB : POSTGRES_DB_test,
  user: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  pepper: BCRTPT_PASSWORD,
  salt: SALT_ROUNDS,
  tokensecret: TOKEN_SECRET,
};
