import { NextFunction, Request as ExpressRequest } from "express";
import { Response } from "../../http/response";
import { Request as AppRequest } from "../../http/types/request";

export type RequestMethod = "get" | "post" | "put" | "delete" | "patch";

/**
 * Request handler
 */
export type RequestHandler = (request: AppRequest, response: Response) => any;

/**
 * Request middleware
 */
export type RequestMiddleware = (
  request: ExpressRequest,
  response: Response,
  next: NextFunction
) => any;

export type RouterGroup = {
  /**
   * Route prefix for all listed routes
   */
  prefix?: string;
  /**
   * Request method for all routes in this group
   *
   * @default get
   */
  method?: RequestMethod;
  /**
   * Middleware list for listed routes
   */
  middleware?: RequestMiddleware[];
  /**
   * Routes list
   */
  routes: Route[];
};

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
  method?: RequestMethod;
  /**
   * Route handler
   */
  handler: (request: AppRequest, response: Response) => void | any;
  /**
   * Route middleware
   */
  middleware?: RequestMiddleware[];
};

export type RouterConfigurations = {
  /**
   * Set base path prefix for all routes
   */
  prefix?: string;
};
