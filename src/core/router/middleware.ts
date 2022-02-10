import Is from "@mongez/supportive-is";
import { RequestMiddleware } from "./types";

let storedMiddleware: any = {
  all: [],
  post: [],
  get: [],
  put: [],
  file: [], // for static files requests
  patch: [],
  delete: [],
  options: [],
};

const middlewareList = {
  add(middleware: any[]): void {
    this.anyOf("all", middleware);
  },
  post(middleware: any[]): void {
    return this.anyOf("post", middleware);
  },
  put(middleware: any[]): void {
    return this.anyOf("put", middleware);
  },
  file(middleware: any[]): void {
    return this.anyOf("file", middleware);
  },
  patch(middleware: any[]): void {
    return this.anyOf("patch", middleware);
  },
  delete(middleware: any[]): void {
    return this.anyOf("delete", middleware);
  },
  options(middleware: any[]): void {
    return this.anyOf("options", middleware);
  },
  writing(middleware: any[]): void {
    this.anyOf(["post", "put", "patch"], middleware);
  },
  anyOf(type: string | string[], middleware: any[]): void {
    if (Is.array(type)) {
      return (type as string[]).forEach((type) => this.anyOf(type, middleware));
    }

    storedMiddleware[type as string] = [
      ...storedMiddleware[type],
      ...middleware,
    ];
  },
  list(type?: string): any {
    return type ? storedMiddleware[type] : storedMiddleware;
  },
};

export default middlewareList;
