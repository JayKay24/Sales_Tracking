export interface IConfig {
  port?: number;
  db_conn_string?: string;
  broker_conn_string?: string;
  jwt_secret?: string;
  db_password?: string;
  ENV?: string;
}
