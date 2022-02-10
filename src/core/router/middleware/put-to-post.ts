import { NextFunction, Request, Response } from "express";

export default function putToPost(
  request: Request,
  response: Response,
  next: NextFunction
) {
  if (request.body._method !== "PUT") {
    return response.status(404).send("Not Found Request");
  }
  next();
}
