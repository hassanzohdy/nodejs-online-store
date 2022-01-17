import express, { Express } from "express";
import { applicationConfigurations } from "config";
import { log } from "./log";
import chalk from "chalk";
import { Route } from "./types/router";
import multer from "multer";
import auth from "app/middleware/auth";

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

  const upload = multer();

  // for form data
  app.use(upload.any());

  // for json content
  app.use(express.json());

  // for form-urlencoded
  app.use(express.urlencoded({ extended: true }));

  // auth
  app.use(auth);

  setAppRoutes(app);

  app.listen(port, () => {
    log(`Server Started!, app path http://localhost:${chalk.bold.cyan(port)}`);
  });
}
