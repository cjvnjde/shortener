import { environment } from "./environments/environment";
import { App } from "./app/App";

const application = new App(environment)

application.listen()
