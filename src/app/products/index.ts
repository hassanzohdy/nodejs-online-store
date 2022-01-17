import { Route } from "core/router";
import auth from "../middleware/auth";
import { setRoutes } from "core/router";
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
