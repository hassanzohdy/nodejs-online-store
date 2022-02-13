import AES from "crypto-js/aes";
import { AuthConfigurations } from "core/auth";
import { RouterConfigurations, uploadsUrl, url } from "core/router";
import { DatabaseConfigurations } from "core/db/types";
import { ApplicationConfigurations } from "core/application";
import { setEncryptionConfigurations } from "@mongez/encryption";
import { env } from "core/dot-env";
import User from "app/users/models/User";
import { storage } from "utils/path";
import { StorageConfigurations } from "core/filesystem/types";

const secretKey: string = env("APP_SECRET_KEY");

export const applicationConfigurations: ApplicationConfigurations = {
  port: env("APP_PORT"),
  baseUrl: env("APP_BASE_URL"),
  appPath: env("APP_BASE_PATH"),
  locale: env("APP_DEFAULT_LOCALE_CODE"),
  date: {
    format: "dd-MM-y",
  },
};

export const routerConfigurations: RouterConfigurations = {
  prefix: env("ROUTER_PREFIX"),
  putToPost: true,
};

setEncryptionConfigurations({
  key: secretKey,
  driver: AES,
});

export const databaseConfigurations: DatabaseConfigurations = {
  port: env("DB_PORT"),
  server: env("DB_HOST"),
  databaseName: env("DB_NAME"),
  username: env("DB_USERNAME"),
  // password: "HASAN_2022",
  // password: "BaseRoot",
  password: env("DB_PASSWORD"),
};

export const authConfigurations: AuthConfigurations = {
  secretKey: secretKey,
  guard: User,
  apiKey: env("APP_API_KEY"),
  // apps: {
  //   admin: {
  //     prefix: '/admin',
  //     guard: User,
  //   }
  // }
};

export const storageConfigurations: StorageConfigurations = {
  root: storage(),
  uploads: storage("uploads"),
  temp: storage("tmp"),
  uploadsRoute: "/uploads",
  uploadsUrl: uploadsUrl,
};
