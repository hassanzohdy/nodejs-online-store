import { NextFunction, Request, Response } from "express";
import { log } from "core/log";

export default function logRequest(
  request: Request,
  response: Response,
  next: NextFunction
): any {
  log(request.method.toUpperCase() + " " + request.url);
  next();
}
