import { IConfig } from './iConfig';

const devConfig: IConfig = {
  ENV: 'development',
  db_conn_string: process.env.JOBS_CONN_STR_LOCAL,
  db_password: process.env.DB_PASSWORD,
};

export default devConfig;
