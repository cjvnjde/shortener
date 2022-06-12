import { PoolClient } from "pg";
import { Response, Request } from "express";

export type CommandData = {
  client: PoolClient;
  bode: Request['body'];
  query: Request['query'];
  params: Request['params'];
}

export interface Command {
  execute(data: CommandData, res: Response): void;
}