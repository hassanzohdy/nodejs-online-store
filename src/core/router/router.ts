import {
  Route,
  RequestMethod,
  RequestHandler,
  RequestMiddleware,
} from "./types";

import { Express } from "express";

class Router {
  /**
   * Express App
   */
  public app: Express | null = null;

  /**
   * The entire app routes list
   */
  private routesList: Route[] = [];

  /**
   * Set GET request method route
   */
  public get(
    path: string,
    handler: RequestHandler,
    middleware: RequestMiddleware[] = []
  ): Router {
    return this.route("get", path, handler, middleware);
  }

  /**
   * Set POST request method route
   */
  public post(
    path: string,
    handler: RequestHandler,
    middleware: RequestMiddleware[] = []
  ): Router {
    return this.route("post", path, handler, middleware);
  }

  /**
   * Set PUT request method route
   */
  public put(
    path: string,
    handler: RequestHandler,
    middleware: RequestMiddleware[] = []
  ): Router {
    return this.route("put", path, handler, middleware);
  }

  /**
   * Set PATCH request method route
   */
  public patch(
    path: string,
    handler: RequestHandler,
    middleware: RequestMiddleware[] = []
  ): Router {
    return this.route("patch", path, handler, middleware);
  }

  /**
   * Set DELETE request method route
   */
  public delete(
    path: string,
    handler: RequestHandler,
    middleware: RequestMiddleware[] = []
  ): Router {
    return this.route("delete", path, handler, middleware);
  }

  /**
   * Set Full route details
   */
  public route(
    requestMethod: RequestMethod,
    path: string,
    handler: RequestHandler,
    middleware: RequestMiddleware[] = []
  ): Router {
    const route: Route = {
      path: path,
      handler,
      method: requestMethod,
      middleware,
    };

    this.routesList.push(route);

    return this;
  }

  /**
   * Start the routing system
   *
   */
  public scan(app: Express) {
    this.app = app;

    for (let route of this.routesList) {
      const handlers = [...route.middleware!, route.handler];

      this.app[route.method](route.path, ...handlers);
    }
  }

  /**
   * Get all routes list
   */
  public list(): Route[] {
    return this.routesList;
  }
}

const router = new Router();

export default router;
