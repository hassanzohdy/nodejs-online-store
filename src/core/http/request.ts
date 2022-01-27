import cast from "utils/cast";
import { Request as AppRequest } from "./types/request";
import { Request as ExpressRequest, Response } from "express";
import { IncomingHttpHeaders } from "http";
import { RequestMethod } from "../router";
import { Obj } from "@mongez/reinforcements";

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
    return cast(this.query[key] || defaultValue);
  }

  /**
   * Get value from either query string params or request payload
   */
  public input(key: string, defaultValue: any = null): any {
    return this.get(key) || this.body(key, defaultValue);
  }

  /**
   * Get all inputs from query string params and request payload
   */
  public all(): any {
    return { ...this.query, ...this.payload };
  }

  /**
   * Get the given keys only from the request data
   */
  public only(...keys: string[]): any {
    return Obj.only(this.all(), keys);
  }

  /**
   * Get input from query string
   */
  public param(key: string, defaultValue: any = null): any {
    return cast(this.params[key] || defaultValue);
  }

  /**
   * Get input from request payload/body otherwise return default value
   */
  public body(key: string, defaultValue: any = null): any {
    return cast(this.payload[key] || defaultValue);
  }

  /**
   * Determine whether current request method is matching the given request method
   */
  public is(method: RequestMethod): boolean {
    return this.baseRequest.method === method;
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
