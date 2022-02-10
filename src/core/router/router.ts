import {
  Route,
  RouterGroup,
  RequestMethod,
  RequestHandler,
  RequestMiddleware,
} from "./types";
import express, {
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
import Validator from "../validation";
import middlewareList from "./middleware";
import multer from "multer";
import putToPost from "./middleware/put-to-post";
import fileUpload from "express-fileupload";
import { storage } from "utils/path";

class Router {
  /**
   * Express App
   */
  public app: Express | null = null;

  /**
   * The entire app routes list
   */
  private routesList: Route[] = [];

  private fileRoutes: any[] = [];

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
    if (routerConfigurations.putToPost) {
      this.route("post", path, handler, [putToPost, ...middleware]);
    }

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
   * Files route
   */
  public file(
    route: string,
    handler: RequestHandler,
    middleware: RequestMiddleware[] = []
  ) {
    this.fileRoutes.push({
      route,
      handler,
      middleware,
    });
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

    // add the parsers for all requests
    this.app.use(
      // for json content
      express.json(),
      // form-urlencoded
      express.urlencoded({ extended: true }),
      // form-data
      fileUpload({
        useTempFiles: true,
        tempFileDir: storage("tmp"),
      })
    );

    // register the the request/response on each request
    this.app.all(
      "*",
      (
        expressRequest: ExpressRequest,
        expressResponse: ExpressResponse,
        next: NextFunction
      ) => {
        request.setRequest(expressRequest);
        response.setBaseResponse(expressResponse);
        next();
      }
    );

    // loop over all file requests and register it all
    for (let route of this.fileRoutes) {
      app.get(
        concatRoute(applicationConfigurations.appPath, route.route),
        ...middlewareList.list("file"),
        (expressRequest: ExpressRequest, expressResponse: ExpressResponse) => {
          route.handler(request, response);
        }
      );
    }

    middlewareList.list("all").map((middleware: any) => app.use(middleware));

    for (let type in middlewareList.list()) {
      if (["all", "file"].includes(type)) continue;

      let middleware = middlewareList.list(type);

      for (let singleMiddleware of middleware) {
        this.app[type as RequestMethod]("*", singleMiddleware);
      }
    }

    for (let route of this.routesList) {
      const handlers = [
        ...route.middleware!,
        async (
          expressRequest: ExpressRequest,
          expressResponse: ExpressResponse
        ) => {
          // registering it again because request data are not being parsed in the `app.all`
          // @see line 154
          request.setRequest(expressRequest);
          response.setBaseResponse(expressResponse);
          const handler = route.handler as any;

          request.setValidator(null);

          // check if the request handler has a validate static method
          if (handler.validate) {
            // if so, then create a new validator instance
            let validator = new Validator();
            // then set the validator in the request
            request.setValidator(validator);
            // now start validating
            let validationOutput = await handler.validate(
              validator,
              request,
              response
            );

            // if the output of the request is an instance of the validator
            if (validationOutput instanceof Validator) {
              // then start scan the rules
              await validationOutput.scan();
              // if fails, then return a bad request
              // and do not go to the handler
              if (validationOutput.fails) {
                return response.badRequest({
                  errors: validationOutput.errors.list(),
                });
              }
            } else if (validationOutput) {
              // if there is a validation output
              // then just return it
              return validationOutput;
            }
          }

          route.handler(request, response);
        },
      ];

      // append the app path
      // append the route prefix
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
