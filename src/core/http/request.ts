import cast from "utils/cast";
import { Request as AppRequest } from "./types/request";
import { Request as ExpressRequest } from "express";
import { IncomingHttpHeaders } from "http";
import { RequestMethod } from "../router";
import { Obj, rtrim, toInputName } from "@mongez/reinforcements";
import Is from "@mongez/supportive-is";
import { DynamicObject } from "utils/types";
import Validator from "../validation";
import UploadedFile, { UploadedFileList } from "./UploadedFile";
import { applicationConfigurations, routerConfigurations } from "config";

export class Request implements AppRequest {
  /**
   * Express Request Instance
   */
  public baseRequest!: ExpressRequest;
  /**
   * Request data
   */
  public bodyList: any = {};
  public files: any = {};
  public queryList: any = {};
  public paramsList: any = {};
  public allData: any = {};

  /**
   * Converted files list
   */
  public convertedFilesList!: any;

  /**
   * Request validator
   */
  private validator: Validator | null = null;

  /**
   * Set Request validator
   */
  public setValidator(validator: Validator | null): Request {
    this.validator = validator;
    return this;
  }

  /**
   * Get validated inputs
   */
  public get validated() {
    if (!this.validator) {
      this.validator = new Validator();
    }

    let inputs = this.only(...this.validator.inputsList);

    return {
      get all() {
        return inputs;
      },
      only(...onlyInputs: string[]) {
        return Obj.only(inputs, onlyInputs);
      },
      except(...exceptInputs: string[]) {
        return Obj.except(inputs, exceptInputs);
      },
    };
  }

  /**
   * Set the request and response of express app
   */
  public setRequest(request: ExpressRequest): void {
    this.baseRequest = request;

    this.setDataList(
      request.params,
      request.query,
      request.body,
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
    return cast(Obj.get(this.allData, key)) || this.file(key) || defaultValue;
  }

  /**
   * Get all inputs from query string params and request payload
   */
  public all(): any {
    return Obj.merge(this.dataInputs(), this.convertedFiles);
  }

  /**
   * Get only all data, excluding files
   */
  public dataInputs(): any {
    const inputs: any = {};

    for (let input in this.allData) {
      let inputName = this.adjustInputName(input);
      let inputValue = Is.array(this.allData[input])
        ? this.allData[input].map(cast)
        : cast(this.allData[input]);

      inputs[inputName] = inputValue;
    }

    return inputs;
  }

  /**
   * Adjust input name
   */
  protected adjustInputName(input: string): string {
    return rtrim(input, "[]");
  }

  /**
   * Get all converted files
   */
  public get convertedFiles(): any {
    if (!this.convertedFilesList) {
      this.convertedFilesList = {};
      for (let input in this.files) {
        this.convertedFilesList[this.adjustInputName(input)] = this.file(input);
      }
    }

    return this.convertedFilesList;
  }

  /**
   * Get the given keys only from the request data
   */
  public only(...keys: string[]): any {
    return Obj.only(this.all(), keys);
  }

  /**
   * Get all data except the given inputs
   */
  public except(...keys: string[]): any {
    return Obj.except(this.all(), keys);
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
   * Get request method
   */
  public get method(): string {
    return this.baseRequest.method;
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
   * Get request header
   */
  public header(header: string, defaultValue?: any): any {
    return this.headers[header] ?? defaultValue;
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
   * Get file instance
   */
  public file(field: string): UploadedFile | UploadedFileList | null {
    field = toInputName(field);

    if (Is.array(this.files[field])) {
      return new UploadedFileList(this.files[field]);
    }

    return this.files[field] ? new UploadedFile(this.files[field]) : null;
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
      this.files,
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
    this.paramsList = Obj.clone(params || {});
    this.bodyList = Obj.clone(body || {});
    this.queryList = Obj.clone(query || {});

    this.files = Is.array(files) ? {} : Obj.clone(files || {});

    if (Is.array(files)) {
      for (let file of files || []) {
        this.files[file.fieldname] = file;
      }
    } else {
      // this is important as if the file is uploaded as single value but ends with []
      // then it should be treated as an array
      // for example, image[] with single upload file will be returned as object
      // so we'll convert it into an array
      for (let input in this.files) {
        if (input.endsWith("[]")) {
          let file: any = this.files[input];
          delete this.files[input];
          this.files[this.adjustInputName(input)] = [file];
        }
      }
    }

    // check if the file has any array of files
    for (let key in this.files) {
      if (key.endsWith("[]")) {
        this.files[rtrim(key, "[]")] = this.files[key];
      }
    }

    this.allData =
      allData || Obj.merge(this.paramsList, this.queryList, this.bodyList);
  }

  /**
   * Get request ip
   */
  public get ip(): string {
    return this.baseRequest.ip;
  }

  /**
   * Get user agent
   */
  public get userAgent(): string {
    return this.header("user-agent");
  }

  /**
   * Get current uri
   */
  public get uri(): string {
    return this.baseRequest.url;
  }

  /**
   * Get the route only without the base path or route prefix
   */
  public get route(): string {
    return this.uri
      .replace(new RegExp(`^${applicationConfigurations.appPath}`), "")
      .replace(new RegExp(`^${routerConfigurations.prefix}`), "");
  }

  /**
   * Get Authorization header type value
   */
  public authorization(type: "Bearer" | "Key"): string | null {
    const authorization = this.header("authorization");

    if (!authorization) return null;

    const [authType, authValue] = authorization.split(" ");

    return authType.toLocaleLowerCase() === type.toLocaleLowerCase()
      ? authValue
      : null;
  }
}

const request: Request = new Request();

export default request;
