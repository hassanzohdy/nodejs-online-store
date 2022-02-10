import fs from "@mongez/fs";
import { storage } from "utils/path";
import request from "core/http/request";
import response from "core/http/response";
import { ltrim } from "@mongez/reinforcements";
import { NextFunction, Request, Response } from "express";

export default function staticPath(
  expressRequest: Request,
  expressResponse: Response,
  next: NextFunction
): any {
  if (!fs.exists(storage(ltrim(request.route, "/")))) {
    return response.notFound("File Not Found");
  }

  next();
}
