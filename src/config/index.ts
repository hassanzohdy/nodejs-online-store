import { RouterConfigurations } from "core/router";
import { ApplicationConfigurations } from "core/application";
import { DatabaseConfigurations } from "core/db/types";

export const applicationConfigurations: ApplicationConfigurations = {
  port: 3000,
  apiKey: "thing",
};

export const routerConfigurations: RouterConfigurations = {
  prefix: "/api",
};

export const databaseConfigurations: DatabaseConfigurations = {
  databaseName: "onlineStore",
  password: "BaseRoot",
  username: "root",
  port: 27017,
  server: "localhost",
};
