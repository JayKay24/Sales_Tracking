import { IConfig } from './iConfig';

const devConfig: IConfig = {
  ENV: 'development',
  db_conn_string: process.env.CONN_STR_LOCAL,
  jwt_secret: process.env.JWT_SECRET,
  db_password: process.env.DB_PASSWORD,
};

export default devConfig;
