import { authConfigurations } from "config";
import { NextFunction, Request, Response } from "express";
import { attempt } from "../guard";
import { authErrors } from "./errors";

export default async function auth(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const apiKey = authConfigurations.apiKey;

  const authorization: string | undefined = request.headers.authorization;

  if (authorization === undefined) {
    return response.send(authErrors.missingAuthorization);
  }

  const [authorizationType, authorizationValue] = authorization.split(" ");

  let authType: string = authorizationType.toLocaleLowerCase().trim();

  let authValue: string = authorizationValue.trim();

  if (!authType || !authValue) {
    return response.send(authErrors.missingAuthTypeOrValue);
  }

  if (!["bearer", "key"].includes(authType)) {
    return response.send(authErrors.invalidAuthType);
  }

  if (authType === "key" && authValue !== apiKey) {
    return response.send(authErrors.invalidApiKey);
  }

  if (authType == "bearer") {
    if (
      !(await attempt({
        accessTokens: authValue,
      }))
    ) {
      return response.send(authErrors.invalidUser);
    }
  }

  next();
}
