import { ClientConfig } from "pg";

export type Environment = {
  production: boolean;
  port: number;
  webPath: string;
  database: ClientConfig;
}