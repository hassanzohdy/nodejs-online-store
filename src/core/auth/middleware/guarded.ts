import { user } from "../guard";
import { authErrors } from "./errors";
import { NextFunction, Request, Response } from "express";

export default async function guarded(
  request: Request,
  response: Response,
  next: NextFunction
) {
  if (!user()) {
    return response.send(authErrors.unguardedResource);
  }

  next();
}
