import express, {
  Express,
  NextFunction,
  request,
  Request,
  Response,
} from "express";
import { applicationConfigurations } from "config";
import { log } from "./log";
import chalk from "chalk";
import { Route } from "./types/router";
import multer from "multer";

const routesList: Route[] = [];

export function setRoutes(routes: Route[]) {
  for (const route of routes) {
    routesList.push(route);
  }
}

function setAppRoutes(app: Express) {
  for (let route of routesList) {
    const requestMethod = route.method || "get";

    app[requestMethod](route.path, route.handler);
  }
}

export default function startApplication() {
  const app = express();

  const port: number = applicationConfigurations.port;

  // if the request has no token = 1, return response invalid user token

  const upload = multer();

  // for form data
  app.use(upload.any());
  // for json content
  app.use(express.json());
  // for form-urlencoded
  app.use(express.urlencoded({ extended: true }));

  const auth = (request: Request, response: Response, next: NextFunction) => {
    if (request.query.token != "1") {
      return response.send("Invalid user token");
    }
    // if reached this line, this is valid request
    next();
  };

  // app.use(auth);

  app.get("/test", auth, (request: Request, response: Response) => {
    response.send("Done!");
  });

  setAppRoutes(app);

  app.listen(port, () => {
    log(`Server Started!, app path http://localhost:${chalk.bold.cyan(port)}`);
  });
}
