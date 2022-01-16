import express, { Request, Response } from "express";
import { applicationConfigurations } from "config";
import { log } from "./log";
import chalk from "chalk";
import appRoutes from "../app";

export default function startApplication() {
  const app = express();

  const port: number = applicationConfigurations.port;

  appRoutes(app);

  app.listen(port, () => {
    log(`Server Started!, app path http://localhost:${chalk.bold.cyan(port)}`);
  });
}
