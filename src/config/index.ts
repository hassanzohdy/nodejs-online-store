import { RouterConfigurations } from "core/router";
import { ApplicationConfigurations } from "core/application";

export const applicationConfigurations: ApplicationConfigurations = {
  port: 3000,
  apiKey: "thing",
};

export const routerConfigurations: RouterConfigurations = {
  prefix: "/api",
};
