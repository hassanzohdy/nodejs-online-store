import { Request as ExpressRequest, Response } from "express";
import { IncomingHttpHeaders } from "http";
import { RequestMethod } from "../../router";

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
  body(key: string, defaultValue?: any): any;

  /**
   * Determine whether current request method is matching the given request method
   */
  is(method: RequestMethod): boolean;

  /**
   * Get value from either query string params or request payload
   */
  input(key: string, defaultValue?: any): any;

  /**
   * Get all inputs from query string params and request payload
   */
  all(): any;

  /**
   * Get the given keys only from the request data
   */
  only(...keys: string[]): any;

  /**
   * Request Params List
   */
  params: any;

  /**
   * Get param value from params list, otherwise return default value
   */
  param(key: string, defaultValue?: any): any;

  /**
   * Request query string List
   */
  query: any;

  /**
   * Get input from query string
   */
  get(key: string, defaultValue?: any): any;

  /**
   * Set the request and response of express app
   */
  setRequest(request: ExpressRequest, response: Response): void;
};
