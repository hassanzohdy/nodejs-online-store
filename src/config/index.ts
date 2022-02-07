import AES from "crypto-js/aes";
import { AuthConfigurations } from "core/auth";
import { RouterConfigurations } from "core/router";
import { DatabaseConfigurations } from "core/db/types";
import { ApplicationConfigurations } from "core/application";
import { setEncryptionConfigurations } from "@mongez/encryption";
import User from "app/models/User";

const secretKey: string = "mySecret";

export const applicationConfigurations: ApplicationConfigurations = {
  port: 8000,
  baseUrl: "http://localhost",
  appPath: "/store",
  locale: "en",
  date: {
    format: "dd-MM-y",
  },
};

export const routerConfigurations: RouterConfigurations = {
  prefix: "/api",
};

setEncryptionConfigurations({
  key: secretKey,
  driver: AES,
});

export const databaseConfigurations: DatabaseConfigurations = {
  databaseName: "onlineStore",
  username: "root",
  password: "HASAN_2022",
  // password: "BaseRoot",
  port: 27017,
  server: "127.0.0.1",
};

export const authConfigurations: AuthConfigurations = {
  secretKey: secretKey,
  guard: User,
  apiKey:
    "AF2EWQDRGFTY5432WEDFGRTY5R432QWASDFGRT5R432QWSDFGTYR5432WEQSDFEGRT54",
};
