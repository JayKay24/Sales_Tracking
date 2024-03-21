import { IConfig } from './iConfig';

const prodConfig: IConfig = {
  ENV: 'development',
  db_conn_string: process.env.CONN_STR_LOCAL,
  port: Number(process.env.PORT),
  jwt_secret: process.env.JWT_SECRET,
  db_password: process.env.DB_PASSWORD,
};

export default prodConfig;
