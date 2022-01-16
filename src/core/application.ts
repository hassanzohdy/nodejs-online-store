import express, { Request, Response } from "express";
import { applicationConfigurations } from "config";
import { log } from "./log";
import chalk from "chalk";

export default function startApplication() {
  const app = express();

  const port: number = applicationConfigurations.port;

  app.get("/", (request: Request, response: Response) => {});

  app.listen(port, () => {
    log(`Server Started!, listening to port ${chalk.bold.cyan(port)}`);
  });
}
