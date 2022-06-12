import { PoolClient } from "pg";

export interface Migration {
  name: string;
  up(client: PoolClient): Promise<void>
  down(client: PoolClient): Promise<void>
}