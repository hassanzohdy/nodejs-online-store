import { NextFunction, Request, Response } from "express";

export type RequestMethod = "get" | "post" | "put" | "delete" | "patch";

/**
 * Request handler
 */
export type RequestHandler = (request: Request, response: Response) => any;

/**
 * Request middleware
 */
export type RequestMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => any;

export type Route = {
  /**
   * Route path
   */
  path: string;
  /**
   * Request method
   *
   * @default get
   */
  method: RequestMethod;
  /**
   * Route handler
   */
  handler: (request: Request, response: Response) => void | any;
  /**
   * Route middleware
   */
  middleware?: RequestMiddleware[];
};
