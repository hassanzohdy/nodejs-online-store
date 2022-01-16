import express, { Express } from "express";
import { applicationConfigurations } from "config";
import { log } from "./log";
import chalk from "chalk";
import { Route } from "./types/router";

const routesList: Route[] = [];

export function setRoutes(routes: Route[]) {
  for (const route of routes) {
    routesList.push(route);
  }
}

function setAppRoutes(app: Express) {
  for (let route of routesList) {
    app.get(route.path, route.handler);
  }
}

export default function startApplication() {
  const app = express();

  const port: number = applicationConfigurations.port;

  setAppRoutes(app);

  app.listen(port, () => {
    log(`Server Started!, app path http://localhost:${chalk.bold.cyan(port)}`);
  });
}
