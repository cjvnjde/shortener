import { Environment } from "../interfaces/Environment";

export const environment: Environment = {
  production: true,
  port: 3000,
  webPath: '../web/dist',
  database: {
    user: 'development',
    host: 'development',
    database: 'development',
    password: 'development',
    port: 5432,
  }
};
