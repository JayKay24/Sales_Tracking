import { IConfig } from './iConfig';

const prodConfig: IConfig = {
  ENV: 'production',
  db_conn_string: process.env.JOBS_CONN_STR_LOCAL,
  db_password: process.env.DB_PASSWORD,
};

export default prodConfig;
