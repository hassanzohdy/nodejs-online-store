import { Route } from "./types";
import { Express } from "express";

const routesList: Route[] = [];

export function setRoutes(routes: Route[]) {
  for (const route of routes) {
    routesList.push(route);
  }
}

export function setAppRoutes(app: Express) {
  for (let route of routesList) {
    const requestMethod = route.method || "get";

    app[requestMethod](route.path, route.handler);
  }
}
