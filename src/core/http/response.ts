import { Response as ExpressResponse } from "express";
import { OutgoingHttpHeaders } from "http";

export class Response {
  /**
   * Express response
   */
  protected baseResponse!: ExpressResponse;

  /**
   * Set base response
   */
  public setBaseResponse(response: ExpressResponse): void {
    this.baseResponse = response;
  }

  /**
   * Send response
   */
  public send(data: any, statusCode: number = 200): void {
    this.baseResponse.status(statusCode).send(data);
  }

  /**
   * Send success response
   */
  public success(data: any): any {
    return this.send(data, 200);
  }

  /**
   * Send bad request response
   */
  public badRequest(data: any): void {
    return this.send(data, 400);
  }

  /**
   * Send unauthorized response
   */
  public unauthorized(data: any): void {
    return this.send(data, 401);
  }

  /**
   * Send not found response
   */
  public notFound(data: any): void {
    return this.send(data, 404);
  }

  /**
   * Set/Get current status code
   */
  public statusCode(statusCode?: number): number | Response {
    if (statusCode) {
      this.baseResponse.status(statusCode);
      return this;
    } else {
      return this.baseResponse.statusCode;
    }
  }

  /**
   * Get all headers that will be sent
   */
  public getHeaders(): OutgoingHttpHeaders {
    return this.baseResponse.getHeaders();
  }

  /**
   * Set/Get Response Header
   */
  public header(header: string, value?: any): void | any {
    if (value) {
      this.baseResponse.setHeader(header, value);
    } else {
      return this.baseResponse.getHeader(header);
    }
  }

  /**
   * Remove header
   */
  public removeHeader(header: string): void {
    this.baseResponse.removeHeader(header);
  }

  /**
   * Determine if response has the given header
   */
  public hasHeader(header: string): boolean {
    return this.baseResponse.hasHeader(header);
  }
}

const response: Response = new Response();

export default response;
