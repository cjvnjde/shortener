import { Controller } from "./Controller";
import { RedirectCommand } from "../commands/RedirectCommand";

export class RedirectController extends Controller {
  protected init() {
    this.router.get('/', this.execute(new RedirectCommand()))
  }
}