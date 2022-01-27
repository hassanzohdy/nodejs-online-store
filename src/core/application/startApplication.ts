import express from "express";
import { applicationConfigurations } from "config";
import { log } from "../log";
import chalk from "chalk";
import multer from "multer";
import auth from "app/middleware/auth";
import router from "../router";
import database from "../db";

export default function startApplication() {
  const app = express();

  const port: number = applicationConfigurations.port;

  const upload = multer();

  database.connect();

  // for form data
  app.use(upload.any());

  // for json content
  app.use(express.json());

  // for form-urlencoded
  app.use(express.urlencoded({ extended: true }));

  // auth
  app.use(auth);

  router.scan(app);

  app.listen(port, () => {
    log(`Server Started!, app path http://localhost:${chalk.bold.cyan(port)}`);
  });
}
