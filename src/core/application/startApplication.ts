import express from "express";
import { log } from "../log";
import router from "../router";
import database from "../db";
import { StartAppOptions } from "./types";
import { applicationConfigurations, databaseConfigurations } from "config";

Error.stackTraceLimit = Infinity;

export default function startApplication(startWith: StartAppOptions) {
  const app = express();

  const port: number = applicationConfigurations.port;

  if (startWith.database) {
    // connect to database
    database.connect(databaseConfigurations);
  }

  if (startWith.router) {
    router.scan(app);

    app.listen(port, () => {
      log(`Server Started!, app path ${applicationConfigurations.baseUrl}`);
    });
  }
}

export function startHttpApplication() {
  return startApplication({
    database: true,
    router: true,
  });
}
