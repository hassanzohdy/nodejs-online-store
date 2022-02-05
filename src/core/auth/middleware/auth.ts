import { authConfigurations } from "config";
import { NextFunction, Request, Response } from "express";
import { guarded } from "../guard";

export default async function auth(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const apiKey = authConfigurations.apiKey;

  const authorization: string | undefined = request.headers.authorization;

  if (authorization === undefined) {
    return response.send("Unauthorized Request,  Code 4001.");
  }

  const [authorizationType, authorizationValue] = authorization.split(" ");

  let authType: string = authorizationType.toLocaleLowerCase().trim();

  let authValue: string = authorizationValue.trim();

  if (!authType || !authValue) {
    return response.send("Unauthorized Request,  Code 4002.");
  }

  if (!["bearer", "key"].includes(authType)) {
    return response.send("Unauthorized Request,  Code 4003.");
  }

  if (authType === "key" && authValue !== apiKey) {
    return response.send("Invalid Api Key, Code 4004.");
  }

  if (authType == "bearer") {
    if (
      !(await guarded({
        accessTokens: authValue,
      }))
    ) {
      return response.send("Unauthorized Request Code 4005.");
    }
  }

  next();
}
