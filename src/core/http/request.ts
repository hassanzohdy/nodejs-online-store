import cast from "utils/cast";
import { Request as AppRequest } from "./types/request";
import { Request as ExpressRequest } from "express";
import { IncomingHttpHeaders } from "http";
import { RequestMethod } from "../router";
import { Obj } from "@mongez/reinforcements";
import Is from "@mongez/supportive-is";
import { DynamicObject } from "utils/types";

export class Request implements AppRequest {
  /**
   * Express Request Instance
   */
  public baseRequest!: ExpressRequest;
  /**
   * Request data
   */
  public bodyList: any = {};
  public filesList: any = {};
  public queryList: any = {};
  public paramsList: any = {};
  public allData: any = {};

  /**
   * Set the request and response of express app
   */
  public setRequest(request: ExpressRequest): void {
    this.baseRequest = request;
    this.setDataList(
      request.params,
      request.query,
      request.params,
      request.files
    );
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
    return cast(Obj.get(this.allData, key, defaultValue));
  }

  /**
   * Get all inputs from query string params and request payload
   */
  public all(): any {
    const inputs: any = { ...this.allData };

    for (let input in inputs) {
      inputs[input] = cast(inputs[input]);
    }

    return inputs;
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
    return this.bodyList;
  }

  /**
   * Request Params List
   */
  public get params(): any {
    return this.paramsList;
  }

  /**
   * Request query string List
   */
  public get query(): any {
    return this.queryList;
  }

  /**
   * Get http request header
   */
  public get headers(): IncomingHttpHeaders {
    return this.baseRequest.headers;
  }

  /**
   * Set input value
   */
  public set(key: string | DynamicObject, value?: any): Request {
    if (Is.plainObject(key)) {
      this.allData = Obj.merge(this.allData, key);
    } else {
      Obj.set(this.allData, key as string, value);
    }
    return this;
  }

  /**
   * Clone the request instance
   */
  public get clone(): Request {
    const request = new Request();

    request.setRequest(this.baseRequest);
    request.setDataList(
      this.paramsList,
      this.queryList,
      this.bodyList,
      this.filesList,
      this.allData
    );

    return request;
  }

  /**
   * Set body data
   */
  public setDataList(
    params: any,
    query: any,
    body: any,
    files: any,
    allData?: any
  ) {
    this.paramsList = Obj.clone(params);
    this.bodyList = Obj.clone(body);
    this.queryList = Obj.clone(query);
    this.filesList = Obj.clone(files);
    this.allData =
      allData ||
      Obj.merge(this.paramsList, this.queryList, this.bodyList, this.filesList);
  }
}

const request: Request = new Request();

export default request;
