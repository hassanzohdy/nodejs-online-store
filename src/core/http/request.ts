import { Request as AppRequest } from "./types/request";
import { Request as ExpressRequest, Response } from "express";
import { IncomingHttpHeaders } from "http";

export class Request implements AppRequest {
  /**
   * Express Request Instance
   */
  public baseRequest!: ExpressRequest;

  /**
   * Express Response Instance
   */
  public baseResponse!: Response;

  /**
   * Set the request and response of express app
   */
  public setRequest(request: ExpressRequest, response: Response): void {
    this.baseRequest = request;
    this.baseResponse = response;
  }

  /**
   * Get input from query string
   */
  public get(key: string, defaultValue: any = null): any {
    return this.query[key] || defaultValue;
  }

  /**
   * Get input from query string
   */
  public param(key: string, defaultValue: any = null): any {
    return this.params[key] || defaultValue;
  }

  /**
   * Get input from request payload/body otherwise return default value
   */
  public body(key: string, defaultValue: any = null): any {
    return this.payload[key] || defaultValue;
  }

  /**
   * Get http request payload
   */
  public get payload(): any {
    return this.baseRequest.body;
  }

  /**
   * Request Params List
   */
  public get params(): any {
    return this.baseRequest.params;
  }

  /**
   * Request query string List
   */
  public get query(): any {
    return this.baseRequest.query;
  }

  /**
   * Get http request header
   */
  public get headers(): IncomingHttpHeaders {
    return this.baseRequest.headers;
  }
}

const request: Request = new Request();

export default request;
