import express, { NextFunction } from "express";
import { applicationConfigurations, databaseConfigurations } from "config";
import { log } from "../log";
import chalk from "chalk";
import multer from "multer";
import router from "../router";
import database from "../db";
import auth from "../auth/middleware/auth";
import middlewareList from "../router/middleware";

export default function startApplication() {
  const app = express();

  const port: number = applicationConfigurations.port;

  const upload = multer();

  // connect to database
  database.connect(databaseConfigurations);

  // for form data
  app.use(upload.any());

  // for json content
  app.use(express.json());

  // for form-urlencoded
  app.use(express.urlencoded({ extended: true }));

  middlewareList.list().map((middleware) => app.use(middleware));

  router.scan(app);

  app.listen(port, () => {
    log(
      `Server Started!, app path ${
        applicationConfigurations.baseUrl
      }:${chalk.bold.cyan(port)}`
    );
  });
}
