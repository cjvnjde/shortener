import express, { NextFunction, RequestHandler, Router, Request, Response } from "express";
import { Application } from "../../interfaces/Application";
import { Command } from "../../interfaces/Command";

export abstract class Controller {
  private readonly _router: Router;
  
  constructor(protected application: Application) {
    this._router = express.Router({ mergeParams: true });
    
    this.init()
  }
  
  protected abstract init(): void;
  
  public get router(): Router {
    return this._router;
  }
  
  protected execute(command: Command): RequestHandler {
    return async (req: Request, res: Response) => {
      const client = await this.application.pool.connect()

      try {
        await client.query('BEGIN')
  
        command.execute({
          client,
          bode: req.body,
          query: req.query,
          params: req.params,
        }, res)

        await client.query('COMMIT')
      } catch (e) {
        await client.query('ROLLBACK')
        throw e
      } finally {
        client.release()
      }
    }
  }
}