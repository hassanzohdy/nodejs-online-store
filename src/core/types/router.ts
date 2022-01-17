import { Request, Response } from "express";

export type RequestMethod = "get" | "post" | "put" | "delete" | "patch";

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
  handler: (request: Request, response: Response) => void | any;
};
