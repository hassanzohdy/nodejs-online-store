import { Request as ExpressRequest, Response } from "express";
import { Request as AppRequest } from "./types/request";

export class Request implements AppRequest {
  /**
   * Express Request Instance
   */
  protected request!: ExpressRequest;

  /**
   * Express Response Instance
   */
  protected response!: Response;

  /**
   * Set the request and response of express app
   */
  public setRequest(request: ExpressRequest, response: Response): void {
    this.request = request;
    this.response = response;
  }
}

const request: Request = new Request();

export default request;
