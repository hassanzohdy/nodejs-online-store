import { setRoutes } from "core/application";
import { Route } from "core/types/router";
import ProductsController from "./controllers/products";

const routes: Route[] = [
  {
    path: "/products",
    handler: ProductsController,
  },
];

setRoutes(routes);
