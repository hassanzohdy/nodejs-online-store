import auth from "core/auth/middleware/auth";
import guarded from "core/auth/middleware/guarded";
import { log } from "core/log";
import middlewareList from "core/router/middleware";
import { NextFunction, Request, Response } from "express";

function logRequest(
  request: Request,
  response: Response,
  next: NextFunction
): any {
  log(request.url);
  log(request.baseUrl);

  next();
}

middlewareList.add([logRequest, auth]);
