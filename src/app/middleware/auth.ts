import { applicationConfigurations } from "config";
import { NextFunction, Request, Response } from "express";

export default function auth(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const apiKey = applicationConfigurations.apiKey;

  const authorization: string | undefined = request.headers.authorization;

  if (authorization === undefined) {
    return response.send("Unauthorized Request.");
  }

  const [authorizationType, authorizationValue] = authorization.split(" ");

  if (authorizationType.toLocaleLowerCase() !== "key") {
    return response.send("Unauthorized Request Type.");
  }

  if (authorizationValue !== apiKey) {
    return response.send("Invalid Api Key.");
  }

  next();
}
