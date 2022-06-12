import { Environment } from "../interfaces/Environment";

export const environment: Environment = {
  production: false,
  port: 3000,
  webPath: '../web/dist',
  database: {
    user: 'development',
    host: 'localhost',
    database: 'shortener',
    password: 'development',
    port: 5432,
  }
};
