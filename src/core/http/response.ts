import events, { EventSubscription } from "@mongez/events";
import { Response as ExpressResponse } from "express";
import { OutgoingHttpHeaders } from "http";
import { ResponseEvent } from "./types/response";

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
   * Register events to response
   */
  public on(event: ResponseEvent, callback: any): EventSubscription {
    return events.subscribe(`response.${event}`, callback);
  }

  /**
   * Send response
   */
  public send(data: any, statusCode: number = 200): void {
    this.trigger("send", data, statusCode);
    this.baseResponse.status(statusCode).send(data);
  }

  /**
   * Send file
   */
  public sendFile(filePath: string): void {
    this.baseResponse.sendFile(filePath);
  }

  /**
   * Send success response
   */
  public success(data: any): any {
    this.trigger("success", data);
    return this.send(data, 200);
  }

  /**
   * Trigger the given event
   */
  public trigger(event: ResponseEvent, ...args: any[]) {
    return events.trigger(`response.${event}`, ...args);
  }

  /**
   * Send success create response
   */
  public successCreate(data: any): any {
    this.trigger("success", data);
    this.trigger("successCreate", data);
    return this.send(data, 201);
  }

  /**
   * Send bad request response
   */
  public badRequest(data: any): void {
    this.trigger("badRequest", data);
    return this.send(data, 400);
  }

  /**
   * Send unauthorized response
   */
  public unauthorized(data: any): void {
    this.trigger("unauthorized", data);
    return this.send(data, 401);
  }

  /**
   * Send not found response
   */
  public notFound(data: any): void {
    this.trigger("notFound", data);
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
