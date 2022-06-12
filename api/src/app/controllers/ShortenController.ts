import { Controller } from "./Controller";
import { ShortenCommand } from "../commands/ShortenCommand";

export class ShortenController extends Controller {
  protected init() {
    this.router.get('/', this.execute(new ShortenCommand()))
  }
}