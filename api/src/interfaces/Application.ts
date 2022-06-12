import { Pool } from "pg";

export interface Application {
  pool: Pool;
  listen: () => void;
}