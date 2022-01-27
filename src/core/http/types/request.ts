import { Request as ExpressRequest, Response } from "express";
import { IncomingHttpHeaders } from "http";

export type Request = {
  /**
   * Express Request Instance
   */
  baseRequest: ExpressRequest;

  /**
   * Express Response Instance
   */
  baseResponse: Response;

  /**
   * Request headers
   */
  headers: IncomingHttpHeaders;

  /**
   * Request Body / Payload
   */
  payload: any;

  /**
   * Get input from request payload/body otherwise return default value
   */
  body(key: string, defaultValue: any): any;

  /**
   * Request Params List
   */
  params: any;

  /**
   * Get param value from params list, otherwise return default value
   */
  param(key: string, defaultValue: any): any;

  /**
   * Request query string List
   */
  query: any;

  /**
   * Get input from query string
   */
  get(key: string, defaultValue: any): any;

  /**
   * Set the request and response of express app
   */
  setRequest(request: ExpressRequest, response: Response): void;
};
