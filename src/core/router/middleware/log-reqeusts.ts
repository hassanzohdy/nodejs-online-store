import { NextFunction, Request, Response } from "express";
import { log } from "core/log";

export default function logRequest(
  request: Request,
  response: Response,
  next: NextFunction
): any {
  log(request.url);
  log(request.baseUrl);

  next();
}
