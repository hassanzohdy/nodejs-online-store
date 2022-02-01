import AES from "crypto-js/aes";
import { AuthConfigurations } from "core/auth";
import { RouterConfigurations } from "core/router";
import { DatabaseConfigurations } from "core/db/types";
import { ApplicationConfigurations } from "core/application";
import { setEncryptionConfigurations } from "@mongez/encryption";

const secretKey: string = "mySecret";

export const applicationConfigurations: ApplicationConfigurations = {
  port: 3000,
  apiKey: "thing",
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
  password: "BaseRoot",
  username: "root",
  port: 27017,
  server: "localhost",
};

export const authConfigurations: AuthConfigurations = {
  secretKey: secretKey,
};
