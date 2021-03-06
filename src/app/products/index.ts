import router from "core/router";
import ProductsController from "./controllers/products";
import singleProductController from "./controllers/single-product";

router.group({
  prefix: "/products",
  method: "get",
  routes: [
    {
      path: "",
      middleware: [],
      handler: ProductsController,
    },
    {
      path: "/:id/:slug",
      handler: singleProductController,
    },
  ],
});
