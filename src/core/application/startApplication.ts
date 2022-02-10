import express from "express";
import { log } from "../log";
import chalk from "chalk";
import router from "../router";
import database from "../db";
import { applicationConfigurations, databaseConfigurations } from "config";

export default function startApplication() {
  const app = express();

  const port: number = applicationConfigurations.port;

  // connect to database
  database.connect(databaseConfigurations);

  router.scan(app);

  app.listen(port, () => {
    log(
      `Server Started!, app path ${
        applicationConfigurations.baseUrl
      }:${chalk.bold.cyan(port)}`
    );
  });
}
