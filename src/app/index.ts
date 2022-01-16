import { setRoutes } from "core/application";
import { Route } from "core/types/router";
import HomeController from "./home/controllers/home";
import ProductsController from "./productst/controllers/products";

const routes: Route[] = [
  {
    path: "/",
    handler: HomeController,
  },
  {
    path: "/products",
    handler: ProductsController,
  },
];

setRoutes(routes);
