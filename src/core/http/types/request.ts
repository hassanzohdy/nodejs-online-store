import { Request as ExpressRequest, Response } from "express";

export type Request = {
  /**
   * Set the request and response of express app
   */
  setRequest(request: ExpressRequest, response: Response): void;
};
