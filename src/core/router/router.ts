import {
  Route,
  RouterGroup,
  RequestMethod,
  RequestHandler,
  RequestMiddleware,
} from "./types";
import {
  Express,
  NextFunction,
  Request as ExpressRequest,
  Response as ExpressResponse,
} from "express";
import { error } from "core/log";
import chalk from "chalk";
import { applicationConfigurations, routerConfigurations } from "config";
import concatRoute from "@mongez/concat-route";
import request from "../http/request";
import response from "../http/response";

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
   */
  public scan(app: Express) {
    this.app = app;

    for (let route of this.routesList) {
      const handlers = [
        ...route.middleware!,
        (expressRequest: ExpressRequest, expressResponse: ExpressResponse) => {
          response.setBaseResponse(expressResponse);
          request.setRequest(expressRequest);
          route.handler(request, response);
        },
      ];

      route.path = concatRoute(
        applicationConfigurations.appPath,
        routerConfigurations.prefix!,
        route.path
      );

      this.app[route.method!](route.path, ...(handlers as any));
    }
  }

  /**
   * Get all routes list
   */
  public list(): Route[] {
    return this.routesList;
  }

  /**
   * Create grouped routes
   */
  public group(group: RouterGroup): Router {
    for (let route of group.routes) {
      const path: string = concatRoute(group.prefix!, route.path);

      const middleware: RequestMiddleware[] = [
        ...(group.middleware || []),
        ...(route.middleware || []),
      ];

      const requestMethod: RequestMethod = (route.method ||
        group.method) as RequestMethod;

      if (!requestMethod) {
        return error(
          chalk.bold.red(
            `Request method must be defined in the group object properties or in route object properties.`
          )
        );
      }

      this.route(requestMethod, path, route.handler, middleware);
    }

    return this;
  }
}

const router = new Router();

export default router;
