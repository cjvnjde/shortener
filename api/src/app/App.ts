import { Application } from "../interfaces/Application";
import { Environment } from "../interfaces/Environment";
import express from "express";
import cors from "cors";
import { Express } from "express";
import * as http from "http";
import { Server } from "http";
import { ShortenController } from "./controllers/ShortenController";
import { Pool } from "pg";
import { RedirectController } from "./controllers/RedirectController";
import bodyParser from "body-parser";

export class App implements Application {
  private readonly environment: Environment;
  protected readonly expressApp: Express;
  public readonly pool: Pool;
  private server: Server | null = null;

  constructor(environment: Environment) {
    this.environment = environment;
    this.expressApp = express();
    this.pool = new Pool(this.environment.database);
    this.init();
  }

  init() {
    this.expressApp.use(cors());
    this.expressApp.use(bodyParser.json());

    this.expressApp.use(express.static(this.environment.webPath));
    this.expressApp.use('/api/shorten', (new ShortenController(this)).router)
    this.expressApp.use('/:id', (new RedirectController(this)).router)
  }

  listen() {
    this.server = http.createServer(this.expressApp).listen(this.environment.port)
  }
}