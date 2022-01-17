import express, { Express, Request, Response } from "express";
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

  const upload = multer();

  app.post("/upload", upload.any(), (request: Request, response: Response) => {
    console.log(request.files);

    response.send("Uploaded!");
  });

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  setAppRoutes(app);

  app.listen(port, () => {
    log(`Server Started!, app path http://localhost:${chalk.bold.cyan(port)}`);
  });
}
