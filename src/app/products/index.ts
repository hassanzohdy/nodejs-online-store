import { setRoutes } from "core/application";
import { Route } from "core/types/router";
import ProductsController from "./controllers/products";
import singleProductController from "./controllers/single-product";

const routes: Route[] = [
  {
    path: "/products",
    handler: ProductsController,
  },
  {
    path: "/products/:id/:slug",
    handler: singleProductController,
  },
];

setRoutes(routes);
