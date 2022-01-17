import router from "core/router";
import auth from "../middleware/auth";
import ProductsController from "./controllers/products";
import singleProductController from "./controllers/single-product";

router
  .get("/products", ProductsController, [auth])
  .get("/products/:id/:slug", singleProductController, [auth]);

router.group({
  path: "/products",
  middleware: [auth],
  routes: [
    {
      path: "/",
      handler: ProductsController,
    },
    {
      path: "/:id/:slug",
      handler: singleProductController,
    },
  ],
});
