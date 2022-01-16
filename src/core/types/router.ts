import { Request, Response } from "express";

export type Route = {
  /**
   * Route path
   */
  path: string;
  /**
   * Route handler
   */
  handler: (request: Request, response: Response) => void | any;
};
