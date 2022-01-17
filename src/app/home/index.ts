import { setRoutes } from "core/application";
import { Route } from "core/types/router";
import HomeController from "./controllers/home";

const routes: Route[] = [
  {
    path: "/",
    handler: HomeController,
  },
];

setRoutes(routes);
